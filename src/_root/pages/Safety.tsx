import { useEffect, useState } from "react";
import { getSafetyAlerts, getEmergencyResources } from "@/lib/supabase/api";
import { SafetyAlert, EmergencyResource } from "@/types/safety.types";
import { useAuthContext } from "@/context/AuthContext";

const Safety = () => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoading: authLoading } = useAuthContext();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [alertsData, resourcesData] = await Promise.all([
          getSafetyAlerts(),
          getEmergencyResources(),
        ]);
        setAlerts(alertsData || []);
        setResources(resourcesData || []);
      } catch (err) {
        console.error("Error fetching safety data:", err);
        setError("Failed to load safety information. Please try again later.");
        setAlerts([]);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-600";
      case "medium":
        return "bg-yellow-600";
      default:
        return "bg-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">Safety & Security</h1>
          <p className="text-light-3">Stay informed and safe on campus</p>
        </div>
        <div className="rounded-lg border border-danger-500 bg-danger-500/10 p-6">
          <p className="text-danger-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-danger-500 px-4 py-2 text-white hover:bg-danger-600 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Safety & Security</h1>
        <p className="text-light-3">Stay informed and safe on campus</p>
      </div>

      {/* Active Alerts */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Active Alerts</h2>
        {alerts.length > 0 ? (
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`${getSeverityColor(
                      alert.severity
                    )} flex h-3 w-3 rounded-full flex-shrink-0 mt-1`}></div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {alert.title}
                    </h3>
                    {alert.description && (
                      <p className="mt-1 text-sm text-light-3">
                        {alert.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-light-4">
                      Severity:{" "}
                      <span className="capitalize">{alert.severity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
            <p className="text-light-3">No active alerts</p>
          </div>
        )}
      </div>

      {/* Emergency Resources */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">
          Emergency Resources
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-lg border border-dark-4 bg-dark-2 p-4">
              <h3 className="font-semibold text-white">
                {resource.service_name}
              </h3>
              <p className="mt-1 text-sm text-light-3">
                {resource.description}
              </p>
              {resource.phone && (
                <p className="mt-2 text-sm font-medium text-primary-500">
                  {resource.phone}
                </p>
              )}
              {resource.email && (
                <p className="text-xs text-light-4">{resource.email}</p>
              )}
              {resource.available_hours && (
                <p className="mt-1 text-xs text-light-4">
                  Hours: {resource.available_hours}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety Features */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center hover:bg-dark-3 cursor-pointer transition">
          <h3 className="text-lg font-semibold text-white">
            Safe Walk Program
          </h3>
          <p className="mt-2 text-sm text-light-3">
            Request a walking companion for campus
          </p>
        </div>
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center hover:bg-dark-3 cursor-pointer transition">
          <h3 className="text-lg font-semibold text-white">Share Location</h3>
          <p className="mt-2 text-sm text-light-3">
            Share your location with trusted friends
          </p>
        </div>
      </div>
    </div>
  );
};

export default Safety;
