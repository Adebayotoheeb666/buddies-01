import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { mockCampusLocations } from "@/lib/mockData/phase3MockData";

const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();

  const location = mockCampusLocations.find((loc) => loc.id === locationId);

  if (!location) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-3 mb-4">Location not found</p>
          <Button onClick={() => navigate('/campus')}>
            Back to Campus Map
          </Button>
        </div>
      </div>
    );
  }

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

  const formatHours = (hours: any) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map((day) => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      return {
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: `${dayHours.opens} - ${dayHours.closes}`,
      };
    }).filter(Boolean);
  };

  const isOpenNow = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);

    if (!location.hours[day]) return false;

    const { opens, closes } = location.hours[day];
    return currentTime >= opens && currentTime <= closes;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/campus')}
          className="mb-6 bg-dark-4 hover:bg-dark-3"
        >
          <img src="/assets/icons/back.svg" width={20} height={20} alt="back" className="mr-2" />
          Back to Campus Map
        </Button>

        {/* Header */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getTypeIcon(location.location_type)}</span>
              <div>
                <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
                <p className="text-light-3 capitalize">{location.location_type}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isOpenNow() ? (
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
                  Open Now
                </span>
              ) : (
                <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold">
                  Closed
                </span>
              )}
            </div>
          </div>

          <p className="text-light-2 text-lg">{location.description}</p>
        </div>

        {/* Map Placeholder */}
        <div className="bg-dark-4 rounded-lg p-8 mb-6 flex items-center justify-center min-h-[250px] border border-dark-3">
          <div className="text-center">
            <div className="text-5xl mb-3">📍</div>
            <p className="text-light-3 font-semibold mb-1">Location on Map</p>
            <p className="text-sm text-light-4">
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Address & Contact */}
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
            <h2 className="text-xl font-bold mb-4">📍 Address & Contact</h2>
            <div className="space-y-3">
              <div>
                <p className="text-light-4 text-sm mb-1">Address</p>
                <p className="text-light-1">{location.address}</p>
              </div>
              {location.contact_info.phone && (
                <div>
                  <p className="text-light-4 text-sm mb-1">Phone</p>
                  <p className="text-light-1">{location.contact_info.phone}</p>
                </div>
              )}
              {location.contact_info.email && (
                <div>
                  <p className="text-light-4 text-sm mb-1">Email</p>
                  <p className="text-primary-500">{location.contact_info.email}</p>
                </div>
              )}
              {location.contact_info.website && (
                <div>
                  <p className="text-light-4 text-sm mb-1">Website</p>
                  <a
                    href={location.contact_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    {location.contact_info.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
            <h2 className="text-xl font-bold mb-4">🕒 Hours of Operation</h2>
            <div className="space-y-2">
              {formatHours(location.hours).map((item: any, index: number) => {
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = item.day === today;
                return (
                  <div
                    key={index}
                    className={`flex justify-between py-2 px-3 rounded ${
                      isToday ? 'bg-primary-500/20 text-primary-500 font-semibold' : ''
                    }`}
                  >
                    <span>{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate(`/campus/directions?to=${location.id}`)}
            className="bg-primary-500 hover:bg-primary-600 text-white h-auto py-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🗺️</div>
              <div className="font-semibold">Get Directions</div>
            </div>
          </Button>
          <Button
            onClick={() => {}}
            className="bg-dark-4 hover:bg-dark-3 h-auto py-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-semibold">Save to Favorites</div>
            </div>
          </Button>
          <Button
            onClick={() => {}}
            className="bg-dark-4 hover:bg-dark-3 h-auto py-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">📤</div>
              <div className="font-semibold">Share Location</div>
            </div>
          </Button>
        </div>

        {/* Additional Info */}
        {location.location_type === 'library' && (
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mt-6">
            <h2 className="text-xl font-bold mb-4">📚 Library Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/library')}
                className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4"
              >
                <div>
                  <div className="font-semibold mb-1">Search Catalog</div>
                  <div className="text-sm text-light-3">Find books and resources</div>
                </div>
              </Button>
              <Button
                onClick={() => navigate('/library/study-rooms')}
                className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4"
              >
                <div>
                  <div className="font-semibold mb-1">Book Study Room</div>
                  <div className="text-sm text-light-3">Reserve a study space</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {location.location_type === 'building' && (
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mt-6">
            <h2 className="text-xl font-bold mb-4">🏫 Building Services</h2>
            <Button
              onClick={() => navigate('/campus/classrooms')}
              className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4 w-full"
            >
              <div>
                <div className="font-semibold mb-1">Find Classrooms</div>
                <div className="text-sm text-light-3">Search classrooms in this building</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;
