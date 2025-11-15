import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { requestSafeWalk } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";

interface SafeWalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SafeWalkModal = ({ isOpen, onClose, onSuccess }: SafeWalkModalProps) => {
  const { user } = useAuthContext();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user?.id) {
        setError("You must be logged in");
        return;
      }

      if (!fromLocation || !toLocation) {
        setError("Please fill in all fields");
        return;
      }

      await requestSafeWalk(user.id, fromLocation, toLocation);
      
      setFromLocation("");
      setToLocation("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to request safe walk");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
        <h2 className="text-xl font-bold text-white">Request Safe Walk</h2>
        <p className="mt-1 text-sm text-light-3">
          Request a walking companion to help you get around campus safely
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-600/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white">
              From Location
            </label>
            <input
              type="text"
              placeholder="e.g., Main Library"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              To Location
            </label>
            <input
              type="text"
              placeholder="e.g., West Campus Dorm"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none"
            />
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
              className="w-full bg-primary-500 text-white hover:bg-primary-600"
            >
              {loading ? "Requesting..." : "Request Safe Walk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SafeWalkModal;
