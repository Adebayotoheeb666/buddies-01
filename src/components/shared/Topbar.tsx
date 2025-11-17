import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { ChatNotificationBadge } from "../chat/ChatNotificationBadge";

interface TopbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Topbar = ({ onMenuToggle, isMenuOpen }: TopbarProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar bg-dark-2 border-b border-dark-4">
      <div className="flex-between py-3 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-dark-4/50 transition-colors hamburger-button"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-5 h-0.5 bg-light-1 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`} />
            <span className={`block w-5 h-0.5 bg-light-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1.5'}`} />
            <span className={`block w-5 h-0.5 bg-light-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/images/logo.svg"
              alt="logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="h3-bold text-primary-500 hidden sm:block">
              Buddies
            </span>
          </Link>
        </div>

        <div className="flex gap-4">
          <ChatNotificationBadge />
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
