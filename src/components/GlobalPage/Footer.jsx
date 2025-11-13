import React from "react";
import { Link } from "react-router-dom";
import LogoPutih from "../../assets/images/logo/Logo Putih.png";

const Footer = () => {
  return (
    <footer className="bg-[#063B73] text-white py-8">
      {/* Bagian atas: logo dan menu */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src={LogoPutih}
            alt="Ibravia Logo"
            className="h-8 w-auto mr-2"
          />
          <h1 className="text-lg font-bold">IBRAVIA</h1>
        </div>

        <nav className="flex space-x-6 text-sm">
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
      <div className="border-t border-gray-400 opacity-50 my-4 w-[90%] mx-auto" />

      {/* Bagian bawah: copyright */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-sm text-gray-300">
        <p>Ibravia © 2025. All Rights Reserved.</p>
        <p>Ibravia is not responsible for transactions outside the platform.</p>
      </div>
    </footer>
  );
};

export default Footer;
