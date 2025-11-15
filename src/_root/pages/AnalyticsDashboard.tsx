import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getUserAnalytics,
  getFeatureUsage,
  getCampusExploration,
  getEngagementSummary,
} from "@/lib/supabase/api";
import {
  UserAnalytics,
  FeatureUsage,
  CampusExploration,
  EngagementSummary,
} from "@/types/gamification.types";

const AnalyticsDashboard = () => {
  const { user } = useAuthContext();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [campusExploration, setCampusExploration] = useState<
    CampusExploration[]
  >([]);
  const [engagement, setEngagement] = useState<EngagementSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      const [analyticsData, featureData, campusData, engagementData] =
        await Promise.all([
          getUserAnalytics(user.id),
          getFeatureUsage(user.id),
          getCampusExploration(user.id),
          getEngagementSummary(user.id, "month"),
        ]);

      setAnalytics(analyticsData);
      setFeatureUsage(featureData);
      setCampusExploration(campusData);
      setEngagement(engagementData);
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
        <h1 className="text-2xl font-bold text-white">Your Analytics</h1>
        <p className="text-light-3">
          Track your engagement and activity on campus
        </p>
      </div>

      {/* Engagement Score */}
      {engagement && (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
          <h2 className="text-lg font-semibold text-white">
            Engagement Score (This Month)
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="text-5xl font-bold text-primary-500">
                {engagement.engagement_score}
              </p>
              <p className="text-sm text-light-4">out of 100</p>
            </div>
            <div className="flex-1">
              <div className="h-3 w-full rounded-full bg-dark-3">
                <div
                  className="h-3 rounded-full bg-primary-500 transition"
                  style={{ width: `${engagement.engagement_score}%` }}></div>
              </div>
              {engagement.recommendations &&
                engagement.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-light-3">
                      <strong>Recommendation:</strong>{" "}
                      {engagement.recommendations[0]}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Summary */}
      {analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Posts Created</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.posts_created}
            </p>
          </div>
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Posts Liked</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.posts_liked}
            </p>
          </div>
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Connections Made</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.connections_made}
            </p>
          </div>
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Events Attended</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.events_attended}
            </p>
          </div>
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Clubs Joined</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.clubs_joined}
            </p>
          </div>
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
            <p className="text-light-4 text-sm">Assignments Completed</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {analytics.assignments_completed}
            </p>
          </div>
        </div>
      )}

      {/* Feature Usage */}
      {featureUsage.length > 0 && (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
          <h2 className="text-lg font-semibold text-white">
            Most Used Features
          </h2>
          <div className="mt-4 space-y-3">
            {featureUsage.slice(0, 5).map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between">
                <p className="text-sm text-light-3">{feature.feature_name}</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-dark-3">
                    <div
                      className="h-2 rounded-full bg-primary-500 transition"
                      style={{
                        width: `${Math.min(
                          (feature.usage_count /
                            (featureUsage[0]?.usage_count || 1)) *
                            100,
                          100
                        )}%`,
                      }}></div>
                  </div>
                  <span className="text-sm font-bold text-light-3 min-w-[40px] text-right">
                    {feature.usage_count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Exploration */}
      {campusExploration.length > 0 && (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
          <h2 className="text-lg font-semibold text-white">
            Top Visited Locations
          </h2>
          <div className="mt-4 grid gap-2">
            {campusExploration.slice(0, 5).map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between rounded-lg bg-dark-3 p-3">
                <div>
                  <p className="font-medium text-white">
                    Location #{location.location_id.slice(0, 8)}
                  </p>
                  {location.last_visit && (
                    <p className="text-xs text-light-4">
                      Last visited:{" "}
                      {new Date(location.last_visit).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-lg font-bold text-primary-500">
                  {location.visit_count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Stats */}
      {analytics && (
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
          <h2 className="text-lg font-semibold text-white">Academic Metrics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-light-3">Courses Enrolled</p>
              <p className="mt-1 text-2xl font-bold text-primary-500">
                {analytics.courses_enrolled}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-3">Study Groups</p>
              <p className="mt-1 text-2xl font-bold text-primary-500">
                {analytics.study_groups_created + analytics.study_groups_joined}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
