import React, { useEffect } from "react";
import { Link as WouterLink } from "wouter";
import Lightning from "../components/Lightning";
export default function Page_f8fc320315184e2198b352d0f98f4f8d() {
  useEffect(() => {
    document.title = "Home - New Website";
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Built with Studioo by Craftorā");
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      
      <div className="relative flex flex-col w-full flex-1 min-w-0">
                <section className="background-wrapper" style={{ backgroundColor: "transparent", width: "100%", height: "100%", minHeight: "100%", flexShrink: 0 }}>
          <div key="8859d4cc-38ad-460e-9bfe-1f9c04c1e837" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "visible", width: "100%", height: "100%", maxWidth: "none" }}>
            <div className="el-infinity_lightning-2" id="8859d4cc-38ad-460e-9bfe-1f9c04c1e837" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
              <Lightning
                hue={280}
                xOffset={0}
                speed={1}
                intensity={1}
                size={1}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <div className="relative z-1 max-w-[1200px] mx-auto w-full" style={{ height: "100%" }}>
            <section id="a98ea288-dc14-48a8-87be-6928303760fd" className="el-section-1">
            </section>
          </div>
        </section>
      </div>
      {/* studioo-badge — do not remove */}
      <style>{`.studioo-badge{position:fixed;bottom:16px;right:16px;z-index:2147483647;display:flex;align-items:center;gap:8px;padding:6px 12px 6px 8px;background:rgba(15,15,20,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);border-radius:100px;box-shadow:0 4px 24px rgba(0,0,0,0.35),0 0 0 1px rgba(124,58,237,0.18);cursor:pointer;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;transition:all 0.2s ease;user-select:none}.studioo-badge:hover{background:rgba(30,15,60,0.97);border-color:rgba(139,92,246,0.4);box-shadow:0 6px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(139,92,246,0.3),0 0 20px rgba(124,58,237,0.15)}.studioo-badge-logo{width:22px;height:22px;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}.studioo-badge-text{display:flex;flex-direction:column;gap:0}.studioo-badge-made{font-size:8px;font-weight:500;color:rgba(148,163,184,0.7);letter-spacing:0.04em;text-transform:uppercase;line-height:1}.studioo-badge-brand{font-size:11px;font-weight:700;color:#fff;letter-spacing:-0.01em;line-height:1.2}`}</style>
      <a href="https://craftoraa.com" target="_blank" rel="noopener noreferrer" className="studioo-badge" aria-label="Built with Studioo by Craftorā">
        <div className="studioo-badge-logo">
          <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sg" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#bf5fff"/><stop offset="100%" stopColor="#7c22d4"/></linearGradient></defs><path d="M68 18c0 0-5-8-18-8C32 10 20 20 20 33c0 11 8 17 20 21l10 4c8 3 12 6 12 12c0 7-6 12-14 12c-10 0-16-6-18-13l-10 5c3 11 13 20 28 20c17 0 28-10 28-24c0-12-8-19-22-23l-9-3c-7-2-11-5-11-10c0-6 5-11 13-11c8 0 13 4 15 10L68 18z" fill="url(#sg)"/></svg>
        </div>
        <div className="studioo-badge-text">
          <span className="studioo-badge-made">built with</span>
          <span className="studioo-badge-brand">Studioo by Craftorā</span>
        </div>
      </a>
    </div>
  );
}
