import { useState } from "react";
import { useGetTutoringProfiles } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

const TutoringBrowser = () => {
  const { data: tutorsData, isLoading } = useGetTutoringProfiles();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const tutors = tutorsData?.documents || [];

  const allSubjects = Array.from(
    new Set(tutors.flatMap((t) => t.subjects_tutored))
  ).sort();

  const filteredTutors = selectedSubject
    ? tutors.filter((t) => t.subjects_tutored.includes(selectedSubject))
    : tutors;

  const formatAvailability = (availability: any) => {
    if (!availability) return [];
    return Object.entries(availability)
      .map(([day]: [string, any]) => `${day}`)
      .slice(0, 3);
  };

  return (
    <div className="flex flex-col gap-9 w-full max-w-6xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="tutoring"
        />
        <h2 className="h3-bold md:h2-bold w-full">Peer Tutoring</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setSelectedSubject(null)}
          className={`${
            selectedSubject === null
              ? "bg-primary-500 text-white"
              : "bg-dark-3 text-light-1"
          }`}>
          All Subjects
        </Button>
        {allSubjects.map((subject) => (
          <Button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`${
              selectedSubject === subject
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-1"
            }`}>
            {subject}
          </Button>
        ))}
      </div>

      {isLoading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredTutors.map((tutor) => {
          const availability = formatAvailability(tutor.availability_json);
          return (
            <div
              key={tutor.id}
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 hover:bg-dark-3 transition">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {tutor.user_id.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="h3-bold">Tutor {tutor.user_id.slice(0, 8)}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="text-primary-500 font-semibold">
                      ${tutor.hourly_rate}/hr
                    </span>
                    <span className="text-yellow-400 text-tiny-medium">
                      ★ 4.8
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-light-2 text-small-medium mb-4 line-clamp-2">
                {tutor.bio}
              </p>

              <div className="mb-4">
                <p className="text-light-3 text-tiny-medium mb-2">Subjects:</p>
                <div className="flex gap-2 flex-wrap">
                  {(tutor.subjects_tutored as string[]).map((subject: string) => (
                    <span
                      key={subject}
                      className="text-tiny-medium bg-dark-4 px-3 py-1 rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 py-3 border-t border-dark-4">
                <p className="text-light-3 text-tiny-medium mb-2">Available:</p>
                <div className="flex gap-2 flex-wrap">
                  {availability.map((day) => (
                    <span
                      key={day}
                      className="text-tiny-medium bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-primary-500 text-white hover:bg-primary-600">
                  Request
                </Button>
                <Button className="flex-1 bg-dark-3 text-light-1 hover:bg-dark-4">
                  Message
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTutors.length === 0 && !isLoading && (
        <div className="flex flex-col gap-4 items-center justify-center min-h-96">
          <p className="text-light-3 text-body-medium">No tutors found</p>
        </div>
      )}
    </div>
  );
};

export default TutoringBrowser;
