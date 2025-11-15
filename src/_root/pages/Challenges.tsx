import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getChallenges,
  getUserChallengeParticipations,
  participateInChallenge,
} from "@/lib/supabase/api";
import { Challenge, ChallengeParticipation } from "@/types/gamification.types";

const Challenges = () => {
  const { user } = useAuthContext();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<
    ChallengeParticipation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(
    null
  );
  const [submissionText, setSubmissionText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      const [challengesData, participationsData] = await Promise.all([
        getChallenges(),
        getUserChallengeParticipations(user.id),
      ]);

      setChallenges(challengesData);
      setParticipations(participationsData);
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  const handleParticipate = async (challengeId: string) => {
    if (!user?.id || !submissionText.trim()) return;

    await participateInChallenge(
      challengeId,
      user.id,
      submissionText || undefined
    );

    setSubmissionText("");
    setSelectedChallenge(null);

    const updatedParticipations = await getUserChallengeParticipations(user.id);
    setParticipations(updatedParticipations);
  };

  const isParticipating = (challengeId: string) => {
    return participations.some((p) => p.challenge_id === challengeId);
  };

  const getChallengeTypeEmoji = (type: string) => {
    switch (type) {
      case "photo":
        return "📸";
      case "social":
        return "👥";
      case "attendance":
        return "🎯";
      case "exploration":
        return "🗺️";
      default:
        return "⭐";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <p className="text-light-3">
          Complete challenges and earn bonus points
        </p>
      </div>

      {/* Active Challenges */}
      <div className="grid gap-4">
        {challenges.length > 0 ? (
          challenges.map((challenge) => {
            const isParticipating_ = isParticipating(challenge.id);
            const daysRemaining = Math.ceil(
              (new Date(challenge.end_date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={challenge.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getChallengeTypeEmoji(challenge.challenge_type)}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {challenge.title}
                      </h3>
                    </div>

                    {challenge.description && (
                      <p className="mt-2 text-sm text-light-3">
                        {challenge.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-light-4">Reward:</span>
                        <span className="font-bold text-yellow-500">
                          +{challenge.reward_points} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-light-4">Participants:</span>
                        <span className="font-bold text-primary-500">
                          {challenge.participation_count}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-light-4">Days Left:</span>
                        <span
                          className={`font-bold ${
                            daysRemaining <= 3
                              ? "text-red-500"
                              : "text-green-500"
                          }`}>
                          {daysRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isParticipating_ ? (
                    <button
                      onClick={() => setSelectedChallenge(challenge.id)}
                      className="whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 transition">
                      Join Challenge
                    </button>
                  ) : (
                    <div className="whitespace-nowrap rounded-lg bg-green-600/20 px-4 py-2 text-sm font-medium text-green-500">
                      ✓ Joined
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
            <p className="text-light-3">No active challenges yet</p>
          </div>
        )}
      </div>

      {/* Join Challenge Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
            <h2 className="text-xl font-bold text-white">Join Challenge</h2>
            <p className="mt-1 text-sm text-light-3">
              Tell us about your submission
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleParticipate(selectedChallenge);
              }}
              className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Submission Details
                </label>
                <textarea
                  placeholder="Describe your submission..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="w-full rounded-lg border border-dark-4 px-4 py-2 font-medium text-light-3 hover:bg-dark-3 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!submissionText.trim()}
                  className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
