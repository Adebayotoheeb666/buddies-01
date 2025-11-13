import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  mockCampusLocations,
  mockBuildingRoutes,
} from "@/lib/mockData/phase3MockData";

const NavigationDirections = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toLocationId = searchParams.get("to");

  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>(toLocationId || "");
  const [showDirections, setShowDirections] = useState(false);

  const handleGetDirections = () => {
    if (fromLocation && toLocation) {
      setShowDirections(true);
    }
  };

  const route = mockBuildingRoutes.find(
    (r) => r.from_location_id === fromLocation && r.to_location_id === toLocation
  );

  const fromLoc = mockCampusLocations.find((loc) => loc.id === fromLocation);
  const toLoc = mockCampusLocations.find((loc) => loc.id === toLocation);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/campus')}
            className="mb-4 bg-dark-4 hover:bg-dark-3"
          >
            <img src="/assets/icons/back.svg" width={20} height={20} alt="back" className="mr-2" />
            Back to Campus Map
          </Button>
          <h1 className="text-3xl font-bold mb-2">Get Directions</h1>
          <p className="text-light-3">
            Find the best route between campus locations
          </p>
        </div>

        {/* Direction Form */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mb-6">
          <div className="space-y-4">
            {/* From Location */}
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 text-light-1"
              >
                <option value="">Select starting location</option>
                {mockCampusLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const temp = fromLocation;
                  setFromLocation(toLocation);
                  setToLocation(temp);
                }}
                className="bg-dark-4 hover:bg-dark-2 rounded-full w-10 h-10 p-0"
                disabled={!fromLocation || !toLocation}
              >
                ⇅
              </Button>
            </div>

            {/* To Location */}
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <select
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500 text-light-1"
              >
                <option value="">Select destination</option>
                {mockCampusLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Get Directions Button */}
            <Button
              onClick={handleGetDirections}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3"
              disabled={!fromLocation || !toLocation}
            >
              Get Directions
            </Button>
          </div>
        </div>

        {/* Directions Display */}
        {showDirections && fromLoc && toLoc && (
          <div className="space-y-6">
            {/* Route Overview */}
            <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
              <h2 className="text-xl font-bold mb-4">Route Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-4 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🚶</div>
                  <div className="text-2xl font-bold text-primary-500">
                    {route ? route.walking_time_minutes : '5'} min
                  </div>
                  <div className="text-sm text-light-4">Walking Time</div>
                </div>
                <div className="bg-dark-4 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📏</div>
                  <div className="text-2xl font-bold text-primary-500">
                    {route ? route.distance_meters : '300'}m
                  </div>
                  <div className="text-sm text-light-4">Distance</div>
                </div>
                <div className="bg-dark-4 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-primary-500">
                    Direct
                  </div>
                  <div className="text-sm text-light-4">Route Type</div>
                </div>
              </div>

              {/* Route Visualization */}
              <div className="bg-dark-4 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-light-3">Route Map</p>
                  <p className="text-sm text-light-4 mt-2">
                    Visual route display would appear here
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Directions */}
            <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
              <h2 className="text-xl font-bold mb-4">Step-by-Step Directions</h2>
              <div className="space-y-4">
                {/* Start */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="w-0.5 h-full bg-dark-4 my-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold mb-1">Start at {fromLoc.name}</p>
                    <p className="text-sm text-light-3">{fromLoc.address}</p>
                  </div>
                </div>

                {/* Route Description */}
                {route && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                        🚶
                      </div>
                      <div className="w-0.5 h-full bg-dark-4 my-2"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold mb-1">Walk {route.distance_meters}m</p>
                      <p className="text-sm text-light-3">{route.route_description}</p>
                    </div>
                  </div>
                )}

                {/* Destination */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      B
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Arrive at {toLoc.name}</p>
                    <p className="text-sm text-light-3">{toLoc.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {}}
                className="bg-dark-4 hover:bg-dark-3 h-auto py-4"
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📤</div>
                  <div className="font-semibold">Share Route</div>
                </div>
              </Button>
              <Button
                onClick={() => {}}
                className="bg-dark-4 hover:bg-dark-3 h-auto py-4"
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="font-semibold">Save Route</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* No Route Available */}
        {showDirections && !route && fromLocation !== toLocation && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-yellow-200 mb-2">Direct route not available</p>
            <p className="text-sm text-yellow-300">
              We don't have a direct route between these locations yet, but you can still navigate using the campus map.
            </p>
          </div>
        )}

        {/* Same Location */}
        {showDirections && fromLocation === toLocation && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📍</div>
            <p className="text-blue-200">You're already at this location!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationDirections;
