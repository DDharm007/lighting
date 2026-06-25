import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Stepper.css';

export function Step({ children }) {
  return <div className="stepper-step-default">{children}</div>;
}

function StepContentWrapper({
  isCompleted, currentStep, direction, children, className = ''
}) {
  const [parentHeight, setParentHeight] = useState(0);
  return (
    <motion.div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit:  (dir) => ({ x: dir >= 0 ? '50%' : '-50%', opacity: 0 }),
};

function SlideTransition({
  children, direction, onHeightReady
}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);
  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

function StepIndicator({
  step, currentStep, onClickStep, disableStepIndicators = false, accentColor = '#5227FF'
}) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  return (
    <motion.div
      onClick={() => { if (step !== currentStep && !disableStepIndicators) onClickStep(step); }}
      className="stepper-indicator"
      style={disableStepIndicators ? { pointerEvents: 'none', opacity: 0.5 } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        className="stepper-indicator-inner"
        variants={{
          inactive: { scale: 1, backgroundColor: '#222', color: '#a3a3a3' },
          active:   { scale: 1, backgroundColor: accentColor, color: accentColor },
          complete: { scale: 1, backgroundColor: accentColor, color: '#fff' },
        }}
        transition={{ duration: 0.3 }}
      >
        {status === 'complete' ? (
          <CheckIcon className="stepper-check-icon" />
        ) : status === 'active' ? (
          <div className="stepper-active-dot" />
        ) : (
          <span className="stepper-step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete, accentColor = '#5227FF' }) {
  return (
    <div className="stepper-connector">
      <motion.div
        className="stepper-connector-fill"
        variants={{
          incomplete: { width: 0, backgroundColor: 'transparent' },
          complete:   { width: '100%', backgroundColor: accentColor },
        }}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function Stepper({
  children,
  steps,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  accentColor = '#5227FF',
  cardBg = '#ffffff',
  cardBorderColor = '#222222',
  cardTextColor = '#111111',
  ...rest
}) {
  const stepsArray = steps?.length
    ? steps.map((s, i) => (
        <div key={i} className="stepper-step-default">
          {s.image && <img src={s.image} alt={s.title || `Step ${i + 1}`} className="w-full h-auto rounded-lg mb-4 object-cover max-h-48" />}
          {s.title && <h3 style={{ color: cardTextColor, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{s.title}</h3>}
          {s.description && <p style={{ color: cardTextColor, opacity: 0.7 }}>{s.description}</p>}
        </div>
      ))
    : Children.toArray(children);

  const totalSteps = stepsArray.length;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);

  const isCompleted = currentStep > totalSteps;
  const isLastStep  = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) { setDirection(-1); updateStep(currentStep - 1); }
  };
  const handleNext = () => {
    if (!isLastStep) { setDirection(1); updateStep(currentStep + 1); }
  };
  const handleComplete = () => { setDirection(1); updateStep(totalSteps + 1); };

  const cssVars = {
    '--stepper-accent': accentColor,
    '--stepper-dot-color': cardBg,
  };

  return (
    <div className="stepper-outer" style={cssVars} {...rest}>
      <div
        className={`stepper-card ${stepCircleContainerClassName}`}
        style={{ border: `1px solid ${cardBorderColor}`, background: cardBg }}
      >
        <div className={`stepper-indicator-row ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  disableStepIndicators={disableStepIndicators}
                  currentStep={currentStep}
                  accentColor={accentColor}
                  onClickStep={clicked => {
                    setDirection(clicked > currentStep ? 1 : -1);
                    updateStep(clicked);
                  }}
                />
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} accentColor={accentColor} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`stepper-content-wrap ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`stepper-footer ${footerClassName}`}>
            <div className={`stepper-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`stepper-back-btn${currentStep === 1 ? ' inactive' : ''}`}
                  style={{ color: cardTextColor, opacity: 0.5 }}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="stepper-next-btn"
                style={{ background: accentColor }}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div style={{ textAlign: 'center', padding: '2rem', color: cardTextColor }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              ✅
            </motion.div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>All steps completed!</p>
          </div>
        )}
      </div>
    </div>
  );
}
