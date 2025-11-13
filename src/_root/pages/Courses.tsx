import { useGetCourses } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";

const Courses = () => {
  const { data: coursesData, isLoading } = useGetCourses();
  const courses = coursesData?.documents || [];

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="add"
        />
        <h2 className="h3-bold md:h2-bold w-full">Browse Courses</h2>
      </div>

      {isLoading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 cursor-pointer hover:bg-dark-3 transition">
            <div className="mb-4">
              <h3 className="h3-bold">{course.course_code}</h3>
              <p className="subtle-semibold text-light-3">
                {course.course_name}
              </p>
            </div>

            <div className="space-y-2 text-small-regular text-light-2">
              <p>
                <span className="text-light-3">Professor:</span>{" "}
                {course.professor}
              </p>
              <p>
                <span className="text-light-3">Department:</span>{" "}
                {course.department}
              </p>
              <p>
                <span className="text-light-3">Semester:</span>{" "}
                {course.semester}
              </p>
              <p>
                <span className="text-light-3">Credits:</span> {course.credits}
              </p>
              <p>
                <span className="text-light-3">Location:</span>{" "}
                {course.location}
              </p>
              <p>
                <span className="text-light-3">Enrollment:</span>{" "}
                {course.enrollment_count}/{course.max_enrollment}
              </p>

              <div className="mt-4 pt-4 border-t border-dark-4">
                <p className="text-small-medium text-light-3">
                  Schedule: {course.schedule_json.days.join(", ")} •{" "}
                  {course.schedule_json.startTime} -{" "}
                  {course.schedule_json.endTime}
                </p>
              </div>
            </div>

            <button className="mt-4 w-full shad-button_primary">Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
