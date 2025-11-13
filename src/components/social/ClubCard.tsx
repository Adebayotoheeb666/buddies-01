import { Link } from "react-router-dom";
import { StudentOrganization } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useCallback, useState } from "react";
import { joinOrganization, leaveOrganization, isUserInOrganization } from "@/lib/supabase/api";
import { useQuery } from "@tanstack/react-query";

interface ClubCardProps {
  organization: StudentOrganization;
}

const ClubCard = ({ organization }: ClubCardProps) => {
  const { user } = useAuthContext();
  const [isJoining, setIsJoining] = useState(false);

  const { data: isMember = false, refetch } = useQuery({
    queryKey: ["isMember", organization.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      return await isUserInOrganization(organization.id, user.id);
    },
    enabled: !!user,
  });

  const handleJoinClick = useCallback(async () => {
    if (!user) return;
    
    setIsJoining(true);
    try {
      if (isMember) {
        await leaveOrganization(organization.id, user.id);
      } else {
        await joinOrganization(organization.id, user.id);
      }
      refetch();
    } catch (error) {
      console.error("Error toggling membership:", error);
    } finally {
      setIsJoining(false);
    }
  }, [organization.id, user, isMember, refetch]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      academic: "bg-blue-900 text-blue-200",
      cultural: "bg-purple-900 text-purple-200",
      sports: "bg-green-900 text-green-200",
      greek: "bg-red-900 text-red-200",
      service: "bg-yellow-900 text-yellow-200",
      other: "bg-gray-700 text-gray-200",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="bg-dark-3 rounded-lg overflow-hidden border border-dark-4 hover:border-primary-500 transition-colors">
      {/* Club Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{organization.name}</h3>
            <p className="text-sm text-light-3">{organization.acronym}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getCategoryColor(organization.category)}`}>
            {organization.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-light-3 text-sm mb-4 line-clamp-3">
          {organization.description}
        </p>

        {/* Club Info */}
        <div className="space-y-2 mb-4 text-sm text-light-3">
          {organization.email && (
            <p>
              <span className="font-semibold text-white">Email:</span> {organization.email}
            </p>
          )}
          {organization.meeting_schedule && (
            <p>
              <span className="font-semibold text-white">Meetings:</span> {organization.meeting_schedule}
            </p>
          )}
          <p>
            <span className="font-semibold text-white">Members:</span> {organization.total_members}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/clubs/${organization.id}`} className="flex-1">
            <Button className="w-full bg-dark-4 text-white hover:bg-dark-2">
              View Details
            </Button>
          </Link>
          <Button
            onClick={handleJoinClick}
            disabled={isJoining}
            className={`flex-1 ${
              isMember
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }`}
          >
            {isJoining ? "..." : isMember ? "Leave" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
