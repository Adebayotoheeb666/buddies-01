import { useEffect, useState } from "react";
import { getLeaderboards, getLeaderboardEntries } from "@/lib/supabase/api";
import {
  Leaderboard as LeaderboardType,
  LeaderboardEntry,
} from "@/types/gamification.types";

const Leaderboard = () => {
  const [leaderboards, setLeaderboards] = useState<LeaderboardType[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | null>(
    null
  );
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      const data = await getLeaderboards();
      setLeaderboards(data);
      if (data.length > 0) {
        setSelectedLeaderboard(data[0].id);
      }
      setLoading(false);
    };

    fetchLeaderboards();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedLeaderboard) return;

      const data = await getLeaderboardEntries(selectedLeaderboard);
      setEntries(data);
    };

    fetchEntries();
  }, [selectedLeaderboard]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-orange-600";
      default:
        return "text-light-3";
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
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
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-light-3">
          See how you rank against other students on campus
        </p>
      </div>

      {/* Leaderboard Selector */}
      {leaderboards.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {leaderboards.map((lb) => (
            <button
              key={lb.id}
              onClick={() => setSelectedLeaderboard(lb.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                selectedLeaderboard === lb.id
                  ? "bg-primary-500 text-white"
                  : "bg-dark-3 text-light-3 hover:bg-dark-2"
              }`}
            >
              {lb.name}
              <span className="ml-2 text-xs opacity-75">
                ({lb.period})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard Entries */}
      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-lg border border-dark-4 bg-dark-2 p-4 hover:bg-dark-3 transition"
            >
              <div
                className={`min-w-[50px] text-center text-2xl font-bold ${getMedalColor(
                  entry.rank
                )}`}
              >
                {getMedalEmoji(entry.rank)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  User #{entry.user_id.slice(0, 8)}
                </p>
                <p className="text-xs text-light-4">
                  {entry.is_opted_in ? "Public Profile" : "Private"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-500">
                  {entry.score}
                </p>
                <p className="text-xs text-light-4">points</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
          <p className="text-light-3">No entries on this leaderboard yet</p>
        </div>
      )}

      {/* Leaderboard Info */}
      <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
        <h3 className="font-semibold text-white">About Leaderboards</h3>
        <p className="mt-2 text-sm text-light-3">
          Leaderboards track your engagement across campus. Participate in
          events, clubs, and challenges to climb the rankings. You can choose
          to keep your profile private or share your achievements with the
          community.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
