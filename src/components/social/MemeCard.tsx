import { MemePost } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { likeMemePost } from "@/lib/supabase/api";
import { useState } from "react";

interface MemeCardProps {
  meme: MemePost;
}

const MemeCard = ({ meme }: MemeCardProps) => {
  const { user } = useAuthContext();
  const [likes, setLikes] = useState(meme.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) return;

    setIsLiking(true);
    try {
      await likeMemePost(meme.id);
      setLikes(likes + 1);
    } catch (error) {
      console.error("Error liking meme:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-dark-3 rounded-lg overflow-hidden border border-dark-4 hover:border-primary-500 transition-colors">
      {/* Image */}
      <div className="w-full h-48 bg-dark-4 overflow-hidden">
        <img
          src={meme.image_url}
          alt="meme"
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Caption */}
        {meme.caption && (
          <p className="text-light-3 text-sm mb-3 line-clamp-2">
            {meme.caption}
          </p>
        )}

        {/* Creator Info */}
        {meme.creator && (
          <div className="flex items-center gap-2 mb-3 text-xs text-light-3">
            {meme.creator.imageUrl && (
              <img
                src={meme.creator.imageUrl}
                alt={meme.creator.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{meme.creator.name}</span>
          </div>
        )}

        {/* Like Button */}
        <Button
          onClick={handleLike}
          disabled={isLiking}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm"
        >
          👍 Like ({likes})
        </Button>
      </div>
    </div>
  );
};

export default MemeCard;
