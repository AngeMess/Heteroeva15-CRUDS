// src/components/Navegation.jsx
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import Home from "../pages/Home";
import Employees from "../pages/Employees";
import Blog from "../pages/Blog";
import Products from "../pages/Products";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

function Navegation() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route>
          <Route path="/home" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/products" element={<Products />} />     
        </Route>
      </Routes>
    </>
  );
}

export default Navegation;