import { InterestGroup } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { joinInterestGroup, leaveInterestGroup, isUserInInterestGroup } from "@/lib/supabase/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface InterestGroupCardProps {
  group: InterestGroup;
}

const InterestGroupCard = ({ group }: InterestGroupCardProps) => {
  const { user } = useAuthContext();
  const [isJoining, setIsJoining] = useState(false);

  const { data: isMember = false, refetch } = useQuery({
    queryKey: ["isUserInInterestGroup", group.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      return await isUserInInterestGroup(group.id, user.id);
    },
    enabled: !!user,
  });

  const handleJoinClick = async () => {
    if (!user) return;

    setIsJoining(true);
    try {
      if (isMember) {
        await leaveInterestGroup(group.id, user.id);
      } else {
        await joinInterestGroup(group.id, user.id);
      }
      refetch();
    } catch (error) {
      console.error("Error toggling group membership:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-dark-3 rounded-lg overflow-hidden border border-dark-4 hover:border-primary-500 transition-colors">
      <div className="p-6">
        {/* Group Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
          {group.is_private && (
            <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
              Private
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-light-3 text-sm mb-4 line-clamp-3">
          {group.description}
        </p>

        {/* Interests Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {group.interests?.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-xs bg-primary-900 text-primary-200 px-2 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
          {group.interests && group.interests.length > 3 && (
            <span className="text-xs bg-dark-4 text-light-3 px-2 py-1 rounded-full">
              +{group.interests.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="text-sm text-light-3 mb-4">
          <p>{group.member_count} members</p>
        </div>

        {/* Join Button */}
        {user && (
          <Button
            onClick={handleJoinClick}
            disabled={isJoining}
            className={`w-full ${
              isMember
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }`}
          >
            {isJoining ? "..." : isMember ? "Leave Group" : "Join Group"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterestGroupCard;
