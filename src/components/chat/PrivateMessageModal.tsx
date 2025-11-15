import { useState } from "react";
import { useGetOrCreatePrivateChat } from "@/lib/react-query/chat-queries";
import { Button } from "@/components/ui/button";

interface PrivateMessageModalProps {
  userId: string;
  userName: string;
  userImage?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PrivateMessageModal = ({
  userId,
  userName,
  userImage,
  onClose,
  onSuccess,
}: PrivateMessageModalProps) => {
  const [message, setMessage] = useState("");
  const { mutate: createChat } = useGetOrCreatePrivateChat();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    createChat(userId, {
      onSuccess: () => {
        setMessage("");
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg p-6 max-w-md w-full">
        <h2 className="h3-bold text-light-1 mb-4">Message {userName}</h2>

        <div className="flex items-center gap-3 mb-6">
          <img
            src={userImage || "/assets/icons/profile-placeholder.svg"}
            alt={userName}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-light-1">{userName}</p>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your first message..."
            className="w-full bg-dark-4 border border-dark-3 rounded-lg px-4 py-2 text-light-1 placeholder:text-light-4 focus:outline-none focus:border-primary-500 resize-none h-24"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!message.trim()}
              className="shad-button_primary flex-1">
              Send Message
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="shad-button_dark_4 flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
