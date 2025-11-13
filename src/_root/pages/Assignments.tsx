import { useGetAssignments } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

const Assignments = () => {
  const { data: assignmentsData, isLoading } = useGetAssignments();
  const assignments = assignmentsData?.documents || [];

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Due soon";
  };

  const getStatusColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return "bg-red-500/20 text-red-400";
    if (diff < 24 * 60 * 60 * 1000) return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  };

  // Sort by due date
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="add"
        />
        <h2 className="h3-bold md:h2-bold w-full">Assignment Tracker</h2>
      </div>

      {isLoading && <Loader />}

      <div className="flex flex-col gap-4 w-full">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 hover:bg-dark-3 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="h3-bold">{assignment.title}</h3>
                <p className="text-light-3 text-small-medium">
                  Course ID: {assignment.course_id}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-small-medium whitespace-nowrap ml-2 ${getStatusColor(
                  assignment.due_date
                )}`}>
                {getTimeRemaining(assignment.due_date)}
              </span>
            </div>

            <p className="text-light-2 text-small-regular mb-4">
              {assignment.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-small-regular text-light-3">
              <div>
                <p className="text-light-4 text-tiny">Type</p>
                <p className="capitalize">{assignment.assignment_type}</p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Points</p>
                <p>{assignment.total_points}</p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Group Project</p>
                <p>{assignment.is_group_project ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Due Date</p>
                <p>
                  {new Date(assignment.due_date).toLocaleDateString()}{" "}
                  {new Date(assignment.due_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark-4">
              <button className="flex-1 shad-button_primary">
                View Details
              </button>
              <button className="flex-1 bg-dark-3 text-light-1 px-3 py-2 rounded font-semibold hover:bg-dark-4 transition">
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
