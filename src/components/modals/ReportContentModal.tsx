import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { reportContent } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: string;
  contentType?: "post" | "comment" | "assignment" | "confession";
  onSuccess?: () => void;
}

const ReportContentModal = ({
  isOpen,
  onClose,
  contentId,
  contentType = "post",
  onSuccess,
}: ReportContentModalProps) => {
  const { user } = useAuthContext();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reasons = [
    "Inappropriate Content",
    "Harassment",
    "Academic Dishonesty",
    "Spam",
    "Misinformation",
    "Hate Speech",
    "Violence",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user?.id) {
        setError("You must be logged in");
        return;
      }

      if (!reason) {
        setError("Please select a reason");
        return;
      }

      if (!contentId) {
        setError("Content ID is required");
        return;
      }

      await reportContent(
        contentId,
        contentType,
        user.id,
        reason,
        description || undefined
      );

      setReason("");
      setDescription("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to submit report");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
        <h2 className="text-xl font-bold text-white">Report Content</h2>
        <p className="mt-1 text-sm text-light-3">
          Help us keep the community safe. Report inappropriate or harmful content.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-600/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white outline-none"
            >
              <option value="">Select a reason...</option>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Additional Details (optional)
            </label>
            <textarea
              placeholder="Please provide any additional information..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none resize-none"
              rows={4}
            />
          </div>

          <div className="mt-2">
            <p className="text-xs text-light-4">
              ⚠️ Your report is confidential. False reports may result in account action.
            </p>
          </div>

          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportContentModal;
