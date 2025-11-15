import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getAchievements,
  getUserAchievements,
  getUserPoints,
} from "@/lib/supabase/api";
import {
  Achievement,
  UserAchievement,
  UserPoints,
} from "@/types/gamification.types";

const Achievements = () => {
  const { user } = useAuthContext();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      const [achievementsData, userAchievementsData, pointsData] =
        await Promise.all([
          getAchievements(),
          getUserAchievements(user.id),
          getUserPoints(user.id),
        ]);

      setAchievements(achievementsData);
      setUserAchievements(userAchievementsData);
      setUserPoints(pointsData);
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "social":
        return "bg-purple-600";
      case "academic":
        return "bg-blue-600";
      case "campus":
        return "bg-green-600";
      case "exploration":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
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
        <h1 className="text-2xl font-bold text-white">Achievements & Badges</h1>
        <p className="text-light-3">
          Unlock badges and earn points by participating
        </p>
      </div>

      {/* Points & Level Display */}
      {userPoints && (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-light-4 text-sm">Total Points</p>
              <p className="mt-2 text-3xl font-bold text-primary-500">
                {userPoints.total_points}
              </p>
            </div>
            <div className="text-center">
              <p className="text-light-4 text-sm">Level</p>
              <p className="mt-2 text-3xl font-bold text-yellow-500">
                {userPoints.level}
              </p>
            </div>
            <div className="text-center">
              <p className="text-light-4 text-sm">This Semester</p>
              <p className="mt-2 text-3xl font-bold text-green-500">
                {userPoints.points_this_semester}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          All Achievements
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`rounded-lg border p-4 transition ${
                  isUnlocked
                    ? "border-primary-500 bg-dark-2"
                    : "border-dark-4 bg-dark-3 opacity-60"
                }`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`${getCategoryColor(
                      achievement.category
                    )} flex h-12 w-12 items-center justify-center rounded-full text-2xl`}>
                    {achievement.badge_icon_url ? "🏆" : "⭐"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {achievement.title}
                    </h3>
                    {achievement.description && (
                      <p className="mt-1 text-xs text-light-3">
                        {achievement.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-light-4 capitalize">
                        {achievement.category}
                      </span>
                      <span className="text-sm font-bold text-yellow-500">
                        +{achievement.points_reward} pts
                      </span>
                    </div>
                  </div>
                </div>
                {isUnlocked && (
                  <div className="mt-3 text-center text-xs font-bold text-primary-500">
                    ✓ UNLOCKED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
        <h3 className="font-semibold text-white">Progress</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-light-3">
              Achievements Unlocked:{" "}
              <span className="font-bold text-primary-500">
                {userAchievements.length}
              </span>{" "}
              / {achievements.length}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-dark-3">
              <div
                className="h-2 rounded-full bg-primary-500 transition"
                style={{
                  width: `${Math.round(
                    (userAchievements.length / achievements.length) * 100
                  )}%`,
                }}></div>
            </div>
          </div>
          <div>
            <p className="text-sm text-light-3">
              Next Level:{" "}
              <span className="font-bold text-yellow-500">
                {userPoints ? (userPoints.level + 1) * 1000 : 1000} pts
              </span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-dark-3">
              <div
                className="h-2 rounded-full bg-yellow-500 transition"
                style={{
                  width: `${Math.round(
                    ((userPoints?.points_this_semester || 0) / 1000) * 100
                  )}%`,
                }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
