import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useGetUserCourses,
  useGetUserFollowing,
  useGetUserFollowers,
} from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

const EnhancedProfile = () => {
  const { user: currentUser } = useUserContext();
  const { data: userData, isLoading: userLoading } = useGetUserById(
    currentUser?.id
  );
  const { data: coursesData, isLoading: coursesLoading } = useGetUserCourses(
    currentUser?.id
  );
  const { data: followingData } = useGetUserFollowing(currentUser?.id);
  const { data: followersData } = useGetUserFollowers(currentUser?.id);

  const courses = coursesData?.documents || [];
  const following = followingData?.documents || [];
  const followers = followersData?.documents || [];

  if (userLoading) return <Loader />;

  const profile = userData || currentUser;

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      {/* Profile Header */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img
            src={profile?.imageUrl}
            alt={profile?.name}
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="h2-bold">{profile?.name}</h2>
                <p className="text-light-3">@{profile?.username}</p>
              </div>
              <button className="shad-button_primary">Edit Profile</button>
            </div>

            <p className="text-light-2 mb-4">{profile?.bio}</p>

            {/* Verification Badge */}
            {profile?.verification_status === "verified" && (
              <div className="flex items-center gap-2 mb-4 text-green-400">
                <img
                  src="/assets/icons/bookmark.svg"
                  width={16}
                  height={16}
                  alt="verified"
                />
                <span className="text-small-medium">University Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-dark-4">
          <div className="text-center">
            <p className="h3-bold">{courses.length}</p>
            <p className="text-light-3 text-small-medium">Courses</p>
          </div>
          <div className="text-center">
            <p className="h3-bold">{following.length}</p>
            <p className="text-light-3 text-small-medium">Following</p>
          </div>
          <div className="text-center">
            <p className="h3-bold">{followers.length}</p>
            <p className="text-light-3 text-small-medium">Followers</p>
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h3 className="h3-bold mb-4">Academic Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-small-regular">
          <div>
            <p className="text-light-4 text-tiny">Major</p>
            <p className="text-light-1 font-semibold">
              {profile?.major || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Class Year</p>
            <p className="text-light-1 font-semibold">
              {profile?.class_year || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Graduation Year</p>
            <p className="text-light-1 font-semibold">
              {profile?.graduation_year || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">University ID</p>
            <p className="text-light-1 font-semibold">
              {profile?.university_id || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Pronouns</p>
            <p className="text-light-1 font-semibold">
              {profile?.pronouns || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-light-4 text-tiny">Profile Visibility</p>
            <p className="text-light-1 font-semibold capitalize">
              {profile?.profile_visibility || "Public"}
            </p>
          </div>
        </div>
      </div>

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-small-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Courses */}
      {!coursesLoading && courses.length > 0 && (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">Enrolled Courses ({courses.length})</h3>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center p-3 bg-dark-3 rounded border border-dark-4">
                <div>
                  <p className="font-semibold">{course.course_code}</p>
                  <p className="text-light-3 text-small-medium">
                    {course.course_name}
                  </p>
                </div>
                <p className="text-light-3 text-small-medium">
                  {course.professor}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Following */}
      {following.length > 0 && (
        <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
          <h3 className="h3-bold mb-4">Following ({following.length})</h3>
          <div className="flex flex-wrap gap-3">
            {following.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 bg-dark-3 rounded-full">
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-small-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProfile;
