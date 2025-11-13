import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMemeBoard } from "@/lib/supabase/api";
import { MemePost } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import MemeCard from "@/components/social/MemeCard";
import CreateMemeModal from "@/components/modals/CreateMemeModal";
import { useAuthContext } from "@/context/AuthContext";

const MemeBoard = () => {
  const { user } = useAuthContext();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["memeBoard"],
    queryFn: getMemeBoard,
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campus Meme Board</h1>
            <p className="text-light-3">
              Share and enjoy campus humor
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Share Meme
            </Button>
          )}
        </div>

        {/* Memes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : memes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-light-3 mb-4">
              No memes yet. Be the first to share one!
            </p>
            {user && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Share First Meme
              </Button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateMemeModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default MemeBoard;
