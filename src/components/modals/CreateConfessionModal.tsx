import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createConfession } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface CreateConfessionModalProps {
  onClose: () => void;
}

const CreateConfessionModal = ({ onClose }: CreateConfessionModalProps) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    anonymityStatus: "fully_anonymous",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim() || !user) {
      alert("Please enter your confession");
      return;
    }

    setIsCreating(true);
    try {
      await createConfession(user.id, formData.content, formData.anonymityStatus);

      queryClient.invalidateQueries({ queryKey: ["confessions"] });

      alert("Confession submitted! It will appear once approved by moderators.");
      onClose();
    } catch (error) {
      console.error("Error creating confession:", error);
      alert("Failed to submit confession");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg max-w-md w-full p-6 border border-dark-3">
        <h2 className="text-2xl font-bold mb-4">Share a Confession</h2>

        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-200">
            🔒 Your confession will be moderated for safety and respect.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anonymity Option */}
          <div>
            <label className="block text-sm font-medium mb-2">Anonymity</label>
            <select
              name="anonymityStatus"
              value={formData.anonymityStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="fully_anonymous">Fully Anonymous</option>
              <option value="visible_to_friends">Visible to Friends</option>
            </select>
            <p className="text-xs text-light-3 mt-1">
              {formData.anonymityStatus === "fully_anonymous"
                ? "No one will know this is from you"
                : "Your friends can see this is from you"}
            </p>
          </div>

          {/* Confession Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Confession *
            </label>
            <textarea
              name="content"
              placeholder="Share what's on your mind... (be respectful and constructive)"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 h-32 resize-none"
            />
            <p className="text-xs text-light-3 mt-1">
              {formData.content.length} / 1000 characters
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-dark-4 rounded-lg p-3 text-xs text-light-3 space-y-1">
            <p className="font-semibold">Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No hate speech or discrimination</li>
              <li>Keep it respectful and constructive</li>
              <li>No identifying information</li>
              <li>No spam or self-promotion</li>
            </ul>
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
              disabled={isCreating || !formData.content.trim()}
            >
              {isCreating ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConfessionModal;
