import { useRef, useState } from "react";
import {
  useSendMessage,
  useSetTypingStatus,
} from "@/lib/react-query/chat-queries";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  chatId?: string;
  groupChatId?: string;
  onMessageSent?: () => void;
}

export const MessageInput = ({
  chatId,
  groupChatId,
  onMessageSent,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { mutate: sendMessage, isPending } = useSendMessage();
  const { mutate: setTypingStatus } = useSetTypingStatus();

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!isTyping) {
      setIsTyping(true);
      setTypingStatus({
        isTyping: true,
        chatId,
        groupChatId,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingStatus({
        isTyping: false,
        chatId,
        groupChatId,
      });
    }, 1000);
  };

  const handleMediaUpload = (urls: string[]) => {
    setMediaUrls((prev) => [...prev, ...urls]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && mediaUrls.length === 0) return;

    sendMessage(
      {
        content: message,
        chatId,
        groupChatId,
        mediaUrls,
      },
      {
        onSuccess: () => {
          setMessage("");
          setMediaUrls([]);
          setIsTyping(false);
          setTypingStatus({
            isTyping: false,
            chatId,
            groupChatId,
          });
          onMessageSent?.();
        },
      }
    );
  };

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
      {/* Media Preview */}
      {mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-dark-4 rounded-lg">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`preview-${index}`}
                className="h-20 w-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute -top-2 -right-2 bg-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-dark-4 border border-dark-3 rounded-lg px-4 py-2 text-light-1 placeholder:text-light-4 resize-none focus:outline-none focus:border-primary-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
          />
        </div>

        <FileUploader onUpload={handleMediaUpload} maxFiles={3} />

        <Button
          type="submit"
          disabled={isPending || (!message.trim() && mediaUrls.length === 0)}
          className="shad-button_primary">
          {isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
};
