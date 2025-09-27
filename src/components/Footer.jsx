import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {currentYear} ShopSphere. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Built with React, Tailwind CSS, and Firebase.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
