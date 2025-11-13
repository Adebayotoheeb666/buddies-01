import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { mockCampusLocations } from "@/lib/mockData/phase3MockData";

const CampusMap = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const locationTypes = [
    'building',
    'library',
    'dining',
    'cafe',
    'gym',
    'parking',
  ];

  const filteredLocations = mockCampusLocations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || location.location_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'library':
        return '📚';
      case 'building':
        return '🏛️';
      case 'dining':
        return '🍽️';
      case 'cafe':
        return '☕';
      case 'gym':
        return '💪';
      case 'parking':
        return '🅿️';
      default:
        return '📍';
    }
  };

  const isOpenNow = (hours: any) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);

    if (!hours[day]) return false;

    const { opens, closes } = hours[day];
    return currentTime >= opens && currentTime <= closes;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campus Map & Navigation</h1>
          <p className="text-light-3">
            Find buildings, classrooms, and navigate around campus
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={() => navigate('/campus/classrooms')}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4"
          >
            <div>
              <div className="text-lg font-semibold mb-1">🏫 Find Classroom</div>
              <div className="text-sm text-light-3">Search by building or room number</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/campus/directions')}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4"
          >
            <div>
              <div className="text-lg font-semibold mb-1">🗺️ Get Directions</div>
              <div className="text-sm text-light-3">Navigate between locations</div>
            </div>
          </Button>
          <Button
            onClick={() => {}}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4"
          >
            <div>
              <div className="text-lg font-semibold mb-1">⭐ Saved Places</div>
              <div className="text-sm text-light-3">Your favorite locations</div>
            </div>
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="bg-dark-4 rounded-lg p-8 mb-6 flex items-center justify-center min-h-[300px] border border-dark-3">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-light-3">Interactive Campus Map</p>
            <p className="text-sm text-light-4 mt-2">
              Click on locations below to view details and get directions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search locations..."
            className="w-full px-4 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Location Type Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full transition-colors capitalize ${
              selectedType === null
                ? "bg-primary-500 text-white"
                : "bg-dark-4 text-light-3 hover:bg-dark-3"
            }`}
          >
            All
          </Button>
          {locationTypes.map((type) => (
            <Button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full transition-colors capitalize ${
                selectedType === type
                  ? "bg-primary-500 text-white"
                  : "bg-dark-4 text-light-3 hover:bg-dark-3"
              }`}
            >
              {getTypeIcon(type)} {type}
            </Button>
          ))}
        </div>

        {/* Locations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => navigate(`/campus/locations/${location.id}`)}
              className="bg-dark-3 rounded-lg p-5 border border-dark-4 hover:border-primary-500 transition-colors cursor-pointer"
            >
              {/* Location Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(location.location_type)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{location.name}</h3>
                    <p className="text-sm text-light-4 capitalize">{location.location_type}</p>
                  </div>
                </div>
                {isOpenNow(location.hours) && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Open
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-light-3 mb-3 line-clamp-2">
                {location.description}
              </p>

              {/* Address */}
              <p className="text-xs text-light-4 mb-3">
                📍 {location.address}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campus/locations/${location.id}`);
                  }}
                  className="flex-1 bg-primary-500/20 text-primary-500 hover:bg-primary-500/30 text-sm py-2"
                >
                  View Details
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campus/directions?to=${location.id}`);
                  }}
                  className="flex-1 bg-dark-4 hover:bg-dark-2 text-sm py-2"
                >
                  Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-light-3">No locations found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusMap;
