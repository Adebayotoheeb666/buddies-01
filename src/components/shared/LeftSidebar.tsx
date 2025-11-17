import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

interface LeftSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const LeftSidebar = ({ isMobile = false, onLinkClick }: LeftSidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const { mutate: signOut } = useSignOutAccount();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    Core: true,
    Academic: true,
    Study: true,
    Resources: false,
    Campus: false,
    Social: false,
    Career: false,
    "Safety & Wellness": false,
    Admin: false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupedLinks = sidebarLinks.reduce(
    (acc, link) => {
      const category = link.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    },
    {} as Record<string, INavLink[]>
  );

  const categoryOrder = [
    "Core",
    "Academic",
    "Study",
    "Resources",
    "Campus",
    "Social",
    "Career",
    "Safety & Wellness",
    "Admin",
  ];

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };


  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 w-full">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={36}
            height={36}
          />
          <span className="h3-bold text-primary-500">Buddies</span>
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link
            to={`/profile/${user.id}`}
            className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-280px)]">
          {categoryOrder.map((category) => {
            const links = groupedLinks[category];
            if (!links) return null;

            const isExpanded = expandedCategories[category];

            return (
              <div key={category} className="flex flex-col gap-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex gap-3 items-center px-4 py-2 text-light-2 hover:bg-dark-4 rounded-lg transition font-semibold text-sm">
                  <span className="text-base">{isExpanded ? "▼" : "▶"}</span>
                  {category}
                </button>

                {isExpanded && (
                  <ul className="flex flex-col gap-2 pl-4">
                    {links.map((link: INavLink) => {
                      const isActive = pathname === link.route;

                      return (
                        <li
                          key={link.label}
                          className={`leftsidebar-link group ${
                            isActive && "bg-primary-500"
                          }`}>
                          <NavLink
                            key={link.label}
                            to={link.route}
                            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium hover:bg-dark-4"
                            onClick={() => {
                              if (isMobile && onLinkClick) {
                                onLinkClick();
                              }
                              // Don't prevent default to allow navigation
                            }}
                          >
                            <img
                              src={link.imgURL}
                              alt={link.label}
                              className={`group-hover:invert-white ${
                                isActive && "invert-white"
                              }`}
                            />
                            {link.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
