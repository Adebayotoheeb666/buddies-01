import { useParams, useNavigate } from "react-router-dom";
import {
  useGetStudyGroupById,
  useGetStudyGroupMembers,
  useGetUserById,
} from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { useState } from "react";

const StudyGroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: group, isLoading: groupLoading } =
    useGetStudyGroupById(groupId);
  const { data: membersData, isLoading: membersLoading } =
    useGetStudyGroupMembers(groupId);
  const { data: creator, isLoading: creatorLoading } = useGetUserById(
    group?.creator_id || ""
  );
  const [isMember, setIsMember] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const members = membersData?.documents || [];

  if (groupLoading || membersLoading || creatorLoading) return <Loader />;
  if (!group) return <div className="text-light-2">Study group not found</div>;

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <button
        onClick={() => navigate("/study-groups")}
        className="flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-4">
        <img src="/assets/icons/back.svg" width={20} height={20} alt="back" />
        Back to Study Groups
      </button>

      {/* Header */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="h2-bold mb-2">{group.name}</h2>
            <p className="text-light-3">Created by {creator?.name}</p>
          </div>
          <button
            onClick={() => setIsMember(!isMember)}
            className={`px-6 py-2 rounded font-semibold ${
              isMember
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "shad-button_primary"
            }`}>
            {isMember ? "Leave Group" : "Join Group"}
          </button>
        </div>

        <p className="text-light-2 mb-6">{group.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-dark-3 rounded-lg">
          <div>
            <p className="text-light-4 text-tiny">Members</p>
            <p className="h3-bold">
              {group.members_count}/{group.max_members}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Location</p>
            <p className="font-semibold">{group.location}</p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Status</p>
            <p className="font-semibold">
              {group.is_active ? "Active" : "Inactive"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Next Meeting</p>
            <p className="font-semibold text-small">
              {group.meeting_time
                ? new Date(group.meeting_time).toLocaleDateString()
                : "TBD"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-4">
        <button
          onClick={() => setShowChat(false)}
          className={`px-4 py-3 font-semibold text-light-1 border-b-2 transition ${
            !showChat
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-light-3 hover:text-light-1"
          }`}>
          Details
        </button>
        <button
          onClick={() => setShowChat(true)}
          className={`px-4 py-3 font-semibold text-light-1 border-b-2 transition ${
            showChat
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-light-3 hover:text-light-1"
          }`}>
          Chat
        </button>
      </div>

      {!showChat ? (
        <>
          {/* Members */}
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
            <h3 className="h3-bold mb-4">Members ({members.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-dark-3 rounded-lg p-4 flex gap-4">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-light-3 text-small-medium">
                      @{member.username}
                    </p>
                    <p className="text-light-2 text-small-regular mt-1">
                      {member.major}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
            <h3 className="h3-bold mb-4">About This Group</h3>
            <p className="text-light-2 mb-6">{group.description}</p>
            <div className="space-y-3">
              <div>
                <p className="text-light-4 text-small-medium mb-1">Course</p>
                <p className="text-light-1">
                  {group.course_id ? "CS101" : "General Study Group"}
                </p>
              </div>
              <div>
                <p className="text-light-4 text-small-medium mb-1">
                  Meeting Location
                </p>
                <p className="text-light-1">{group.location}</p>
              </div>
              <div>
                <p className="text-light-4 text-small-medium mb-1">
                  Regular Meeting Time
                </p>
                <p className="text-light-1">
                  {group.meeting_time
                    ? new Date(group.meeting_time).toLocaleString()
                    : "Not scheduled yet"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Chat Section */
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              <div className="bg-dark-3 rounded-lg p-3 max-w-xs">
                <p className="text-light-4 text-small-medium mb-1">
                  Alice Johnson
                </p>
                <p className="text-light-1">
                  Anyone want to meet up this weekend?
                </p>
              </div>
              <div className="bg-primary-500/20 rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-light-4 text-small-medium mb-1 text-right">
                  You
                </p>
                <p className="text-light-1">
                  Sure! What time works for everyone?
                </p>
              </div>
              <div className="bg-dark-3 rounded-lg p-3 max-w-xs">
                <p className="text-light-4 text-small-medium mb-1">Bob Smith</p>
                <p className="text-light-1">
                  Saturday morning at 10am at the library?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="shad-input flex-1"
              />
              <button className="shad-button_primary px-6">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDetail;
