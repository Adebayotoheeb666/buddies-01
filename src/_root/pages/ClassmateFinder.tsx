import { useState } from "react";
import {
  useGetUserCourses,
  useGetCourseClassmates,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const ClassmateFinder = () => {
  const { user } = useUserContext();
  const { data: coursesData, isLoading: coursesLoading } = useGetUserCourses(
    user?.id
  );
  const courses = coursesData?.documents || [];
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const { data: classmatesData, isLoading: classmatesLoading } =
    useGetCourseClassmates(selectedCourse, user?.id);
  const classmates = classmatesData?.documents || [];

  if (coursesLoading || (selectedCourse && classmatesLoading))
    return <Loader />;

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/people.svg"
          width={36}
          height={36}
          alt="classmates"
        />
        <h2 className="h3-bold md:h2-bold w-full">Find Classmates</h2>
      </div>

      {courses.length === 0 ? (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-8 text-center">
          <p className="text-light-2">Enroll in courses to find classmates.</p>
        </div>
      ) : (
        <>
          {/* Course Selector */}
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
            <label className="shad-form_label block mb-3">
              Select a Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="shad-input w-full">
              <option value="">Choose a course...</option>
              {courses?.map((course) =>
                course ? (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Classmates List */}
          {selectedCourse && (
            <div className="flex flex-col gap-4">
              <div className="text-light-3">
                <p className="h3-bold">
                  {classmates.length} classmates in this course
                </p>
              </div>

              {classmates.length === 0 ? (
                <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-8 text-center">
                  <p className="text-light-2">
                    No other classmates found in this course yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classmates?.map((classmate) =>
                    classmate ? (
                      <div
                        key={classmate.id}
                        className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 hover:bg-dark-3 transition">
                        <div className="flex gap-4 items-start">
                          <img
                            src={classmate.imageUrl}
                            alt={classmate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{classmate.name}</h3>
                            <p className="text-light-3 text-small-medium">
                              @{classmate.username}
                            </p>
                            <p className="text-light-2 text-small-regular mt-2 line-clamp-2">
                              {classmate.bio}
                            </p>
                            <div className="mt-3 flex gap-2">
                              {classmate.interests
                                ?.slice(0, 2)
                                .map((interest, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary-500/20 text-primary-500 rounded text-tiny">
                                    {interest}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-dark-4">
                          <button className="flex-1 bg-primary-500/20 text-primary-500 px-3 py-2 rounded font-semibold hover:bg-primary-500/30 transition text-small-medium">
                            Follow
                          </button>
                          <button className="flex-1 bg-dark-3 text-light-1 px-3 py-2 rounded font-semibold hover:bg-dark-4 transition text-small-medium">
                            Message
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassmateFinder;
