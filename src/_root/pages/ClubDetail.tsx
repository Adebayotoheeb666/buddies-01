import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrganization, getOrganizationEvents } from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import EventCard from "@/components/social/EventCard";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/components/modals/CreateEventModal";
import { useState } from "react";

const ClubDetail = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  if (!organizationId) {
    return <div>Club not found</div>;
  }

  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => getOrganization(organizationId),
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["organizationEvents", organizationId],
    queryFn: () => getOrganizationEvents(organizationId),
  });

  const isPresident = organization?.president_id === user?.id;

  if (orgLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-light-3 mb-4">Club not found</p>
        <Button onClick={() => navigate("/clubs")}>Back to Directory</Button>
      </div>
    );
  }

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
    <div className="flex-1 overflow-y-auto">
      <div className="w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{organization.name}</h1>
              <p className="text-primary-200 text-lg">{organization.acronym}</p>
            </div>
            <span className={`text-sm font-semibold px-4 py-2 rounded-full capitalize ${getCategoryColor(organization.category)}`}>
              {organization.category}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Organization Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-dark-3 p-6 rounded-lg border border-dark-4">
                <h2 className="text-2xl font-bold mb-3">About</h2>
                <p className="text-light-3 leading-relaxed">
                  {organization.description}
                </p>
              </div>

              {/* Events Section */}
              <div className="bg-dark-3 p-6 rounded-lg border border-dark-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Upcoming Events</h2>
                  {isPresident && (
                    <Button
                      onClick={() => setShowCreateEvent(true)}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Create Event
                    </Button>
                  )}
                </div>

                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-light-3">No upcoming events scheduled.</p>
                )}
              </div>
            </div>

            {/* Right Column - Side Information */}
            <div>
              <div className="bg-dark-3 p-6 rounded-lg border border-dark-4 sticky top-6">
                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Contact Info</h3>
                  <div className="space-y-3 text-sm">
                    {organization.email && (
                      <div>
                        <p className="text-light-3 mb-1">Email</p>
                        <a
                          href={`mailto:${organization.email}`}
                          className="text-primary-500 hover:text-primary-400"
                        >
                          {organization.email}
                        </a>
                      </div>
                    )}
                    {organization.meeting_schedule && (
                      <div>
                        <p className="text-light-3 mb-1">Meeting Schedule</p>
                        <p className="text-white">{organization.meeting_schedule}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6 border-t border-dark-4 pt-6">
                  <h3 className="text-xl font-bold mb-3">Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-light-3">Total Members</span>
                      <span className="font-bold text-white">
                        {organization.total_members}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-3">Category</span>
                      <span className="font-bold text-white capitalize">
                        {organization.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* President Info */}
                <div className="border-t border-dark-4 pt-6">
                  <h3 className="text-lg font-bold mb-2">President</h3>
                  <p className="text-light-3 text-sm">{organization.president_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateEvent && (
          <CreateEventModal
            organizationId={organizationId}
            onClose={() => setShowCreateEvent(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ClubDetail;
