import React from "react";
import { Link } from "react-router-dom";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

const Footer = () => {
  return (
    <footer className="bg-[#063B73] text-white py-12">
      
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center mb-10">

        {/* Logo + Name */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={LogoPutih}
            alt="Ibravia Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-[24px] tracking-wide">
            IBRAVIA
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-8 text-[16px] font-semibold mt-6 md:mt-0">
          <Link to="/" className="hover:opacity-75 transition">Home</Link>
          <Link to="/properties" className="hover:opacity-75 transition">Properties</Link>
          <Link to="/reservation" className="hover:opacity-75 transition">Reservation</Link>
          <Link to="/aboutus" className="hover:opacity-75 transition">About Us</Link>
          <Link to="/contact" className="hover:opacity-75 transition">Contact Us</Link>
        </nav>
      </div>

      {/* Divider line */}
      <div className="w-full border-t border-white/30" />

      {/* BOTTOM TEXT */}
      <div className="max-w-7xl mx-auto px-16 flex flex-col md:flex-row justify-between items-center text-[14px] text-gray-200 mt-10 gap-4">
        <p className="font-medium">Ibravia © 2025. All Rights Reserved.</p>
        <p className="text-center md:text-right font-medium">
          Ibravia is not responsible for transactions outside the platform.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
