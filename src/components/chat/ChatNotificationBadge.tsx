import {
  useGetPrivateChats,
  useGetGroupChats,
} from "@/lib/react-query/chat-queries";
import { useUserContext, useAuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export const ChatNotificationBadge = () => {
  const { user } = useUserContext();
  const { isAuthenticated } = useAuthContext();
  const { data: privateChats = [] } = useGetPrivateChats(isAuthenticated);
  const { data: groupChats = [] } = useGetGroupChats(isAuthenticated);

  // Count unread messages (simplified - can be enhanced with actual unread count tracking)
  const unreadCount = privateChats.length + groupChats.length;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Link to="/chats" className="relative flex items-center justify-center">
      <img src="/assets/icons/chat.svg" alt="messages" className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-danger-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};
