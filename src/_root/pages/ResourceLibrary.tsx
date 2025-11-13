import { useState } from "react";
import { useGetResources, useGetCourses } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

const ResourceLibrary = () => {
  const { data: resourcesData, isLoading } = useGetResources();
  const { data: coursesData } = useGetCourses();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const resources = resourcesData?.documents || [];
  const courses = coursesData?.documents || [];

  const resourceTypes = Array.from(
    new Set(resources.map((r) => r.resource_type))
  ).sort();

  let filteredResources = resources;

  if (selectedType) {
    filteredResources = filteredResources.filter(
      (r) => r.resource_type === selectedType
    );
  }

  if (selectedCourse) {
    filteredResources = filteredResources.filter(
      (r) => r.course_id === selectedCourse
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return "📚";
      case "notes":
        return "📝";
      case "video":
        return "🎥";
      case "textbook":
        return "📖";
      default:
        return "📄";
    }
  };

  return (
    <div className="flex flex-col gap-9 w-full max-w-6xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="resources"
        />
        <h2 className="h3-bold md:h2-bold w-full">Resource Library</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-light-3 text-small-medium mb-2">Resource Type</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedType(null)}
              className={`${
                selectedType === null
                  ? "bg-primary-500 text-white"
                  : "bg-dark-3 text-light-1"
              }`}>
              All Types
            </Button>
            {resourceTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`${
                  selectedType === type
                    ? "bg-primary-500 text-white"
                    : "bg-dark-3 text-light-1"
                }`}>
                {getTypeIcon(type)} {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-light-3 text-small-medium mb-2">Course</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedCourse(null)}
              className={`${
                selectedCourse === null
                  ? "bg-primary-500 text-white"
                  : "bg-dark-3 text-light-1"
              }`}>
              All Courses
            </Button>
            {courses.slice(0, 6).map((course) => (
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
        </div>
      </div>

      {isLoading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredResources.map((resource) => {
          const course = courses.find((c) => c.id === resource.course_id);
          return (
            <div
              key={resource.id}
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 hover:bg-dark-3 transition">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">
                  {getTypeIcon(resource.resource_type)}
                </span>
                <span className="text-tiny-medium bg-dark-4 px-2 py-1 rounded capitalize">
                  {resource.resource_type}
                </span>
              </div>

              <h3 className="h3-bold mb-2 line-clamp-2">{resource.title}</h3>
              <p className="text-light-2 text-small-medium mb-4 line-clamp-2">
                {resource.description}
              </p>

              {course && (
                <p className="text-light-3 text-tiny-medium mb-4">
                  Course:{" "}
                  <span className="text-light-1">{course.course_code}</span>
                </p>
              )}

              <div className="flex gap-4 mb-4 py-4 border-t border-dark-4 text-center">
                <div className="flex-1">
                  <p className="text-light-3 text-tiny-medium">Views</p>
                  <p className="h3-bold text-primary-500">{resource.views}</p>
                </div>
                <div className="flex-1">
                  <p className="text-light-3 text-tiny-medium">Downloads</p>
                  <p className="h3-bold text-primary-500">
                    {resource.downloads}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-primary-500 text-white hover:bg-primary-600">
                  Download
                </Button>
                <Button className="flex-1 bg-dark-3 text-light-1 hover:bg-dark-4">
                  Save
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && !isLoading && (
        <div className="flex flex-col gap-4 items-center justify-center min-h-96">
          <p className="text-light-3 text-body-medium">No resources found</p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
