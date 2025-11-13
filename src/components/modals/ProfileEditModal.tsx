import { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  onSave,
}: ProfileEditModalProps) => {
  const { user } = useUserContext();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    major: user?.major || "",
    class_year: user?.class_year || "",
    graduation_year: user?.graduation_year || new Date().getFullYear() + 4,
    pronouns: user?.pronouns || "",
    interests: user?.interests?.join(", ") || "",
    profile_visibility: user?.profile_visibility || "public",
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

  const handleSave = () => {
    const saveData = {
      ...formData,
      interests: formData.interests.split(",").map((i) => i.trim()),
    };
    if (onSave) onSave(saveData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="h2-bold mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="shad-form_label">Full Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shad-input"
            />
          </div>

          <div>
            <label className="shad-form_label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="shad-input min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="shad-form_label">Major</label>
              <Input
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="shad-input"
              />
            </div>
            <div>
              <label className="shad-form_label">Class Year</label>
              <select
                name="class_year"
                value={formData.class_year}
                onChange={handleChange}
                className="shad-input">
                <option value="">Select</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="shad-form_label">Graduation Year</label>
              <Input
                name="graduation_year"
                type="number"
                value={formData.graduation_year}
                onChange={handleChange}
                className="shad-input"
              />
            </div>
            <div>
              <label className="shad-form_label">Pronouns</label>
              <Input
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                className="shad-input"
                placeholder="e.g., She/Her"
              />
            </div>
          </div>

          <div>
            <label className="shad-form_label">
              Interests (comma separated)
            </label>
            <Input
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="shad-input"
              placeholder="Coding, Research, Gaming..."
            />
          </div>

          <div>
            <label className="shad-form_label">Profile Visibility</label>
            <select
              name="profile_visibility"
              value={formData.profile_visibility}
              onChange={handleChange}
              className="shad-input">
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-dark-4">
          <Button
            onClick={onClose}
            className="flex-1 bg-dark-3 text-light-1 font-semibold hover:bg-dark-4">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 shad-button_primary">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
