import { useState } from "react";
import { useCreateGroupChat } from "@/lib/react-query/chat-queries";
import { GroupChatWithMembers } from "@/types/chat.types";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/FileUploader";

interface CreateGroupChatModalProps {
  onClose: () => void;
  onCreated: (group: GroupChatWithMembers) => void;
}

export const CreateGroupChatModal = ({
  onClose,
  onCreated,
}: CreateGroupChatModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [iconUrl, setIconUrl] = useState("");

  const { mutate: createGroup, isPending } = useCreateGroupChat();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    createGroup(
      {
        name: groupName,
        description,
        isPublic,
        iconUrl,
      },
      {
        onSuccess: (newGroup) => {
          onCreated(newGroup as any);
        },
      }
    );
  };

  const handleIconUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setIconUrl(urls[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg p-6 max-w-md w-full">
        <h2 className="h3-bold text-light-1 mb-4">Create Group Chat</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Group Icon */}
          <div>
            <label className="text-sm text-light-3 mb-2 block">
              Group Icon (Optional)
            </label>
            <div className="flex gap-2">
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt="group icon"
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <FileUploader onUpload={handleIconUpload} maxFiles={1} />
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="text-sm text-light-3 mb-2 block">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full bg-dark-4 border border-dark-3 rounded-lg px-4 py-2 text-light-1 placeholder:text-light-4 focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-light-3 mb-2 block">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter group description"
              className="w-full bg-dark-4 border border-dark-3 rounded-lg px-4 py-2 text-light-1 placeholder:text-light-4 focus:outline-none focus:border-primary-500 resize-none h-20"
            />
          </div>

          {/* Public Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-dark-3"
            />
            <label htmlFor="isPublic" className="text-sm text-light-3">
              Make group public (anyone can join)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isPending || !groupName.trim()}
              className="shad-button_primary flex-1">
              {isPending ? "Creating..." : "Create Group"}
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
