import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCampusLocations, searchCampusLocations, getAllRoutes } from "@/lib/supabase/api";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CampusMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<string>("");

  const { data: allLocations, isLoading: locationsLoading } = useQuery({
    queryKey: ["campus-locations"],
    queryFn: getCampusLocations,
  });

  const { data: searchResults } = useQuery({
    queryKey: ["search-locations", searchTerm],
    queryFn: () => searchCampusLocations(searchTerm),
    enabled: searchTerm.length > 0,
  });

  const { data: routes } = useQuery({
    queryKey: ["campus-routes"],
    queryFn: getAllRoutes,
  });

  const locations = searchTerm ? searchResults : allLocations;

  const filteredLocations = selectedLocationType
    ? locations?.filter((loc) => loc.location_type === selectedLocationType)
    : locations;

  const locationTypes = [
    "building",
    "classroom",
    "cafe",
    "library",
    "gym",
    "other",
  ];

  if (locationsLoading) return <Loader />;

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-4">Campus Map & Navigation</h2>

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search campus locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg bg-dark-3 border border-dark-4 text-white"
          />

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedLocationType("")}
              className={`rounded-lg px-3 py-2 text-sm ${
                selectedLocationType === ""
                  ? "bg-purple-500 text-white"
                  : "bg-dark-3 text-light-2"
              }`}
            >
              All Locations
            </Button>
            {locationTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedLocationType(type)}
                className={`rounded-lg px-3 py-2 text-sm capitalize ${
                  selectedLocationType === type
                    ? "bg-purple-500 text-white"
                    : "bg-dark-3 text-light-2"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Locations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLocations?.map((location) => (
            <div
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                selectedLocation === location.id
                  ? "bg-dark-2 border-purple-500"
                  : "bg-dark-3 border-dark-4 hover:border-purple-500"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="h4-bold text-light-1">{location.name}</h3>
                <span className="text-xs bg-purple-500 px-2 py-1 rounded capitalize">
                  {location.location_type}
                </span>
              </div>
              {location.description && (
                <p className="text-light-3 text-sm mb-2">{location.description}</p>
              )}
              {location.address && (
                <p className="text-light-4 text-xs mb-2">📍 {location.address}</p>
              )}
              {location.contact_info && (
                <div className="text-light-4 text-xs space-y-1">
                  {location.contact_info.phone && (
                    <p>☎️ {location.contact_info.phone}</p>
                  )}
                  {location.contact_info.email && (
                    <p>✉️ {location.contact_info.email}</p>
                  )}
                </div>
              )}

              {/* Hours */}
              {location.hours_json && (
                <div className="mt-3 pt-3 border-t border-dark-4">
                  <p className="text-light-2 text-xs font-semibold mb-1">Hours</p>
                  <div className="text-light-4 text-xs space-y-1">
                    {Object.entries(location.hours_json).map(([day, hours]: [string, any]) => (
                      <p key={day}>
                        {day}: {hours.opens} - {hours.closes}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLocations?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-light-3">No locations found</p>
          </div>
        )}

        {/* Routes Information */}
        {selectedLocation && routes && routes.length > 0 && (
          <div className="mt-8 p-4 rounded-lg bg-dark-3 border border-dark-4">
            <h3 className="h4-bold text-light-1 mb-4">
              Routes from {filteredLocations?.find((l) => l.id === selectedLocation)?.name}
            </h3>
            <div className="space-y-2">
              {routes
                .filter((route) => route.from_location_id === selectedLocation)
                .map((route) => (
                  <div key={route.id} className="p-3 bg-dark-4 rounded">
                    <p className="text-light-2 text-sm font-semibold">
                      {route.distance_meters}m · {route.walking_time_minutes} min walk
                    </p>
                    {route.route_description && (
                      <p className="text-light-3 text-sm mt-1">{route.route_description}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusMap;
