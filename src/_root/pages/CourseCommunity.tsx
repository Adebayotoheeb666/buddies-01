import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCourseById,
  useGetCourseAssignments,
  useGetCourseSharedNotes,
} from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

const CourseCommunity = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useGetCourseById(courseId);
  const { data: assignmentsData } = useGetCourseAssignments(courseId);
  const { data: notesData } = useGetCourseSharedNotes(courseId);

  const assignments = assignmentsData?.documents || [];
  const courseNotes = notesData?.documents || [];

  if (courseLoading) return <Loader />;
  if (!course) return <div className="text-light-2">Course not found</div>;

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-4">
        <img src="/assets/icons/back.svg" width={20} height={20} alt="back" />
        Back to Courses
      </button>

      {/* Header */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h2 className="h2-bold mb-2">{course.course_code}: Community</h2>
        <p className="text-light-2">{course.course_name}</p>
      </div>

      {/* Tabs/Sections */}
      <div className="space-y-6">
        {/* Announcements */}
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">📢 Announcements</h3>
          <div className="space-y-3">
            <div className="bg-dark-3 rounded-lg p-4 border-l-4 border-primary-500">
              <p className="text-light-4 text-small-medium mb-1">
                Announcement from {course.professor}
              </p>
              <p className="text-light-1">
                Welcome to {course.course_code}! Looking forward to an engaging
                semester.
              </p>
            </div>
            <div className="bg-dark-3 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-light-4 text-small-medium mb-1">
                Course Update
              </p>
              <p className="text-light-1">
                First assignment will be posted next week. Start reading Chapter
                1.
              </p>
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">
            📋 Assignments ({assignments.length})
          </h3>
          {assignments.length === 0 ? (
            <p className="text-light-3">No assignments yet.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-dark-3 rounded-lg p-4 hover:bg-dark-4 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-light-1">
                        {assignment.title}
                      </p>
                      <p className="text-light-3 text-small-medium">
                        {assignment.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-small-medium">
                      {assignment.assignment_type}
                    </span>
                  </div>
                  <div className="mt-3 text-small-regular text-light-3">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared Notes */}
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">
            📝 Shared Notes ({courseNotes.length})
          </h3>
          {courseNotes.length === 0 ? (
            <p className="text-light-3">
              No shared notes yet. Be the first to share!
            </p>
          ) : (
            <div className="space-y-3">
              {courseNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-dark-3 rounded-lg p-4 hover:bg-dark-4 transition">
                  <h4 className="font-semibold text-light-1 mb-2">
                    {note.title}
                  </h4>
                  <p className="text-light-2 text-small-regular mb-3 line-clamp-2">
                    {note.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-dark-4 text-light-3 rounded text-tiny">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-primary-500 text-small-medium hover:text-primary-400">
                    View Full Note →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Resources */}
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">📚 Course Resources</h3>
          <div className="space-y-3">
            <div className="bg-dark-3 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-light-1">
                  Textbook: {course.course_code} Essentials
                </p>
                <p className="text-light-3 text-small-medium">
                  Recommended reading material
                </p>
              </div>
              <button className="px-4 py-2 bg-primary-500/20 text-primary-500 rounded font-semibold hover:bg-primary-500/30">
                Info
              </button>
            </div>
            <div className="bg-dark-3 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-light-1">Lecture Slides</p>
                <p className="text-light-3 text-small-medium">
                  Downloadable lecture presentations
                </p>
              </div>
              <button className="px-4 py-2 bg-primary-500/20 text-primary-500 rounded font-semibold hover:bg-primary-500/30">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Discussion Board */}
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">💬 Discussion Board</h3>
          <textarea
            className="shad-input w-full min-h-[100px] mb-3"
            placeholder="Start a discussion or ask a question..."></textarea>
          <button className="shad-button_primary">Post Discussion</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCommunity;
