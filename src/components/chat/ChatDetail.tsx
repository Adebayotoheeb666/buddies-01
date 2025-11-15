import { useEffect, useRef } from "react";
import { ChatWithLastMessage } from "@/types/chat.types";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPrivateChatMessages,
  useMarkMessageAsRead,
} from "@/lib/react-query/chat-queries";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { supabase } from "@/lib/supabase/config";

interface ChatDetailProps {
  chat: ChatWithLastMessage;
  onClose?: () => void;
}

export const ChatDetail = ({ chat, onClose }: ChatDetailProps) => {
  const { user } = useUserContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: messages = [], isLoading } = useGetPrivateChatMessages(chat.id);
  const { mutate: markAsRead } = useMarkMessageAsRead();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    messages.forEach((message) => {
      if (message.sender_id !== user.id) {
        const isRead = message.read_by?.some((r) => r.user_id === user.id);
        if (!isRead) {
          markAsRead(message.id);
        }
      }
    });
  }, [messages, user.id, markAsRead]);

  // Subscribe to real-time messages
  useEffect(() => {
    const subscription = supabase
      .channel(`chat:${chat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        () => {
          // Messages are automatically fetched by React Query
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chat.id]);

  const otherUser = chat.otherUser;

  return (
    <div className="flex flex-col h-full bg-dark-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-4">
        <div className="flex items-center gap-3">
          <img
            src={otherUser?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt={otherUser?.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-light-1">{otherUser?.name}</h3>
            <p className="text-xs text-light-3">@{otherUser?.username}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-light-3 hover:text-light-1">
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-light-4">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-light-4">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-4">
        <MessageInput chatId={chat.id} />
      </div>
    </div>
  );
};
