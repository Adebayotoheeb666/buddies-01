import { useState } from "react";
import { useGetAssignments } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const GroupProjectBoard = () => {
  const { data: assignmentsData, isLoading } = useGetAssignments();
  const assignments = assignmentsData?.documents || [];

  // Filter only group projects
  const groupProjects = assignments.filter((a) => a.is_group_project);

  // Mock tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Research and Planning",
      description: "Gather requirements and create project plan",
      assignedTo: "Alice Johnson",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-09-20",
    },
    {
      id: "2",
      title: "Frontend Development",
      description: "Build UI components and pages",
      assignedTo: "Bob Smith",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-10-01",
    },
    {
      id: "3",
      title: "Backend API",
      description: "Develop REST API endpoints",
      assignedTo: "Carol Davis",
      status: "todo",
      priority: "high",
      dueDate: "2024-10-01",
    },
    {
      id: "4",
      title: "Testing & QA",
      description: "Write tests and fix bugs",
      assignedTo: "David Lee",
      status: "todo",
      priority: "medium",
      dueDate: "2024-10-10",
    },
    {
      id: "5",
      title: "Documentation",
      description: "Write project documentation",
      assignedTo: "Emma Wilson",
      status: "todo",
      priority: "low",
      dueDate: "2024-10-15",
    },
    {
      id: "6",
      title: "Presentation Slides",
      description: "Create final presentation",
      assignedTo: "Alice Johnson",
      status: "done",
      priority: "medium",
      dueDate: "2024-12-01",
    },
  ]);

  const moveTask = (
    taskId: string,
    newStatus: "todo" | "in_progress" | "done"
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status: "todo" | "in_progress" | "done") => {
    return tasks.filter((t) => t.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-9 w-full">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="board"
        />
        <h2 className="h3-bold md:h2-bold w-full">Group Project Board</h2>
      </div>

      {groupProjects.length === 0 ? (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-8 text-center">
          <p className="text-light-2">No group projects assigned yet.</p>
        </div>
      ) : (
        <>
          {/* Project Info */}
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5">
            <h3 className="h3-bold mb-3">Active Projects</h3>
            <div className="space-y-2">
              {groupProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between bg-dark-3 p-3 rounded">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-light-3 text-small-medium">
                      {project.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded text-small-medium">
                    Due: {new Date(project.due_date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Todo Column */}
            <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5">
              <h3 className="h3-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                Todo ({getTasksByStatus("todo").length})
              </h3>
              <div className="space-y-3">
                {getTasksByStatus("todo").map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-dark-3 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-dark-4 transition border-l-4 border-gray-500">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-light-1 flex-1">
                        {task.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-tiny font-semibold border ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-light-2 text-small-regular mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-light-4 text-small-medium">
                        {task.assignedTo}
                      </p>
                      {task.dueDate && (
                        <p className="text-light-3 text-small-medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("taskId");
                moveTask(taskId, "in_progress");
              }}>
              <h3 className="h3-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                In Progress ({getTasksByStatus("in_progress").length})
              </h3>
              <div className="space-y-3">
                {getTasksByStatus("in_progress").map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-dark-3 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-dark-4 transition border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-light-1 flex-1">
                        {task.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-tiny font-semibold border ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-light-2 text-small-regular mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-light-4 text-small-medium">
                        {task.assignedTo}
                      </p>
                      {task.dueDate && (
                        <p className="text-light-3 text-small-medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("taskId");
                moveTask(taskId, "done");
              }}>
              <h3 className="h3-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Done ({getTasksByStatus("done").length})
              </h3>
              <div className="space-y-3">
                {getTasksByStatus("done").map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("taskId", task.id);
                    }}
                    className="bg-dark-3 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-dark-4 transition border-l-4 border-green-500 opacity-75">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-light-1 flex-1 line-through">
                        {task.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-tiny font-semibold border ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-light-2 text-small-regular mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-light-4 text-small-medium">
                        {task.assignedTo}
                      </p>
                      {task.dueDate && (
                        <p className="text-light-3 text-small-medium">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupProjectBoard;
