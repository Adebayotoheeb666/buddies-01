import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Redirect to sign-in if not authenticated and auth is done loading
    if (!isLoading && !isAuthenticated) {
      navigate("/sign-in", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMobileMenuOpen &&
        !target.closest(".leftsidebar") &&
        !target.closest(".hamburger-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full flex flex-col min-h-screen">
      <Topbar onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />

      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full z-50 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}>
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <section className="flex-1 h-full w-full lg:pl-64 transition-all duration-300">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </section>
      </div>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
