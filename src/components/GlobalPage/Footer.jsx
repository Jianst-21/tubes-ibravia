import React from "react";
import { Link } from "react-router-dom";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

const Footer = () => {
  return (
    <footer className="bg-[#063B73] text-white pt-8 pb-[55px]">
      {/* Bagian atas: logo dan menu */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 mb-[41px]">
        {/* Logo + Nama */}
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src={LogoPutih}
            alt="Ibravia Logo"
            className="w-[50px] h-[50px] mr-3 object-contain"
          />
          <h1 className="text-xl font-bold tracking-wide">IBRAVIA</h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex space-x-6 text-sm font-medium">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/properties" className="hover:underline">
            Properties
          </Link>
          <Link to="/reservation" className="hover:underline">
            Reservation
          </Link>
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact Us
          </Link>
        </nav>
      </div>

      {/* Garis pemisah */}
      <div className="border-t border-gray-400 opacity-50 w-[90%] max-w-7xl mx-auto" />

      {/* Bagian bawah */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 mt-[55px] text-sm text-gray-300">
        <p>Ibravia © 2025. All Rights Reserved.</p>
        <p>Ibravia is not responsible for transactions outside the platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
