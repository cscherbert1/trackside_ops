import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSetupOpen, setMobileSetupOpen] = useState(false);
  const [desktopSetupOpen, setDesktopSetupOpen] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileSetupOpen(false);
    setDesktopSetupOpen(false);
  };

  // Close desktop dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setDesktopSetupOpen(false);
      }
    };

    if (desktopSetupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [desktopSetupOpen]);

  const navLinkClass = "hover:underline";

  return (
    <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <span className="text-lg font-semibold">Trackside Ops</span>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 items-center relative">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>

        {/* Setup dropdown (click to open) */}
        <div className="relative" ref={desktopDropdownRef}>
          <button
            onClick={() => setDesktopSetupOpen(!desktopSetupOpen)}
            className="flex items-center gap-1"
          >
            Setup <ChevronDown className={`w-4 h-4 transition-transform ${desktopSetupOpen ? "rotate-180" : ""}`} />
          </button>

          {desktopSetupOpen && (
            <div className="absolute left-0 mt-2 bg-slate-800 text-white rounded shadow-md z-50 min-w-[160px]">
              <NavLink to="setup/layouts" className="block px-4 py-2 hover:bg-slate-700" onClick={closeMenu}>Layouts</NavLink>
              <NavLink to="setup/cars" className="block px-4 py-2 hover:bg-slate-700" onClick={closeMenu}>Cars</NavLink>
              <NavLink to="setup/industries" className="block px-4 py-2 hover:bg-slate-700" onClick={closeMenu}>Industries</NavLink>
            </div>
          )}
        </div>

        <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-white"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-900 px-4 py-4 flex flex-col gap-4 text-white md:hidden z-50">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>

          <button
            onClick={() => setMobileSetupOpen(!mobileSetupOpen)}
            className="flex items-center justify-between w-full"
          >
            <span>Setup</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${mobileSetupOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileSetupOpen && (
            <div className="pl-4 flex flex-col gap-2">
              <NavLink to="setup/layouts" onClick={closeMenu}>Layouts</NavLink>
              <NavLink to="setup/cars" onClick={closeMenu}>Cars</NavLink>
              <NavLink to="setup/industries" onClick={closeMenu}>Industries</NavLink>
            </div>
          )}

          <NavLink to="/settings" onClick={closeMenu}>Settings</NavLink>
        </div>
      )}
    </nav>
  );
}
