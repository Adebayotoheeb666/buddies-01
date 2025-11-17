import { CampusPoll } from "@/types/social.types";
import { useAuthContext } from "@/context/AuthContext";
import { getPoll, votePoll } from "@/lib/supabase/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PollCardProps {
  poll: CampusPoll;
}

const PollCard = ({ poll }: PollCardProps) => {
  const { user } = useAuthContext();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);

  const { data: pollDetails, refetch } = useQuery({
    queryKey: ["poll", poll.id],
    queryFn: () => getPoll(poll.id),
  });

  const handleVote = async (optionId: string) => {
    if (!user) return;

    setIsVoting(true);
    try {
      await votePoll(poll.id, optionId, user.id);
      setUserVote(optionId);
      refetch();
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const options = pollDetails?.options || [];
  const totalVotes = options.reduce((sum: number, opt: { vote_count?: number }) => sum + (opt.vote_count || 0), 0);

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const isExpired = new Date(poll.expires_at) < new Date();

  return (
    <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 hover:border-primary-500 transition-colors">
      {/* Poll Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex-1">{poll.title}</h3>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
            isExpired
              ? "bg-red-900 text-red-200"
              : "bg-green-900 text-green-200"
          }`}>
            {isExpired ? "Expired" : "Active"}
          </span>
        </div>
        <p className="text-light-3 text-sm">{poll.description}</p>
      </div>

      {/* Poll Options */}
      <div className="space-y-3 mb-4">
        {options.map((option: { id: string; option_text: string; vote_count?: number }) => {
          const percentage = getPercentage(option.vote_count || 0);
          const isSelected = userVote === option.id;

          return (
            <div key={option.id}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-white">
                  {option.option_text}
                </label>
                <span className="text-xs text-light-3">
                  {percentage}% ({option.vote_count || 0})
                </span>
              </div>
              <div className="relative h-8 bg-dark-4 rounded-full overflow-hidden border border-dark-3">
                <div
                  className={`h-full transition-all duration-300 flex items-center justify-center ${
                    isSelected
                      ? "bg-primary-500"
                      : "bg-primary-700"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                {user && !isExpired && (
                  <button
                    onClick={() => handleVote(option.id)}
                    disabled={isVoting}
                    className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity bg-black/20 cursor-pointer flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                      Vote
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="text-xs text-light-3 border-t border-dark-4 pt-3">
        <p>Total votes: {totalVotes}</p>
        {!isExpired && (
          <p>Expires: {new Date(poll.expires_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default PollCard;
