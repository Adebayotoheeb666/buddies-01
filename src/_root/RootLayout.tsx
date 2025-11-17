import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    // Redirect to sign-in if not authenticated and auth is done loading
    if (!isLoading && !isAuthenticated) {
      navigate("/sign-in", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
    <div className="w-full flex flex-col md:flex min-h-screen">
      <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <LeftSidebar isMobile={false} onLinkClick={closeSidebar} />

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 md:hidden z-30"
              onClick={closeSidebar}
            />
            <div className="fixed left-0 top-16 bottom-0 w-72 bg-dark-2 z-40 overflow-y-auto md:hidden">
              <LeftSidebar isMobile={true} onLinkClick={closeSidebar} />
            </div>
          </>
        )}

        <section className="flex flex-1 h-full">
          <Outlet />
        </section>
      </div>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
