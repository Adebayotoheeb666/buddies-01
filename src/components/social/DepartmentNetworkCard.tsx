import { DepartmentNetwork } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import {
  joinDepartmentNetwork,
  leaveDepartmentNetwork,
  isUserInDepartmentNetwork,
} from "@/lib/supabase/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface DepartmentNetworkCardProps {
  network: DepartmentNetwork;
}

const DepartmentNetworkCard = ({ network }: DepartmentNetworkCardProps) => {
  const { user } = useAuthContext();
  const [isJoining, setIsJoining] = useState(false);

  const { data: isMember = false, refetch } = useQuery({
    queryKey: ["isUserInDepartmentNetwork", network.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      return await isUserInDepartmentNetwork(network.id, user.id);
    },
    enabled: !!user,
  });

  const handleJoinClick = async () => {
    if (!user) return;

    setIsJoining(true);
    try {
      if (isMember) {
        await leaveDepartmentNetwork(network.id, user.id);
      } else {
        await joinDepartmentNetwork(network.id, user.id);
      }
      refetch();
    } catch (error) {
      console.error("Error toggling network membership:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-dark-3 rounded-lg overflow-hidden border border-dark-4 hover:border-primary-500 transition-colors">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-primary-600 to-primary-700"></div>

      {/* Content */}
      <div className="p-6 relative -mt-10">
        <div className="bg-dark-2 rounded-lg p-4 mb-4">
          <h3 className="text-xl font-bold text-white mb-1">
            {network.department}
          </h3>
          <p className="text-light-3 text-sm">{network.member_count} members</p>
        </div>

        {/* Description */}
        <p className="text-light-3 text-sm mb-4 line-clamp-2">
          {network.description}
        </p>

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
            {isJoining ? "..." : isMember ? "Leave Network" : "Join Network"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DepartmentNetworkCard;
