import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInterestGroups } from "@/lib/supabase/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import InterestGroupCard from "@/components/social/InterestGroupCard";
import CreateInterestGroupModal from "@/components/modals/CreateInterestGroupModal";
import { useAuthContext } from "@/context/AuthContext";

const InterestGroups = () => {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["interestGroups"],
    queryFn: getInterestGroups,
  });

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.interests?.some((interest: any) =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Interest Groups</h1>
            <p className="text-light-3">
              Connect with students who share your interests
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Create Group
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search groups by name or interest..."
            className="w-full px-4 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <InterestGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-light-3 mb-4">
              No interest groups found. Try adjusting your search.
            </p>
            {user && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Create the First Group
              </Button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateInterestGroupModal
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InterestGroups;
