import { useEffect, useState } from "react";
import {
  getContentReports,
  getIntegrityFlags,
  getModerationActions,
  getAppeals,
  updateContentReportStatus,
  updateIntegrityFlagStatus,
  reviewAppeal,
} from "@/lib/supabase/api";
import {
  ContentReport,
  IntegrityFlag,
  ModerationAction,
  Appeal,
} from "@/types/safety.types";
import { useAuthContext } from "@/context/AuthContext";

const ModerationDashboard = () => {
  const { user } = useAuthContext();
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [flags, setFlags] = useState<IntegrityFlag[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reports" | "flags" | "actions" | "appeals">(
    "reports"
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [reportsData, flagsData, actionsData, appealsData] =
        await Promise.all([
          getContentReports(),
          getIntegrityFlags(),
          getModerationActions(),
          getAppeals(),
        ]);

      setReports(reportsData);
      setFlags(flagsData);
      setActions(actionsData);
      setAppeals(appealsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  const handleReportStatus = async (
    reportId: string,
    status: string
  ) => {
    await updateContentReportStatus(reportId, status, user?.id);
    const updatedReports = reports.map((r) =>
      r.id === reportId ? { ...r, status: status as any } : r
    );
    setReports(updatedReports);
  };

  const handleFlagStatus = async (flagId: string, status: string) => {
    await updateIntegrityFlagStatus(flagId, status, user?.id);
    const updatedFlags = flags.map((f) =>
      f.id === flagId ? { ...f, status: status as any } : f
    );
    setFlags(updatedFlags);
  };

  const handleAppealReview = async (
    appealId: string,
    status: string,
    decisionText: string
  ) => {
    await reviewAppeal(appealId, status, user?.id || "", decisionText);
    const updatedAppeals = appeals.map((a) =>
      a.id === appealId ? { ...a, status: status as any, decision_text: decisionText } : a
    );
    setAppeals(updatedAppeals);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Moderation Dashboard</h1>
        <p className="text-light-3">Manage reports, flags, and appeals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
          <p className="text-light-4 text-sm">Pending Reports</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {reports.filter((r) => r.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
          <p className="text-light-4 text-sm">Active Integrity Flags</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {flags.filter((f) => f.status !== "resolved").length}
          </p>
        </div>
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
          <p className="text-light-4 text-sm">Moderation Actions</p>
          <p className="mt-2 text-3xl font-bold text-white">{actions.length}</p>
        </div>
        <div className="rounded-lg border border-dark-4 bg-dark-2 p-4">
          <p className="text-light-4 text-sm">Pending Appeals</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {appeals.filter((a) => a.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-dark-4">
        {["reports", "flags", "actions", "appeals"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-primary-500 text-primary-500"
                : "text-light-3 hover:text-white"
            }`}
          >
            {tab === "reports" && `Reports (${reports.length})`}
            {tab === "flags" && `Flags (${flags.length})`}
            {tab === "actions" && `Actions (${actions.length})`}
            {tab === "appeals" && `Appeals (${appeals.length})`}
          </button>
        ))}
      </div>

      {/* Content Reports Tab */}
      {activeTab === "reports" && (
        <div className="grid gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {report.reported_content_type === "post" && "📝 Post Report"}
                      {report.reported_content_type === "comment" && "💬 Comment Report"}
                      {report.reported_content_type === "assignment" && "📚 Assignment Report"}
                      {report.reported_content_type === "confession" && "🤐 Confession Report"}
                    </h4>
                    <p className="mt-1 text-sm text-light-3">
                      <strong>Reason:</strong> {report.reason}
                    </p>
                    {report.description && (
                      <p className="mt-1 text-sm text-light-3">
                        <strong>Details:</strong> {report.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-light-4">
                      Status: <span className="capitalize font-medium text-primary-500">{report.status}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleReportStatus(report.id, "approved")}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReportStatus(report.id, "rejected")}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No reports pending</p>
            </div>
          )}
        </div>
      )}

      {/* Integrity Flags Tab */}
      {activeTab === "flags" && (
        <div className="grid gap-4">
          {flags.length > 0 ? (
            flags.map((flag) => (
              <div
                key={flag.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white capitalize">
                      {flag.flag_type.replace(/_/g, " ")} Flag
                    </h4>
                    {flag.description && (
                      <p className="mt-1 text-sm text-light-3">
                        {flag.description}
                      </p>
                    )}
                    {flag.evidence_link && (
                      <p className="mt-1 text-xs text-blue-500 truncate">
                        Evidence: <a href={flag.evidence_link} target="_blank" rel="noopener noreferrer" className="underline">
                          View Link
                        </a>
                      </p>
                    )}
                    <p className="mt-2 text-xs text-light-4">
                      Status: <span className="capitalize font-medium text-orange-500">{flag.status}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleFlagStatus(flag.id, "investigated")}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 transition"
                    >
                      Investigate
                    </button>
                    <button
                      onClick={() => handleFlagStatus(flag.id, "resolved")}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 transition"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No integrity flags</p>
            </div>
          )}
        </div>
      )}

      {/* Moderation Actions Tab */}
      {activeTab === "actions" && (
        <div className="grid gap-4">
          {actions.length > 0 ? (
            actions.map((action) => (
              <div
                key={action.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4"
              >
                <h4 className="font-semibold text-white capitalize">
                  {action.action_type.replace(/_/g, " ")}
                </h4>
                <p className="mt-1 text-sm text-light-3">
                  <strong>Reason:</strong> {action.reason}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-light-4">
                  <span>
                    {action.appeal_allowed ? "Appeals: Allowed ✓" : "Appeals: Not Allowed ✗"}
                  </span>
                  <span>
                    {new Date(action.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No moderation actions taken</p>
            </div>
          )}
        </div>
      )}

      {/* Appeals Tab */}
      {activeTab === "appeals" && (
        <div className="grid gap-4">
          {appeals.length > 0 ? (
            appeals.map((appeal) => (
              <div
                key={appeal.id}
                className="rounded-lg border border-dark-4 bg-dark-2 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">User Appeal</h4>
                    <p className="mt-1 text-sm text-light-3">
                      {appeal.appeal_text}
                    </p>
                    {appeal.decision_text && (
                      <p className="mt-2 text-sm text-light-3">
                        <strong>Decision:</strong> {appeal.decision_text}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-light-4">
                      Status: <span className="capitalize font-medium text-yellow-500">{appeal.status}</span>
                    </p>
                  </div>
                  {appeal.status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAppealReview(appeal.id, "approved", "Appeal approved")}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAppealReview(appeal.id, "denied", "Appeal denied")}
                        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 transition"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
              <p className="text-light-3">No appeals submitted</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModerationDashboard;
