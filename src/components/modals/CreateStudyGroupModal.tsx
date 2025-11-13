import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface CreateStudyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

const CreateStudyGroupModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateStudyGroupModalProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    courseId: "",
    maxMembers: "8",
    meetingTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.location) {
      toast({ title: "Please fill in all required fields" });
      return;
    }

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onCreate) onCreate(formData);
      toast({ title: "Study group created successfully!" });
      setIsCreating(false);
      onClose();
    } catch (error) {
      toast({ title: "Failed to create study group" });
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="h2-bold mb-6">Create Study Group</h2>

        <div className="space-y-4">
          <div>
            <label className="shad-form_label">Group Name *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shad-input"
              placeholder="e.g., CS101 Study Squad"
            />
          </div>

          <div>
            <label className="shad-form_label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shad-input min-h-[100px]"
              placeholder="Describe your study group's goals and focus"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="shad-form_label">Meeting Location *</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="shad-input"
                placeholder="e.g., Library Room 210"
              />
            </div>
            <div>
              <label className="shad-form_label">Max Members</label>
              <Input
                name="maxMembers"
                type="number"
                value={formData.maxMembers}
                onChange={handleChange}
                className="shad-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="shad-form_label">
                Related Course (optional)
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="shad-input">
                <option value="">Select a course</option>
                <option value="1">CS101 - Intro to CS</option>
                <option value="2">MATH201 - Calculus II</option>
                <option value="3">PHYS301 - Modern Physics</option>
              </select>
            </div>
            <div>
              <label className="shad-form_label">First Meeting Date/Time</label>
              <Input
                name="meetingTime"
                type="datetime-local"
                value={formData.meetingTime}
                onChange={handleChange}
                className="shad-input"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-dark-4">
          <Button
            onClick={onClose}
            className="flex-1 bg-dark-3 text-light-1 font-semibold hover:bg-dark-4">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="flex-1 shad-button_primary"
            disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateStudyGroupModal;
