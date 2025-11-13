import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseById } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { useState } from "react";
import EnrollCourseModal from "@/components/modals/EnrollCourseModal";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourseById(courseId);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  if (isLoading) return <Loader />;
  if (!course) return <div className="text-light-2">Course not found</div>;

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      {/* Header */}
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-4">
        <img src="/assets/icons/back.svg" width={20} height={20} alt="back" />
        Back to Courses
      </button>

      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="h2-bold">{course.course_code}</h2>
            <p className="text-light-2 text-large-medium">
              {course.course_name}
            </p>
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="shad-button_primary">
            Enroll Now
          </button>
        </div>

        {/* Course Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-dark-4">
          <div>
            <p className="text-light-4 text-tiny">Professor</p>
            <p className="text-light-1 font-semibold">{course.professor}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Department</p>
            <p className="text-light-1 font-semibold">{course.department}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Semester</p>
            <p className="text-light-1 font-semibold">{course.semester}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Credits</p>
            <p className="text-light-1 font-semibold">{course.credits}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Location</p>
            <p className="text-light-1 font-semibold">{course.location}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Section</p>
            <p className="text-light-1 font-semibold">{course.section}</p>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-8">
          <h3 className="h3-bold mb-4">Course Schedule</h3>
          <div className="bg-dark-3 rounded-lg p-4">
            <div className="space-y-3">
              <p className="text-light-2">
                <span className="text-light-4">Days:</span>{" "}
                {course.schedule_json.days.join(", ")}
              </p>
              <p className="text-light-2">
                <span className="text-light-4">Time:</span>{" "}
                {course.schedule_json.startTime} -{" "}
                {course.schedule_json.endTime}
              </p>
              <p className="text-light-2">
                <span className="text-light-4">Building:</span>{" "}
                {course.location}
              </p>
            </div>
          </div>
        </div>

        {/* Enrollment Info */}
        <div className="mb-8">
          <h3 className="h3-bold mb-4">Enrollment Status</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-dark-3 rounded-lg p-4">
              <p className="text-light-4 text-small-medium mb-2">
                Current Enrollment
              </p>
              <p className="h3-bold">
                {course.enrollment_count}/{course.max_enrollment}
              </p>
              <div className="mt-2 bg-dark-4 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (course.enrollment_count / course.max_enrollment) * 100
                    }%`,
                  }}></div>
              </div>
            </div>
            <div className="flex-1 bg-dark-3 rounded-lg p-4">
              <p className="text-light-4 text-small-medium mb-2">
                Spots Available
              </p>
              <p className="h3-bold text-green-400">
                {course.max_enrollment - course.enrollment_count}
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-6 border-t border-dark-4">
          <button className="flex-1 bg-dark-3 text-light-1 px-4 py-2 rounded font-semibold hover:bg-dark-4 transition">
            View Classmates
          </button>
          <button className="flex-1 bg-dark-3 text-light-1 px-4 py-2 rounded font-semibold hover:bg-dark-4 transition">
            Course Community
          </button>
          <button className="flex-1 bg-dark-3 text-light-1 px-4 py-2 rounded font-semibold hover:bg-dark-4 transition">
            Course Schedule
          </button>
        </div>
      </div>

      {/* Enroll Modal */}
      <EnrollCourseModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        course={course}
      />
    </div>
  );
};

export default CourseDetail;
