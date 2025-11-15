import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createWellnessCheckIn } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";

interface WellnessCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WellnessCheckInModal = ({
  isOpen,
  onClose,
  onSuccess,
}: WellnessCheckInModalProps) => {
  const { user } = useAuthContext();
  const [moodScore, setMoodScore] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [notes, setNotes] = useState("");
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

      await createWellnessCheckIn(
        user.id,
        moodScore,
        stressLevel,
        sleepHours,
        exerciseMinutes,
        notes || undefined
      );

      setMoodScore(7);
      setStressLevel(5);
      setSleepHours(7);
      setExerciseMinutes(30);
      setNotes("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to save check-in");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
        <h2 className="text-xl font-bold text-white">
          Daily Wellness Check-In
        </h2>
        <p className="mt-1 text-sm text-light-3">
          Track your mood, stress, sleep, and exercise
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-600/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white">
              Mood (1-10): {moodScore}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-light-4">
              <span>😞</span>
              <span>😊</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Stress Level (1-10): {stressLevel}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-light-4">
              <span>Relaxed</span>
              <span>Very Stressed</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Sleep Hours: {sleepHours}h
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Exercise Minutes: {exerciseMinutes}m
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">
              Notes (optional)
            </label>
            <textarea
              placeholder="How are you feeling today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none resize-none"
              rows={3}
            />
          </div>

          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="w-full">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white hover:bg-primary-600">
              {loading ? "Saving..." : "Save Check-In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WellnessCheckInModal;
