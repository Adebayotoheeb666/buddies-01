import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { AlertCircle, RefreshCw } from "lucide-react";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";

const RootLayout = () => {
  const { isAuthenticated, isLoading, error, checkAuthUser } =
    useAuthContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkAuthUser();
    setIsRetrying(false);
  };

  useEffect(() => {
    // Redirect to sign-in if not authenticated and auth is done loading
    if (!isLoading && !isAuthenticated && !error) {
      navigate("/sign-in", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, error]);

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
      <div className="flex h-screen items-center justify-center bg-dark-1">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-light-2 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (error && !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-1 p-4">
        <div className="max-w-md w-full bg-dark-2 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-light-1 mb-2">
            Authentication Error
          </h2>
          <p className="text-light-2 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/sign-in", { replace: true })}
              className="flex-1 px-4 py-2 bg-dark-3 hover:bg-dark-4 text-light-1 rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </div>
        </div>
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
