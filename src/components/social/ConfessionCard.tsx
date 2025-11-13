import { AnonymousConfession } from "@/types/social.types";

interface ConfessionCardProps {
  confession: AnonymousConfession;
}

const ConfessionCard = ({ confession }: ConfessionCardProps) => {
  const anonymityBadge = confession.anonymity_status === "fully_anonymous"
    ? "Fully Anonymous"
    : "Visible to Friends";

  return (
    <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 hover:border-primary-500 transition-colors">
      {/* Anonymity Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          confession.anonymity_status === "fully_anonymous"
            ? "bg-purple-900 text-purple-200"
            : "bg-blue-900 text-blue-200"
        }`}>
          🔒 {anonymityBadge}
        </span>
        <span className="text-xs text-light-3">
          {new Date(confession.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <p className="text-light-1 text-base leading-relaxed mb-3">
        {confession.content}
      </p>

      {/* Moderation Status */}
      <div className="border-t border-dark-4 pt-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          confession.moderation_status === "approved"
            ? "bg-green-900 text-green-200"
            : confession.moderation_status === "rejected"
            ? "bg-red-900 text-red-200"
            : "bg-yellow-900 text-yellow-200"
        }`}>
          {confession.moderation_status === "approved" && "✓ Approved"}
          {confession.moderation_status === "rejected" && "✗ Rejected"}
          {confession.moderation_status === "pending" && "⏳ Pending Review"}
        </span>
      </div>
    </div>
  );
};

export default ConfessionCard;
