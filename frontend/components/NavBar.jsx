import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/home", label: "Inicio" },
    { to: "/employees", label: "Empleados" },
    { to: "/blog", label: "Blog" },
    { to: "/products", label: "Productos" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo con animación de cambio de colores */}
          <div className="flex-shrink-0 text-xl font-bold tracking-widest uppercase">
            <span className="text-cyan-400 animate-gradientText">CRUDS</span>
          </div>

          {/* Hamburguesa (solo móvil) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-cyan-400 focus:outline-none transition duration-300"
            >
              ☰
            </button>
          </div>

          {/* Menú desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative text-sm font-semibold tracking-wide uppercase transition-all duration-300 ease-in-out"
              >
                <span className="navLink-hover">{item.label}</span>
                {/* Barra animada debajo de los enlaces */}
                <span className="absolute left-0 bottom-0 block w-0 h-1 bg-cyan-400 transition-all duration-300 ease-in-out"></span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-2 bg-white">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium uppercase transition-all duration-300 ease-in-out"
            >
              <span className="navLink-hover">{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
