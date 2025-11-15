import { useEffect, useRef, useState } from "react";
import { GroupChatWithMembers } from "@/types/chat.types";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetGroupChatMessages,
  useMarkMessageAsRead,
  useRemoveGroupMember,
  useLeaveGroupChat,
  useUpdateGroupChat,
} from "@/lib/react-query/chat-queries";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/config";

interface GroupChatDetailProps {
  groupChat: GroupChatWithMembers;
  onClose?: () => void;
}

export const GroupChatDetail = ({
  groupChat,
  onClose,
}: GroupChatDetailProps) => {
  const { user } = useUserContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [groupName, setGroupName] = useState(groupChat.name);
  const [groupDescription, setGroupDescription] = useState(
    groupChat.description || ""
  );

  const { data: messages = [], isLoading } = useGetGroupChatMessages(
    groupChat.id
  );
  const { mutate: markAsRead } = useMarkMessageAsRead();
  const { mutate: removeMember } = useRemoveGroupMember();
  const { mutate: leaveGroup } = useLeaveGroupChat();
  const { mutate: updateGroup } = useUpdateGroupChat();

  const isAdmin = groupChat.members?.some(
    (m) => m.user_id === user.id && m.role === "admin"
  );

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
      .channel(`group:${groupChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_chat_id=eq.${groupChat.id}`,
        },
        (payload) => {
          // Messages are automatically fetched by React Query
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [groupChat.id]);

  const handleUpdateGroup = () => {
    updateGroup(
      {
        groupChatId: groupChat.id,
        updates: {
          name: groupName,
          description: groupDescription,
        },
      },
      {
        onSuccess: () => {
          setShowSettings(false);
        },
      }
    );
  };

  const handleRemoveMember = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      removeMember({ groupChatId: groupChat.id, userId });
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-4">
        <div className="flex-1">
          <h3 className="font-semibold text-light-1">{groupChat.name}</h3>
          <p className="text-xs text-light-3">
            {groupChat.member_count} members
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="text-light-3 hover:text-light-1 text-sm">
            👥
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-light-3 hover:text-light-1 text-sm">
              ⚙️
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-light-3 hover:text-light-1">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-light-4">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-light-4">
                  No messages yet. Be the first to message!
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
            <MessageInput groupChatId={groupChat.id} />
          </div>
        </div>

        {/* Sidebar - Members or Settings */}
        {(showMembers || showSettings) && (
          <div className="w-64 border-l border-dark-4 overflow-y-auto p-4 bg-dark-3">
            {showSettings && isAdmin ? (
              // Settings Panel
              <div className="space-y-4">
                <h3 className="font-semibold text-light-1">Group Settings</h3>

                <div>
                  <label className="text-sm text-light-3 mb-2 block">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-dark-4 border border-dark-3 rounded px-3 py-2 text-light-1 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-light-3 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="w-full bg-dark-4 border border-dark-3 rounded px-3 py-2 text-light-1 focus:outline-none focus:border-primary-500 resize-none h-20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateGroup}
                    className="shad-button_primary flex-1 text-sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    className="shad-button_dark_4 flex-1 text-sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Members Panel
              <div className="space-y-3">
                <h3 className="font-semibold text-light-1">Members</h3>

                {groupChat.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 bg-dark-4 rounded">
                    <div className="flex-1">
                      <p className="text-sm text-light-1">
                        {member.user_id === user.id ? "You" : member.user_id}
                      </p>
                      {member.role === "admin" && (
                        <p className="text-xs text-secondary-500">Admin</p>
                      )}
                    </div>

                    {isAdmin &&
                      member.user_id !== user.id &&
                      member.role !== "admin" && (
                        <button
                          onClick={() => handleRemoveMember(member.user_id)}
                          className="text-sm text-red hover:opacity-70">
                          ✕
                        </button>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Leave Group */}
            <Button
              onClick={() => {
                if (confirm("Are you sure you want to leave this group?")) {
                  leaveGroup(groupChat.id);
                  onClose?.();
                }
              }}
              className="shad-button_dark_4 w-full mt-4 text-sm">
              Leave Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
