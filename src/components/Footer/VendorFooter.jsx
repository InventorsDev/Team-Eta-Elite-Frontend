import { Link } from "react-router-dom";

const VendorFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 px-6 sm:px-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center"
          >
            <span className="text-black font-bold">S</span>
          </div>

          <div className="leading-tight">
            <div className="font-bold text-lg">SAFELINK</div>
            <div className="text-sm text-gray-300">Secure links, trusted vendors</div>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 sm:gap-8">
          <Link to="/" className="text-sm text-gray-300 hover:text-white">Home</Link>
          <Link to="/about" className="text-sm text-gray-300 hover:text-white">About</Link>
          <Link to="/contact" className="text-sm text-gray-300 hover:text-white">Contact</Link>
          <Link to="/terms" className="text-sm text-gray-300 hover:text-white">Terms</Link>
          <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy</Link>
          <Link to="/help" className="text-sm text-gray-300 hover:text-white">Help</Link>
          <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-800 pt-4 text-center text-sm text-gray-400">
        © {year} Safelink. All rights reserved.
      </div>
    </footer>
  );
};

export default VendorFooter;