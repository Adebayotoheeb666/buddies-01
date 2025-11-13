import { OrganizationEvent, EventRSVP } from "@/types/social.types";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { rsvpEvent, getUserEventRSVP } from "@/lib/supabase/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface EventCardProps {
  event: OrganizationEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuthContext();
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);
  const [isRSVPing, setIsRSVPing] = useState(false);

  const { data: userRSVP } = useQuery({
    queryKey: ["userEventRSVP", event.id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserEventRSVP(event.id, user.id);
    },
    enabled: !!user,
  });

  const currentStatus = userRSVP?.status || rsvpStatus;

  const handleRSVP = async (status: string) => {
    if (!user) return;

    setIsRSVPing(true);
    try {
      await rsvpEvent(event.id, user.id, status);
      setRsvpStatus(status);
    } catch (error) {
      console.error("Error RSVP:", error);
    } finally {
      setIsRSVPing(false);
    }
  };

  const eventDate = new Date(event.event_date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="bg-dark-4 rounded-lg p-4 border border-dark-3 hover:border-primary-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white mb-1">{event.title}</h4>
          <p className="text-sm text-light-3 capitalize">{event.event_type}</p>
        </div>
        {isUpcoming && (
          <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
            Upcoming
          </span>
        )}
      </div>

      {/* Event Details */}
      <div className="space-y-2 text-sm text-light-3 mb-4">
        <div>
          <span className="font-semibold text-white">Date & Time:</span>{" "}
          {format(eventDate, "MMM d, yyyy h:mm a")}
        </div>
        {event.location_name && (
          <div>
            <span className="font-semibold text-white">Location:</span> {event.location_name}
          </div>
        )}
        <div>
          <span className="font-semibold text-white">Capacity:</span> {event.rsvp_count}/{event.capacity}
        </div>
      </div>

      {event.description && (
        <p className="text-sm text-light-3 mb-4 line-clamp-2">{event.description}</p>
      )}

      {/* RSVP Buttons */}
      {user && (
        <div className="flex gap-2">
          <Button
            onClick={() => handleRSVP("going")}
            disabled={isRSVPing}
            className={`flex-1 text-sm py-1 ${
              currentStatus === "going"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-dark-3 text-light-3 hover:bg-dark-2"
            }`}
          >
            Going
          </Button>
          <Button
            onClick={() => handleRSVP("interested")}
            disabled={isRSVPing}
            className={`flex-1 text-sm py-1 ${
              currentStatus === "interested"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-dark-3 text-light-3 hover:bg-dark-2"
            }`}
          >
            Interested
          </Button>
          <Button
            onClick={() => handleRSVP("not_going")}
            disabled={isRSVPing}
            className={`flex-1 text-sm py-1 ${
              currentStatus === "not_going"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-dark-3 text-light-3 hover:bg-dark-2"
            }`}
          >
            Not Going
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
