import React from "react";
import {  BrowserRouter as Router } from "react-router-dom";
import Navegation from "../components/Navegation";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {

  return (
    <>
      <Router>
        <Navegation />
      </Router>
      <Toaster
        toastOptions={{
          duration: 1000,
        }}
      />
      <Toaster
        toastOptions={{
          duration: 1000,
        }}
      />
    </>
  )
}

export default App
