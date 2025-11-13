import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createPoll } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePollModalProps {
  onClose: () => void;
}

const CreatePollModal = ({ onClose }: CreatePollModalProps) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pollType: "general",
    expiresIn: "7", // days
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.option1 ||
      !formData.option2 ||
      !user
    ) {
      alert("Please fill in required fields and at least 2 options");
      return;
    }

    setIsCreating(true);
    try {
      const options = [
        formData.option1,
        formData.option2,
        formData.option3,
        formData.option4,
      ].filter((o) => o.trim());

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresIn));

      await createPoll(
        user.id,
        formData.title,
        formData.description,
        formData.pollType,
        expiresAt.toISOString(),
        options
      );

      queryClient.invalidateQueries({ queryKey: ["campusPolls"] });

      alert("Poll created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg max-w-md w-full p-6 border border-dark-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Poll</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Poll Title *</label>
            <Input
              type="text"
              name="title"
              placeholder="What should we vote on?"
              value={formData.title}
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
              placeholder="Provide more context"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 h-20 resize-none"
            />
          </div>

          {/* Poll Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Poll Type</label>
            <select
              name="pollType"
              value={formData.pollType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="general">General</option>
              <option value="campus_issue">Campus Issue</option>
              <option value="event_preference">Event Preference</option>
            </select>
          </div>

          {/* Expires In */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Expires In (days)
            </label>
            <Input
              type="number"
              name="expiresIn"
              value={formData.expiresIn}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Poll Options *</label>
            {[1, 2, 3, 4].map((num) => (
              <Input
                key={num}
                type="text"
                name={`option${num}`}
                placeholder={`Option ${num} ${num <= 2 ? "*" : ""}`}
                value={formData[`option${num}` as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
              />
            ))}
            <p className="text-xs text-light-3 mt-2">
              At least 2 options required
            </p>
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
              {isCreating ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePollModal;
