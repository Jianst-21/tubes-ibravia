import React from "react";
import { Link } from "react-router-dom";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

const Footer = () => {
  return (
    <footer className="bg-[#063B73] text-white py-12">

      {/* WRAPPER SAMA EXACT DENGAN NAVBAR */}
      <div className="w-full px-16 flex flex-col md:flex-row justify-between items-center mb-10">

        {/* LOGO + BRAND */}
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

        {/* MENU */}
        <nav className="flex flex-wrap justify-center gap-8 text-[16px] font-semibold mt-6 md:mt-0">
          <Link to="/" className="hover:opacity-75 transition">Home</Link>
          <Link to="/Properties" className="hover:opacity-75 transition">Properties</Link>
          <Link to="/Reservation" className="hover:opacity-75 transition">Reservation</Link>
          <Link to="/AboutUs" className="hover:opacity-75 transition">About Us</Link>
          <Link to="/Contact" className="hover:opacity-75 transition">Contact Us</Link>
        </nav>
      </div>

      {/* LINE */}
      <div className="w-full border-t border-white/25" />

      {/* BOTTOM CREDIT (SAMA RULE PADDING) */}
      <div className="w-full px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-200 text-[14px] mt-10">
        <p className="font-medium">Ibravia © 2025. All Rights Reserved.</p>
        <p className="font-medium text-center md:text-right">
          Ibravia is not responsible for transactions outside the platform.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
