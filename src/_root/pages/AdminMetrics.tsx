import { useEffect, useState } from "react";
import { getAdminMetrics, getAtRiskStudents } from "@/lib/supabase/api";
import { AdminMetrics as AdminMetricsType, AtRiskStudent } from "@/types/gamification.types";

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState<AdminMetricsType[]>([]);
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetricType, setSelectedMetricType] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [metricsData, atRiskData] = await Promise.all([
        getAdminMetrics(),
        getAtRiskStudents(),
      ]);

      setMetrics(metricsData);
      setAtRiskStudents(atRiskData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const metricTypes = [
    "daily_active_users",
    "event_attendance",
    "engagement",
    "new_signups",
  ];

  const getMetricsForType = (type: string) => {
    return metrics.filter((m) => m.metric_type === type).slice(0, 30);
  };

  const getTodayMetric = (type: string) => {
    const today = new Date().toISOString().split("T")[0];
    return metrics.find((m) => m.metric_type === type && m.date === today);
  };

  const getRiskColor = (riskType: string) => {
    switch (riskType) {
      case "mental_health":
        return "bg-red-600/20 text-red-500";
      case "academic_struggle":
        return "bg-orange-600/20 text-orange-500";
      case "low_engagement":
        return "bg-yellow-600/20 text-yellow-500";
      default:
        return "bg-gray-600/20 text-gray-500";
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
        <h1 className="text-2xl font-bold text-white">Admin Metrics</h1>
        <p className="text-light-3">
          Monitor platform health and student engagement
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricTypes.map((type) => {
          const todayMetric = getTodayMetric(type);
          const label = type.replace(/_/g, " ").toUpperCase();

          return (
            <div
              key={type}
              className="rounded-lg border border-dark-4 bg-dark-2 p-4"
            >
              <p className="text-xs text-light-4 uppercase">{label}</p>
              <p className="mt-3 text-3xl font-bold text-primary-500">
                {todayMetric?.value || 0}
              </p>
              <p className="mt-1 text-xs text-light-4">
                {todayMetric?.date || "No data"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Metric Trends */}
      <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
        <h2 className="text-lg font-semibold text-white">Metric Trends</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {metricTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMetricType(type)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                selectedMetricType === type
                  ? "bg-primary-500 text-white"
                  : "bg-dark-3 text-light-3 hover:bg-dark-2"
              }`}
            >
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {selectedMetricType && (
          <div className="mt-4">
            <div className="space-y-2">
              {getMetricsForType(selectedMetricType).map((metric) => (
                <div
                  key={metric.id}
                  className="flex items-center justify-between rounded-lg bg-dark-3 p-2"
                >
                  <span className="text-sm text-light-3">{metric.date}</span>
                  <span className="text-sm font-bold text-primary-500">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* At-Risk Students */}
      <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
        <h2 className="text-lg font-semibold text-white">At-Risk Students</h2>
        <p className="mt-1 text-sm text-light-3">
          {atRiskStudents.length} students flagged for intervention
        </p>

        {atRiskStudents.length > 0 ? (
          <div className="mt-4 space-y-2">
            {atRiskStudents.slice(0, 10).map((student) => (
              <div
                key={student.id}
                className={`rounded-lg p-4 ${getRiskColor(student.risk_type)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">User #{student.user_id.slice(0, 8)}</p>
                    <p className="text-xs opacity-75 mt-1">
                      Risk Score: {student.risk_score}
                    </p>
                    {student.indicators && student.indicators.length > 0 && (
                      <p className="text-xs opacity-75 mt-1">
                        Indicators: {student.indicators.slice(0, 2).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs capitalize opacity-75">
                      {student.risk_type.replace(/_/g, " ")}
                    </p>
                    <p className={`text-xs font-bold mt-1 ${student.intervention_sent ? "text-green-400" : "text-red-400"}`}>
                      {student.intervention_sent ? "✓ Contacted" : "Needs Contact"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dark-4 bg-dark-3 p-4 text-center">
            <p className="text-light-3">No at-risk students detected</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
        <h2 className="text-lg font-semibold text-white">
          Platform Health Recommendations
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-light-3">
          <li className="flex gap-2">
            <span className="text-primary-500">→</span>
            <span>Increase engagement initiatives to reach inactive users</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500">→</span>
            <span>Schedule wellness check-ins for at-risk students</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500">→</span>
            <span>Promote upcoming campus events and activities</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500">→</span>
            <span>Expand peer tutoring and study group offerings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminMetrics;
