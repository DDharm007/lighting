import React from "react";
import { Route, Switch } from "wouter";
import "./styles.css";

import Page_f8fc320315184e2198b352d0f98f4f8d from "./pages/Page_f8fc320315184e2198b352d0f98f4f8d";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-x-hidden">
      <Switch>
        <Route path="/" component={Page_f8fc320315184e2198b352d0f98f4f8d} />
      </Switch>
    </div>
  );
}
