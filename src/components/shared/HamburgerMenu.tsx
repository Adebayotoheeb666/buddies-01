import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface HamburgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const HamburgerMenu = ({ isOpen, toggleMenu }: HamburgerMenuProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      toggleMenu();
    }
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md transition-colors duration-200 ${
        isScrolled ? "bg-dark-4/50" : ""
      }`}
      onClick={toggleMenu}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <span
        className={`block w-6 h-0.5 bg-light-1 transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-light-1 transition-all duration-300 ${
          isOpen ? "opacity-0" : "mb-1.5"
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-light-1 transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerMenu;
