import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createEvent } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventModalProps {
  organizationId: string;
  onClose: () => void;
}

const CreateEventModal = ({ organizationId, onClose }: CreateEventModalProps) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    eventType: "social",
    capacity: "50",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.eventDate ||
      !formData.eventTime ||
      !user
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const eventDateTime = new Date(
        `${formData.eventDate}T${formData.eventTime}`
      ).toISOString();

      await createEvent(
        organizationId,
        formData.title,
        formData.description,
        eventDateTime,
        null,
        formData.eventType,
        parseInt(formData.capacity),
        user.id
      );

      queryClient.invalidateQueries({
        queryKey: ["organizationEvents", organizationId],
      });

      alert("Event created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-2 rounded-lg max-w-md w-full p-6 border border-dark-3">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Event Title *</label>
            <Input
              type="text"
              name="title"
              placeholder="Event name"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Event description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 h-24 resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <Input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Time *</label>
            <Input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="meeting">Meeting</option>
              <option value="social">Social</option>
              <option value="recruitment">Recruitment</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium mb-2">Capacity</label>
            <Input
              type="number"
              name="capacity"
              placeholder="Expected attendees"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
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
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
