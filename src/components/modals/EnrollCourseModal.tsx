import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/academic.types";
import { useToast } from "@/components/ui/use-toast";

interface EnrollCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const EnrollCourseModal = ({
  isOpen,
  onClose,
  course,
}: EnrollCourseModalProps) => {
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      // Simulate enrollment API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({ title: `Successfully enrolled in ${course.course_code}!` });
      setIsEnrolling(false);
      onClose();
    } catch (error) {
      toast({ title: "Failed to enroll. Please try again." });
      setIsEnrolling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-6 w-full max-w-md">
        <h2 className="h2-bold mb-4">Enroll in Course</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-dark-3 rounded-lg p-4">
            <p className="text-light-4 text-small-medium mb-1">Course Code</p>
            <p className="text-light-1 font-semibold text-large">
              {course.course_code}
            </p>
          </div>

          <div className="bg-dark-3 rounded-lg p-4">
            <p className="text-light-4 text-small-medium mb-1">Course Name</p>
            <p className="text-light-1 font-semibold">{course.course_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-3 rounded-lg p-4">
              <p className="text-light-4 text-small-medium mb-1">Credits</p>
              <p className="text-light-1 font-semibold">{course.credits}</p>
            </div>
            <div className="bg-dark-3 rounded-lg p-4">
              <p className="text-light-4 text-small-medium mb-1">Professor</p>
              <p className="text-light-1 font-semibold text-small">
                {course.professor}
              </p>
            </div>
          </div>

          <div className="bg-dark-3 rounded-lg p-4">
            <p className="text-light-4 text-small-medium mb-2">Schedule</p>
            <p className="text-light-1 text-small">
              {course.schedule_json.days.join(", ")}
            </p>
            <p className="text-light-1 text-small">
              {course.schedule_json.startTime} - {course.schedule_json.endTime}
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-small-medium">
              ✓ {course.max_enrollment - course.enrollment_count} spots
              available
            </p>
          </div>
        </div>

        <p className="text-light-3 text-small-regular mb-6">
          By enrolling in this course, you will be added to the course community
          and receive course updates.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-dark-3 text-light-1 font-semibold hover:bg-dark-4">
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            className="flex-1 shad-button_primary"
            disabled={isEnrolling}>
            {isEnrolling ? "Enrolling..." : "Confirm Enrollment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourseModal;
