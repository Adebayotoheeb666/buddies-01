import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getSemesterRecap } from "@/lib/supabase/api";
import { SemesterRecap as SemesterRecapType } from "@/types/gamification.types";

const SemesterRecap = () => {
  const { user } = useAuthContext();
  const [recap, setRecap] = useState<SemesterRecapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");

  useEffect(() => {
    const fetchRecap = async () => {
      if (!user?.id) return;

      setLoading(true);
      const recapData = await getSemesterRecap(user.id, selectedSemester);
      setRecap(recapData);
      setLoading(false);
    };

    fetchRecap();
  }, [user?.id, selectedSemester]);

  const getRecapSummary = () => {
    if (!recap) return [];

    return [
      {
        icon: "🎯",
        label: "Events Attended",
        value: recap.events_attended,
        color: "text-blue-500",
      },
      {
        icon: "🏢",
        label: "Clubs Joined",
        value: recap.clubs_joined,
        color: "text-purple-500",
      },
      {
        icon: "✍️",
        label: "Posts Created",
        value: recap.posts_created,
        color: "text-green-500",
      },
      {
        icon: "👥",
        label: "Friends Made",
        value: recap.friends_made,
        color: "text-pink-500",
      },
      {
        icon: "🏆",
        label: "Achievements",
        value: recap.achievements_unlocked,
        color: "text-yellow-500",
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  const summary = getRecapSummary();
  const totalEngagement =
    (recap?.events_attended || 0) +
    (recap?.clubs_joined || 0) +
    (recap?.posts_created || 0) +
    (recap?.friends_made || 0);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Semester Recap</h1>
        <p className="text-light-3">
          Celebrate your achievements this semester
        </p>
      </div>

      {/* Semester Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          "Fall 2024",
          "Spring 2024",
          "Fall 2023",
          "Spring 2023",
          "Fall 2022",
        ].map((semester) => (
          <button
            key={semester}
            onClick={() => setSelectedSemester(semester)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
              selectedSemester === semester
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-3 hover:bg-dark-2"
            }`}>
            {semester}
          </button>
        ))}
      </div>

      {recap ? (
        <>
          {/* Main Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {summary.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
                <p className="text-3xl">{stat.icon}</p>
                <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-light-4">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Engagement Highlights */}
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <h2 className="text-lg font-semibold text-white">
              Your Semester Story
            </h2>

            <div className="mt-4 space-y-3">
              {totalEngagement > 50 && (
                <div className="rounded-lg bg-primary-500/10 p-4 text-primary-500">
                  <p className="font-semibold">🌟 Super Engaged!</p>
                  <p className="mt-1 text-sm">
                    You had {totalEngagement} total interactions this semester.
                    You're one of the most active students!
                  </p>
                </div>
              )}

              {recap.achievements_unlocked >= 5 && (
                <div className="rounded-lg bg-yellow-500/10 p-4 text-yellow-500">
                  <p className="font-semibold">🏆 Achievement Master!</p>
                  <p className="mt-1 text-sm">
                    You unlocked {recap.achievements_unlocked} achievements this
                    semester. Keep up the great work!
                  </p>
                </div>
              )}

              {recap.clubs_joined >= 3 && (
                <div className="rounded-lg bg-purple-500/10 p-4 text-purple-500">
                  <p className="font-semibold">🎭 Club Enthusiast!</p>
                  <p className="mt-1 text-sm">
                    You joined {recap.clubs_joined} clubs and met many new
                    people. Great way to get involved!
                  </p>
                </div>
              )}

              {recap.posts_created >= 10 && (
                <div className="rounded-lg bg-green-500/10 p-4 text-green-500">
                  <p className="font-semibold">📢 Content Creator!</p>
                  <p className="mt-1 text-sm">
                    You created {recap.posts_created} posts and shared your
                    thoughts with the community.
                  </p>
                </div>
              )}

              {recap.friends_made >= 5 && (
                <div className="rounded-lg bg-pink-500/10 p-4 text-pink-500">
                  <p className="font-semibold">💕 Social Butterfly!</p>
                  <p className="mt-1 text-sm">
                    You made {recap.friends_made} new friends this semester.
                    Your network is growing!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <h3 className="font-semibold text-white">Quick Stats</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-light-3">Total Engagement</p>
                <p className="mt-2 text-3xl font-bold text-primary-500">
                  {totalEngagement}
                </p>
              </div>
              <div>
                <p className="text-sm text-light-3">Achievements Unlocked</p>
                <p className="mt-2 text-3xl font-bold text-yellow-500">
                  {recap.achievements_unlocked}
                </p>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="rounded-lg border border-primary-500 bg-primary-500/5 p-6 text-center">
            <p className="text-lg font-semibold text-white">
              ✨ Great semester! Here's to making next semester even better!
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
          <p className="text-light-3">
            No recap data available for {selectedSemester}
          </p>
        </div>
      )}
    </div>
  );
};

export default SemesterRecap;
