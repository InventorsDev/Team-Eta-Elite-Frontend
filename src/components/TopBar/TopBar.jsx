const TopBar = ({ onMenuClick }) => {

  return (
      <header className="md:hidden flex items-center justify-between px-4 py-2.5 shadow-md">
         {/* Logo */}
         <div className="font-headings text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-[var(--primary-color)]">
         SAFELINK
         </div>

         {/* Hamburger */}
         <button
            className="md:hidden cursor-pointer transition-all hover:scale-105"
            onClick={onMenuClick}
            aria-label="Open Menu"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth={1.7}
               stroke="#4B5563"
               className="size-8"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
               />
            </svg>
         </button>
      </header>
  );
};

export default TopBar;
