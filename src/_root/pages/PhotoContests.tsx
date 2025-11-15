import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getPhotoContests,
  getPhotoContestSubmissions,
  submitPhotoContestEntry,
  voteForPhoto,
} from "@/lib/supabase/api";
import { PhotoContest, PhotoSubmission } from "@/types/gamification.types";

const PhotoContests = () => {
  const { user } = useAuthContext();
  const [contests, setContests] = useState<PhotoContest[]>([]);
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<PhotoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [userSubmissions, setUserSubmissions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      const data = await getPhotoContests();
      setContests(data);
      if (data.length > 0) {
        setSelectedContest(data[0].id);
      }
      setLoading(false);
    };

    fetchContests();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedContest) return;

      const data = await getPhotoContestSubmissions(selectedContest);
      setSubmissions(data);

      if (user?.id) {
        const userSubmitted = data
          .filter((sub) => sub.submitter_id === user.id)
          .map((sub) => sub.id);
        setUserSubmissions(new Set(userSubmitted));
      }
    };

    fetchSubmissions();
  }, [selectedContest, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedContest || !photoUrl.trim()) return;

    const submission = await submitPhotoContestEntry(
      selectedContest,
      user.id,
      photoUrl,
      caption || undefined
    );

    if (submission) {
      setSubmissions([...submissions, submission]);
      setUserSubmissions(new Set([...userSubmissions, submission.id]));
      setPhotoUrl("");
      setCaption("");
      setShowSubmitModal(false);
    }
  };

  const handleVote = async (submissionId: string) => {
    const updated = await voteForPhoto(submissionId);

    if (updated) {
      setSubmissions(
        submissions.map((sub) => (sub.id === submissionId ? updated : sub))
      );
    }
  };

  const getContestStatus = (contest: PhotoContest) => {
    const endDate = new Date(contest.end_date);
    const now = new Date();

    if (now > endDate) {
      return { status: "Ended", color: "text-red-500" };
    }

    const daysLeft = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return { status: `${daysLeft}d left`, color: "text-green-500" };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  const currentContest = contests.find((c) => c.id === selectedContest);
  const { status, color } = currentContest
    ? getContestStatus(currentContest)
    : { status: "", color: "" };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Photo Contests</h1>
        <p className="text-light-3">
          Show off your photography and vote for your favorites
        </p>
      </div>

      {/* Contest Selector */}
      {contests.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {contests.map((contest) => (
            <button
              key={contest.id}
              onClick={() => setSelectedContest(contest.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                selectedContest === contest.id
                  ? "bg-primary-500 text-white"
                  : "bg-dark-3 text-light-3 hover:bg-dark-2"
              }`}>
              {contest.title}
            </button>
          ))}
        </div>
      )}

      {currentContest && (
        <>
          {/* Contest Header */}
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">
                  {currentContest.title}
                </h2>
                {currentContest.description && (
                  <p className="mt-2 text-sm text-light-3">
                    {currentContest.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-light-4">Theme</p>
                    <p className="mt-1 font-medium text-white">
                      {currentContest.theme}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-light-4">Status</p>
                    <p className={`mt-1 font-medium ${color}`}>{status}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 transition">
                + Submit Photo
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          {submissions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-dark-4 bg-dark-2 overflow-hidden hover:border-primary-500 transition">
                  {/* Photo */}
                  <div className="aspect-square overflow-hidden bg-dark-3">
                    {submission.photo_url ? (
                      <img
                        src={submission.photo_url}
                        alt={submission.caption || "Photo submission"}
                        className="h-full w-full object-cover hover:scale-105 transition"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-light-4">
                        📷 No image
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="p-4">
                    {submission.caption && (
                      <p className="text-sm text-light-3">
                        {submission.caption}
                      </p>
                    )}

                    {/* Ranking */}
                    {submission.ranking && (
                      <p className="mt-2 text-sm font-semibold text-yellow-500">
                        🏅 #{submission.ranking}
                      </p>
                    )}

                    {/* Vote Button */}
                    <button
                      onClick={() => handleVote(submission.id)}
                      className="mt-3 w-full rounded-lg bg-primary-500/10 py-2 font-medium text-primary-500 hover:bg-primary-500/20 transition flex items-center justify-center gap-2">
                      👍 Vote ({submission.votes})
                    </button>

                    {userSubmissions.has(submission.id) && (
                      <p className="mt-2 text-center text-xs font-medium text-primary-500">
                        ✓ Your submission
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-12 text-center">
              <p className="text-light-3">
                No submissions yet. Be the first to submit!
              </p>
            </div>
          )}

          {/* Contest Info */}
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <h3 className="font-semibold text-white">About This Contest</h3>
            <p className="mt-2 text-sm text-light-3">
              Submit your best photos matching the "{currentContest.theme}"
              theme. The photos with the most votes by{" "}
              {new Date(currentContest.end_date).toLocaleDateString()} will be
              featured. Make sure to follow campus guidelines when submitting.
            </p>
          </div>
        </>
      )}

      {/* Submit Photo Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
            <h2 className="text-xl font-bold text-white">Submit Your Photo</h2>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white">
                  Caption (Optional)
                </label>
                <textarea
                  placeholder="Tell us about your photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="w-full rounded-lg border border-dark-4 px-4 py-2 font-medium text-light-3 hover:bg-dark-3 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!photoUrl.trim()}
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

export default PhotoContests;
