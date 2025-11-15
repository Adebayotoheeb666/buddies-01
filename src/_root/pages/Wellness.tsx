import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getWellnessResources,
  getUserWellnessCheckIns,
  getUserWellnessGoals,
  getSupportForums,
} from "@/lib/supabase/api";
import {
  WellnessResource,
  WellnessCheckIn,
  WellnessGoal,
  SupportForum,
} from "@/types/safety.types";

const Wellness = () => {
  const { user } = useAuthContext();
  const [resources, setResources] = useState<WellnessResource[]>([]);
  const [checkIns, setCheckIns] = useState<WellnessCheckIn[]>([]);
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [forums, setForums] = useState<SupportForum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "resources" | "checkin" | "goals" | "forums"
  >("resources");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      const [resourcesData, checkInsData, goalsData, forumsData] =
        await Promise.all([
          getWellnessResources(),
          getUserWellnessCheckIns(user.id),
          getUserWellnessGoals(user.id),
          getSupportForums(),
        ]);

      setResources(resourcesData);
      setCheckIns(checkInsData);
      setGoals(goalsData);
      setForums(forumsData);
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

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
        <h1 className="text-2xl font-bold text-white">
          Mental Health & Wellness
        </h1>
        <p className="text-light-3">
          Your wellbeing matters. Access resources and track your wellness
          journey
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-4">
        {["resources", "checkin", "goals", "forums"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-primary-500 text-primary-500"
                : "text-light-3 hover:text-white"
            }`}>
            {tab === "resources" && "Resources"}
            {tab === "checkin" && "Check-In"}
            {tab === "goals" && "Goals"}
            {tab === "forums" && "Support Forums"}
          </button>
        ))}
      </div>

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="grid gap-4">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4 hover:bg-dark-3 transition cursor-pointer">
                <h3 className="font-semibold text-white">{resource.title}</h3>
                {resource.description && (
                  <p className="mt-1 text-sm text-light-3">
                    {resource.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-light-4">
                    {resource.resource_type === "counseling" && "🧠 Counseling"}
                    {resource.resource_type === "meditation" && "🧘 Meditation"}
                    {resource.resource_type === "exercise" && "💪 Exercise"}
                    {resource.resource_type === "nutrition" && "🥗 Nutrition"}
                  </span>
                  {resource.is_campus_resource && (
                    <span className="text-xs text-primary-500 font-medium">
                      Campus Resource
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No resources available</p>
            </div>
          )}
        </div>
      )}

      {/* Check-In Tab */}
      {activeTab === "checkin" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Daily Check-In
            </h3>
            <p className="text-light-3 text-sm mb-4">
              Log your mood, stress level, sleep, and exercise to track your
              wellness journey.
            </p>
            <button className="rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white hover:bg-primary-600 transition">
              Start Check-In
            </button>
          </div>

          {/* Recent Check-Ins */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Recent Check-Ins
            </h4>
            {checkIns.length > 0 ? (
              <div className="grid gap-3">
                {checkIns.slice(0, 5).map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className="rounded-lg border border-dark-4 bg-dark-2 p-4">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-light-4">Mood</p>
                        <p className="text-lg font-bold text-primary-500">
                          {checkIn.mood_score}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-light-4">Stress</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {checkIn.stress_level}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-light-4">Sleep</p>
                        <p className="text-lg font-bold text-blue-500">
                          {checkIn.sleep_hours}h
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-light-4">Exercise</p>
                        <p className="text-lg font-bold text-green-500">
                          {checkIn.exercise_minutes}m
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
                <p className="text-light-3">
                  No check-ins yet. Start tracking!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Wellness Goals
            </h3>
            <p className="text-light-3 text-sm mb-4">
              Set personal wellness goals and track your progress
            </p>
            <button className="rounded-lg bg-primary-500 px-6 py-2 font-semibold text-white hover:bg-primary-600 transition">
              Create Goal
            </button>
          </div>

          {goals.length > 0 ? (
            <div className="grid gap-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-lg border border-dark-4 bg-dark-2 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-white capitalize">
                        {goal.goal_type.replace(/_/g, " ")}
                      </h4>
                      <p className="text-sm text-light-3 mt-1">
                        Target: {goal.target_value}
                      </p>
                      <p className="text-xs text-light-4 mt-1">
                        Frequency: {goal.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-500">
                        {goal.progress}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-dark-3">
                    <div
                      className="h-2 rounded-full bg-primary-500 transition"
                      style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">
                No goals yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Forums Tab */}
      {activeTab === "forums" && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-white">Support Forums</h3>
          {forums.length > 0 ? (
            forums.map((forum) => (
              <div
                key={forum.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4 hover:bg-dark-3 transition cursor-pointer">
                <h4 className="font-semibold text-white">{forum.title}</h4>
                {forum.description && (
                  <p className="mt-1 text-sm text-light-3">
                    {forum.description}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-light-4 capitalize">
                    Topic: {forum.topic.replace(/_/g, " ")}
                  </span>
                  {forum.is_moderated && (
                    <span className="text-xs text-green-500 font-medium">
                      ✓ Moderated
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No support forums available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wellness;
