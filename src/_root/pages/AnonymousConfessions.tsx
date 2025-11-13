import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConfessions } from "@/lib/supabase/api";
import { AnonymousConfession } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import ConfessionCard from "@/components/social/ConfessionCard";
import CreateConfessionModal from "@/components/modals/CreateConfessionModal";
import { useAuthContext } from "@/context/AuthContext";

const AnonymousConfessions = () => {
  const { user } = useAuthContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: confessions = [], isLoading } = useQuery({
    queryKey: ["confessions"],
    queryFn: getConfessions,
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Anonymous Confessions</h1>
            <p className="text-light-3">
              Share your thoughts anonymously (moderated for safety)
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Share Confession
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-200">
            💡 All confessions are moderated before appearing here. Be respectful and constructive.
          </p>
        </div>

        {/* Confessions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : confessions.length > 0 ? (
          <div className="space-y-4 max-w-2xl">
            {confessions.map((confession) => (
              <ConfessionCard key={confession.id} confession={confession} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-light-3 mb-4">
              No confessions yet. Be the first to share!
            </p>
            {user && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Share First Confession
              </Button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateConfessionModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AnonymousConfessions;
