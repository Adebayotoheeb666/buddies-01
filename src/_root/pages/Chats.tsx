import { useState } from "react";
import {
  useGetPrivateChats,
  useGetGroupChats,
} from "@/lib/react-query/chat-queries";
import { ChatDetail } from "@/components/chat/ChatDetail";
import { GroupChatDetail } from "@/components/chat/GroupChatDetail";
import { CreateGroupChatModal } from "@/components/chat/CreateGroupChatModal";
import { ChatWithLastMessage, GroupChatWithMembers } from "@/types/chat.types";
import Loader from "@/components/shared/Loader";

type ChatTab = "private" | "groups";

export const Chats = () => {
  const [activeTab, setActiveTab] = useState<ChatTab>("private");
  const [selectedChat, setSelectedChat] = useState<ChatWithLastMessage | null>(
    null
  );
  const [selectedGroupChat, setSelectedGroupChat] =
    useState<GroupChatWithMembers | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const { data: privateChats = [], isLoading: loadingPrivate } =
    useGetPrivateChats();
  const { data: groupChats = [], isLoading: loadingGroups } =
    useGetGroupChats();

  if (selectedChat) {
    return (
      <ChatDetail chat={selectedChat} onClose={() => setSelectedChat(null)} />
    );
  }

  if (selectedGroupChat) {
    return (
      <GroupChatDetail
        groupChat={selectedGroupChat}
        onClose={() => setSelectedGroupChat(null)}
      />
    );
  }

  return (
    <div className="common-container">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="h2-bold text-light-1">Messages</h1>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="shad-button_primary text-sm px-4">
            New Group
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-dark-4">
          <button
            onClick={() => setActiveTab("private")}
            className={`pb-4 font-semibold ${
              activeTab === "private"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-light-3 hover:text-light-1"
            }`}>
            Direct Messages
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`pb-4 font-semibold ${
              activeTab === "groups"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-light-3 hover:text-light-1"
            }`}>
            Groups
          </button>
        </div>

        {/* Modals */}
        {showCreateGroupModal && (
          <CreateGroupChatModal
            onClose={() => setShowCreateGroupModal(false)}
            onCreated={(group) => {
              setShowCreateGroupModal(false);
              setSelectedGroupChat(group);
            }}
          />
        )}

        {/* Chat List */}
        {activeTab === "private" ? (
          <div className="space-y-2">
            {loadingPrivate ? (
              <div className="flex justify-center py-10">
                <Loader />
              </div>
            ) : privateChats.length === 0 ? (
              <div className="text-center py-10 text-light-4">
                <p>No conversations yet. Start chatting with a friend!</p>
              </div>
            ) : (
              privateChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="p-4 bg-dark-3 hover:bg-dark-4 rounded-lg cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        chat.otherUser?.imageUrl ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt={chat.otherUser?.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-light-1">
                        {chat.otherUser?.name}
                      </h3>
                      <p className="text-sm text-light-4 truncate">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {chat.last_message_at && (
                      <span className="text-xs text-light-3">
                        {new Date(chat.last_message_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {loadingGroups ? (
              <div className="flex justify-center py-10">
                <Loader />
              </div>
            ) : groupChats.length === 0 ? (
              <div className="text-center py-10 text-light-4">
                <p>You haven't joined any groups yet.</p>
              </div>
            ) : (
              groupChats.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupChat(group)}
                  className="p-4 bg-dark-3 hover:bg-dark-4 rounded-lg cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    {group.icon_url ? (
                      <img
                        src={group.icon_url}
                        alt={group.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {group.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-light-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-light-4">
                        {group.member_count} members
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
