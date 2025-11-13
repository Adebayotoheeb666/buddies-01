import { useGetStudyGroups } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

const StudyGroups = () => {
  const { data: groupsData, isLoading } = useGetStudyGroups();
  const studyGroups = groupsData?.documents || [];

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="add"
        />
        <h2 className="h3-bold md:h2-bold w-full">Study Groups</h2>
      </div>

      {isLoading && <Loader />}

      <div className="flex flex-col gap-5 w-full">
        {studyGroups.map((group) => (
          <div
            key={group.id}
            className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 cursor-pointer hover:bg-dark-3 transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="h3-bold">{group.name}</h3>
                <p className="text-light-3 text-small-medium">
                  Created by • {group.creator_id}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-small-medium ${
                  group.is_active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                {group.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-light-2 mb-4">{group.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-small-regular text-light-3">
              <div>
                <p className="text-light-4 text-tiny">Location</p>
                <p>{group.location}</p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Members</p>
                <p>
                  {group.members_count}/{group.max_members}
                </p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Course</p>
                <p>{group.course_id ? "CS101" : "General"}</p>
              </div>
              <div>
                <p className="text-light-4 text-tiny">Next Meeting</p>
                <p>
                  {group.meeting_time
                    ? new Date(group.meeting_time).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark-4">
              <button className="flex-1 shad-button_primary">Join Group</button>
              <button className="flex-1 bg-dark-3 text-light-1 px-3 py-2 rounded font-semibold hover:bg-dark-4 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroups;
