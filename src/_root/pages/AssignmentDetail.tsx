import { useParams, useNavigate } from "react-router-dom";
import { useGetAssignmentById } from "@/lib/react-query/queries";
import { useState } from "react";
import Loader from "@/components/shared/Loader";

const AssignmentDetail = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { data: assignment, isLoading } = useGetAssignmentById(assignmentId);
  const [reminderSet, setReminderSet] = useState(false);
  const [status, setStatus] = useState("not_started");

  if (isLoading) return <Loader />;
  if (!assignment)
    return <div className="text-light-2">Assignment not found</div>;

  const now = new Date();
  const dueDate = new Date(assignment.due_date);
  const diff = dueDate.getTime() - now.getTime();
  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const isOverdue = diff < 0;
  const isExam = assignment.assignment_type === "exam";
  const isGroupProject = assignment.is_group_project;

  const getStatusColor = (value: string) => {
    switch (value) {
      case "not_started":
        return "bg-gray-500/20 text-gray-400";
      case "in_progress":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "submitted":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <button
        onClick={() => navigate("/assignments")}
        className="flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-4">
        <img src="/assets/icons/back.svg" width={20} height={20} alt="back" />
        Back to Assignments
      </button>

      {/* Header */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h2 className="h2-bold mb-4">{assignment.title}</h2>
        <p className="text-light-2 text-large-medium mb-6">
          {assignment.description}
        </p>

        {/* Status Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span
            className={`px-4 py-2 rounded-full font-semibold text-small-medium ${getStatusColor(
              status
            )}`}>
            Status: {status.replace("_", " ").toUpperCase()}
          </span>
          <span
            className={`px-4 py-2 rounded-full font-semibold text-small-medium ${
              assignment.is_group_project
                ? "bg-purple-500/20 text-purple-400"
                : "bg-blue-500/20 text-blue-400"
            }`}>
            {assignment.is_group_project ? "Group Project" : "Individual"}
          </span>
          <span
            className={`px-4 py-2 rounded-full font-semibold text-small-medium ${
              isExam
                ? "bg-red-500/20 text-red-400"
                : "bg-orange-500/20 text-orange-400"
            }`}>
            {assignment.assignment_type.toUpperCase()}
          </span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-dark-3 rounded-lg">
          <div>
            <p className="text-light-4 text-tiny">Total Points</p>
            <p className="h3-bold">{assignment.total_points}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Assignment Type</p>
            <p className="font-semibold capitalize">
              {assignment.assignment_type}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Created By</p>
            <p className="font-semibold">Professor/TA</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Posted Date</p>
            <p className="font-semibold">
              {new Date(assignment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Deadline Countdown */}
      <div
        className={`${
          isExam
            ? "bg-red-500/10 border-red-500/30"
            : "bg-orange-500/10 border-orange-500/30"
        } rounded-[10px] border p-5 lg:p-7`}>
        <h3 className="h3-bold mb-4">
          {isExam ? "📋 Exam Countdown" : "⏰ Deadline Countdown"}
        </h3>

        {isOverdue ? (
          <div className="text-red-400">
            <p className="h2-bold mb-2">Overdue!</p>
            <p className="text-light-2">
              This assignment was due on {dueDate.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-dark-3 rounded-lg p-4 text-center">
                <p className="h2-bold text-primary-500">{daysLeft}</p>
                <p className="text-light-3 text-small-medium">Days</p>
              </div>
              <div className="bg-dark-3 rounded-lg p-4 text-center">
                <p className="h2-bold text-primary-500">{hoursLeft}</p>
                <p className="text-light-3 text-small-medium">Hours</p>
              </div>
              <div className="bg-dark-3 rounded-lg p-4 text-center">
                <p className="h2-bold text-primary-500">{minutesLeft}</p>
                <p className="text-light-3 text-small-medium">Minutes</p>
              </div>
              <div className="bg-dark-3 rounded-lg p-4 text-center">
                <p className="h2-bold text-primary-500">
                  {new Date().getSeconds()}
                </p>
                <p className="text-light-3 text-small-medium">Seconds</p>
              </div>
            </div>

            <div className="text-light-2">
              <p className="font-semibold mb-2">
                Due: {dueDate.toLocaleString()}
              </p>
              <div className="w-full bg-dark-3 rounded-full h-2">
                <div
                  className={`${
                    diff < 24 * 60 * 60 * 1000 ? "bg-red-500" : "bg-primary-500"
                  } h-2 rounded-full transition`}
                  style={{
                    width: `${Math.max(
                      0,
                      100 - (diff / (30 * 24 * 60 * 60 * 1000)) * 100
                    )}%`,
                  }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h3 className="h3-bold mb-4">Update Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="shad-input w-full mb-4">
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="submitted">Submitted</option>
        </select>
      </div>

      {/* Reminders */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h3 className="h3-bold mb-4">🔔 Deadline Reminders</h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 bg-dark-3 rounded-lg hover:bg-dark-4 transition cursor-pointer">
            <input
              type="checkbox"
              checked={reminderSet}
              onChange={(e) => setReminderSet(e.target.checked)}
              className="mr-3 w-4 h-4"
            />
            <div>
              <p className="font-semibold text-light-1">Enable Reminders</p>
              <p className="text-light-3 text-small-medium">
                Get notifications before the deadline
              </p>
            </div>
          </label>

          {reminderSet && (
            <div className="space-y-2">
              <label className="flex items-center p-3 bg-dark-3 rounded-lg hover:bg-dark-4 transition cursor-pointer">
                <input
                  type="radio"
                  name="reminder"
                  defaultChecked
                  className="mr-3 w-4 h-4"
                />
                <span className="text-light-1">24 hours before</span>
              </label>
              <label className="flex items-center p-3 bg-dark-3 rounded-lg hover:bg-dark-4 transition cursor-pointer">
                <input type="radio" name="reminder" className="mr-3 w-4 h-4" />
                <span className="text-light-1">12 hours before</span>
              </label>
              <label className="flex items-center p-3 bg-dark-3 rounded-lg hover:bg-dark-4 transition cursor-pointer">
                <input type="radio" name="reminder" className="mr-3 w-4 h-4" />
                <span className="text-light-1">1 hour before</span>
              </label>
              <label className="flex items-center p-3 bg-dark-3 rounded-lg hover:bg-dark-4 transition cursor-pointer">
                <input type="radio" name="reminder" className="mr-3 w-4 h-4" />
                <span className="text-light-1">Custom time...</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Group Project Members (if applicable) */}
      {isGroupProject && (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">👥 Group Members</h3>
          <div className="space-y-3">
            {["Alice Johnson", "Bob Smith", "Carol Davis"].map(
              (member, idx) => (
                <div
                  key={idx}
                  className="bg-dark-3 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{member}</p>
                    <p className="text-light-3 text-small-medium">Member</p>
                  </div>
                  <button className="px-4 py-2 bg-primary-500/20 text-primary-500 rounded font-semibold hover:bg-primary-500/30">
                    Message
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 shad-button_primary">
          {status === "submitted" ? "View Submission" : "Submit Assignment"}
        </button>
        <button className="flex-1 bg-dark-3 text-light-1 px-4 py-2 rounded font-semibold hover:bg-dark-4 transition">
          View Resources
        </button>
        <button className="flex-1 bg-dark-3 text-light-1 px-4 py-2 rounded font-semibold hover:bg-dark-4 transition">
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default AssignmentDetail;
