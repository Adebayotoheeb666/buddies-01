import { useGetUserCourses } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const CourseScheduleView = () => {
  const { user } = useUserContext();
  const { data: coursesData, isLoading } = useGetUserCourses(user?.id);
  const courses = coursesData?.documents || [];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const getCoursesInTimeSlot = (day: string, hour: string) => {
    return courses.filter((course) => {
      const schedule = course?.schedule_json;
      const dayMatch = schedule?.days?.some(
        (d: string) => d === day || d === (day as string).slice(0, 3)
      );
      const startHour = schedule?.startTime ? schedule.startTime.split(":")[0] : "0";
      const endHour = schedule?.endTime ? schedule.endTime.split(":")[0] : "0";
      const currentHour = parseInt(hour);
      return (
        dayMatch &&
        currentHour >= parseInt(startHour) &&
        currentHour < parseInt(endHour)
      );
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-9 w-full">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="schedule"
        />
        <h2 className="h3-bold md:h2-bold w-full">Course Schedule</h2>
      </div>

      {courses.length === 0 ? (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-8 text-center">
          <p className="text-light-2">
            You haven't enrolled in any courses yet.
          </p>
        </div>
      ) : (
        <>
          {/* Schedule Grid */}
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-4">
                  <th className="p-4 text-left text-light-3 font-semibold bg-dark-3">
                    Time
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="p-4 text-center text-light-3 font-semibold bg-dark-3">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr
                    key={time}
                    className="border-b border-dark-4 hover:bg-dark-3 transition">
                    <td className="p-4 text-light-3 font-semibold">{time}</td>
                    {daysOfWeek.map((day) => {
                      const coursesAtSlot = getCoursesInTimeSlot(day, time);
                      return (
                        <td key={`${day}-${time}`} className="p-2 text-center">
                          {coursesAtSlot.map((course) =>
                            course ? (
                              <div
                                key={course.id}
                                className="bg-primary-500/20 text-primary-400 rounded px-2 py-1 text-tiny font-semibold">
                                {course.course_code}
                              </div>
                            ) : null
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Course List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses?.map((course) =>
              course ? (
                <div
                  key={course.id}
                  className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
                  <h3 className="h3-bold mb-2">{course.course_code}</h3>
                  <p className="text-light-3 text-small-medium mb-3">
                    {course.course_name}
                  </p>
                  <div className="space-y-2 text-small-regular text-light-2">
                    <p>
                      <span className="text-light-4">Time:</span>{" "}
                      {course.schedule_json?.days?.join(", ")} •{" "}
                      {course.schedule_json?.startTime} -{" "}
                      {course.schedule_json?.endTime}
                    </p>
                    <p>
                      <span className="text-light-4">Location:</span>{" "}
                      {course.location}
                    </p>
                    <p>
                      <span className="text-light-4">Professor:</span>{" "}
                      {course.professor}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseScheduleView;
