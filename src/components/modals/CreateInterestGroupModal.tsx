import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createInterestGroup } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface CreateInterestGroupModalProps {
  onClose: () => void;
}

const CreateInterestGroupModal = ({ onClose }: CreateInterestGroupModalProps) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    interests: "",
    isPrivate: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.interests || !user) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const interestsList = formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      await createInterestGroup(
        formData.name,
        formData.description,
        interestsList,
        user.id,
        formData.isPrivate
      );

      queryClient.invalidateQueries({ queryKey: ["interestGroups"] });

      alert("Interest group created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create interest group");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg max-w-md w-full p-6 border border-dark-3">
        <h2 className="text-2xl font-bold mb-4">Create Interest Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Group Name *</label>
            <Input
              type="text"
              name="name"
              placeholder="e.g., Photography Enthusiasts"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="What is this group about?"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 h-24 resize-none"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Interests (comma-separated) *
            </label>
            <Input
              type="text"
              name="interests"
              placeholder="e.g., Photography, Art, Travel"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="h-4 w-4 rounded border-dark-3"
            />
            <label className="ml-3 block text-sm font-medium">
              Make this group private
            </label>
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
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterestGroupModal;
