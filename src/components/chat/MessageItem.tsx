import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { IMessage, IMessageReaction } from "@/types/chat.types";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useDeleteMessage, useEditMessage, useAddReaction, useRemoveReaction } from "@/lib/react-query/chat-queries";

interface MessageItemProps {
  message: IMessage;
  onReply?: (message: IMessage) => void;
}

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export const MessageItem = ({ message, onReply }: MessageItemProps) => {
  const { user } = useUserContext();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: editMessage } = useEditMessage();
  const { mutate: addReaction } = useAddReaction();
  const { mutate: removeReaction } = useRemoveReaction();

  const isOwn = message.sender_id === user.id;
  const isDeleted = message.is_deleted;

  const handleEdit = () => {
    if (editText.trim()) {
      editMessage({
        messageId: message.id,
        newContent: editText,
      });
      setIsEditing(false);
    }
  };

  const handleReaction = (emoji: string) => {
    const hasReaction = message.reactions?.some(
      (r) => r.emoji === emoji && r.user_id === user.id
    );

    if (hasReaction) {
      removeReaction({ messageId: message.id, emoji });
    } else {
      addReaction({ messageId: message.id, emoji });
    }
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`flex gap-2 mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}>
      {!isOwn && message.sender && (
        <img
          src={message.sender.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={message.sender.name}
          className="h-8 w-8 rounded-full"
        />
      )}

      <div className={isOwn ? "order-2" : "order-1"}>
        {!isOwn && message.sender && (
          <p className="text-xs text-light-3 mb-1">{message.sender.name}</p>
        )}

        <div
          className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md break-words ${
            isOwn
              ? "bg-primary-500 text-white"
              : "bg-dark-4 text-light-1"
          }`}>
          {isEditing ? (
            <div className="flex gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 bg-dark-3 text-white text-sm p-2 rounded"
              />
              <button
                onClick={handleEdit}
                className="text-sm font-semibold hover:opacity-80">
                Save
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm">{message.content}</p>
              {message.is_edited && !isDeleted && (
                <p className="text-xs opacity-70 mt-1">(edited)</p>
              )}
            </>
          )}

          {message.media_urls && message.media_urls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.media_urls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`attachment-${idx}`}
                  className="max-w-xs rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Array.from(
              new Map(message.reactions.map((r) => [r.emoji, r])).entries()
            ).map(([emoji, reaction]) => {
              const count = message.reactions?.filter(
                (r) => r.emoji === emoji
              ).length || 0;
              const userReacted = message.reactions?.some(
                (r) => r.emoji === emoji && r.user_id === user.id
              );
              return (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    userReacted
                      ? "bg-primary-500 text-white"
                      : "bg-dark-4 text-light-3 hover:bg-dark-3"
                  }`}>
                  {emoji} {count}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-1 mt-1 text-xs text-light-4">
          <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Message Actions */}
      {showActions && !isDeleted && (
        <div className="flex gap-1 items-start pt-2">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-lg hover:opacity-70">
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute top-8 right-0 bg-dark-3 rounded-lg p-2 flex gap-1 z-10">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-lg hover:scale-125">
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isOwn && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-light-3 hover:text-light-1">
                ✏️
              </button>
              <button
                onClick={() => deleteMessage(message.id)}
                className="text-sm text-red hover:opacity-70">
                🗑️
              </button>
            </>
          )}

          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="text-sm text-light-3 hover:text-light-1">
              ↩️
            </button>
          )}
        </div>
      )}
    </div>
  );
};
