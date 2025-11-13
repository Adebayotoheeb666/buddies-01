import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPolls } from "@/lib/supabase/api";
import { CampusPoll } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PollCard from "@/components/social/PollCard";
import CreatePollModal from "@/components/modals/CreatePollModal";
import { useAuthContext } from "@/context/AuthContext";

const CampusPolls = () => {
  const { user } = useAuthContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: polls = [], isLoading } = useQuery({
    queryKey: ["campusPolls"],
    queryFn: getPolls,
  });

  const categories = ["campus_issue", "event_preference", "general"];

  const filteredPolls = polls.filter((poll) => {
    const matchesCategory = !selectedCategory || poll.poll_type === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campus Polls</h1>
            <p className="text-light-3">
              Vote on campus issues and help shape student life
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Create Poll
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === null
                ? "bg-primary-500 text-white"
                : "bg-dark-4 text-light-3 hover:bg-dark-3"
            }`}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-dark-4 text-light-3 hover:bg-dark-3"
              }`}
            >
              {category.replace("_", " ")}
            </Button>
          ))}
        </div>

        {/* Polls List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : filteredPolls.length > 0 ? (
          <div className="space-y-4 max-w-2xl">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-light-3 mb-4">
              No polls found. Be the first to create one!
            </p>
            {user && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Create Poll
              </Button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreatePollModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default CampusPolls;
