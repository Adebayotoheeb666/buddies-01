import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createMemePost, uploadFile, getFilePreview } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface CreateMemeModalProps {
  onClose: () => void;
}

const CreateMemeModal = ({ onClose }: CreateMemeModalProps) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !user) {
      alert("Please select an image");
      return;
    }

    setIsCreating(true);
    try {
      const uploadedFile = await uploadFile(imageFile);
      if (!uploadedFile) throw new Error("Failed to upload image");

      const imageUrl = getFilePreview(uploadedFile.name);
      if (!imageUrl) throw new Error("Failed to get image URL");

      await createMemePost(user.id, imageUrl, caption);

      queryClient.invalidateQueries({ queryKey: ["memeBoard"] });

      alert("Meme shared successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating meme:", error);
      alert("Failed to share meme");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg max-w-md w-full p-6 border border-dark-3">
        <h2 className="text-2xl font-bold mb-4">Share a Meme</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Meme Image *</label>
            <div className="bg-dark-4 border-2 border-dashed border-dark-3 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-center py-8">
                    <p className="text-light-3 text-sm mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption (optional)</label>
            <textarea
              placeholder="Add a caption for your meme"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 h-16 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-4 text-white hover:bg-dark-3"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              disabled={isCreating || !imageFile}
            >
              {isCreating ? "Sharing..." : "Share Meme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMemeModal;
