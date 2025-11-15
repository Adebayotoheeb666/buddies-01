import { useState } from "react";
import { useGetSharedNotes, useGetCourses } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

const NoteLibrary = () => {
  const { data: notesData, isLoading: notesLoading } = useGetSharedNotes();
  const { data: coursesData } = useGetCourses();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const notes = notesData?.documents || [];
  const courses = coursesData?.documents || [];

  const filteredNotes = selectedCourse
    ? notes.filter((note) => note.course_id === selectedCourse)
    : notes;

  return (
    <div className="flex flex-col gap-9 w-full max-w-6xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="notes"
        />
        <h2 className="h3-bold md:h2-bold w-full">Note Library</h2>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setSelectedCourse(null)}
          className={`${
            selectedCourse === null
              ? "bg-primary-500 text-white"
              : "bg-dark-3 text-light-1"
          }`}>
          All Courses
        </Button>
        {courses.map((course) => (
          <Button
            key={course.id}
            onClick={() => setSelectedCourse(course.id)}
            className={`${
              selectedCourse === course.id
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-1"
            }`}>
            {course.course_code}
          </Button>
        ))}
      </div>

      {notesLoading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredNotes.map((note) => {
          const course = courses.find((c) => c.id === note.course_id);
          return (
            <div
              key={note.id}
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 hover:bg-dark-3 transition cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="h3-bold line-clamp-2">{note.title}</h3>
                  <p className="text-light-3 text-small-medium">
                    {course?.course_code}
                  </p>
                </div>
              </div>

              <p className="text-light-2 text-small-medium line-clamp-3 mb-4">
                {note.content}
              </p>

              <div className="flex gap-2 flex-wrap mb-4">
                {note.tags.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-tiny-medium bg-dark-4 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-light-3 text-tiny-medium">
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                <Button className="bg-primary-500 text-white text-tiny-medium px-3 py-1 h-auto rounded-full">
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && !notesLoading && (
        <div className="flex flex-col gap-4 items-center justify-center min-h-96">
          <p className="text-light-3 text-body-medium">No notes found</p>
        </div>
      )}
    </div>
  );
};

export default NoteLibrary;
