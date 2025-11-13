import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  mockClassrooms,
  mockCampusLocations,
} from "@/lib/mockData/phase3MockData";

const ClassroomFinder = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const buildings = Array.from(
    new Set(mockClassrooms.map((c) => c.building_name))
  );

  const filteredClassrooms = mockClassrooms.filter((classroom) => {
    const matchesSearch =
      classroom.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.building_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding =
      !selectedBuilding || classroom.building_name === selectedBuilding;
    return matchesSearch && matchesBuilding;
  });

  const getLocationForBuilding = (buildingName: string) => {
    return mockCampusLocations.find((loc) => loc.name === buildingName);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/campus")}
            className="mb-4 bg-dark-4 hover:bg-dark-3">
            <img
              src="/assets/icons/back.svg"
              width={20}
              height={20}
              alt="back"
              className="mr-2"
            />
            Back to Campus Map
          </Button>
          <h1 className="text-3xl font-bold mb-2">Classroom Finder</h1>
          <p className="text-light-3">
            Search for classrooms by building or room number
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by room number or building..."
            className="w-full px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Building Filter */}
        <div className="mb-8">
          <p className="text-sm text-light-3 mb-3">Filter by Building</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedBuilding(null)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedBuilding === null
                  ? "bg-primary-500 text-white"
                  : "bg-dark-4 text-light-3 hover:bg-dark-3"
              }`}>
              All Buildings
            </Button>
            {buildings.map((building) => (
              <Button
                key={building}
                onClick={() => setSelectedBuilding(building)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedBuilding === building
                    ? "bg-primary-500 text-white"
                    : "bg-dark-4 text-light-3 hover:bg-dark-3"
                }`}>
                {building}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-light-3">
            Found {filteredClassrooms.length} classroom
            {filteredClassrooms.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClassrooms.map((classroom) => {
            const location = getLocationForBuilding(classroom.building_name);
            return (
              <div
                key={classroom.id}
                className="bg-dark-3 rounded-lg p-5 border border-dark-4 hover:border-primary-500 transition-colors">
                {/* Classroom Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1">
                    {classroom.room_number}
                  </h3>
                  <p className="text-light-3">{classroom.building_name}</p>
                </div>

                {/* Capacity */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-light-2">
                    <span>👥</span>
                    <span>Capacity: {classroom.capacity} people</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm text-light-4 mb-2">
                    Available Amenities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {classroom.has_projector && (
                      <span className="bg-primary-500/20 text-primary-500 px-2 py-1 rounded text-xs">
                        📽️ Projector
                      </span>
                    )}
                    {classroom.has_whiteboard && (
                      <span className="bg-primary-500/20 text-primary-500 px-2 py-1 rounded text-xs">
                        📝 Whiteboard
                      </span>
                    )}
                    {classroom.has_computers && (
                      <span className="bg-primary-500/20 text-primary-500 px-2 py-1 rounded text-xs">
                        💻 Computers
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {location && (
                    <>
                      <Button
                        onClick={() =>
                          navigate(`/campus/locations/${location.id}`)
                        }
                        className="w-full bg-primary-500/20 text-primary-500 hover:bg-primary-500/30 text-sm py-2">
                        View Building Info
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(`/campus/directions?to=${location.id}`)
                        }
                        className="w-full bg-dark-4 hover:bg-dark-2 text-sm py-2">
                        Get Directions
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-light-3 mb-2">No classrooms found</p>
            <p className="text-light-4 text-sm">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mt-8">
          <h2 className="text-xl font-bold mb-4">
            💡 Tips for Finding Classrooms
          </h2>
          <ul className="space-y-2 text-light-3">
            <li className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              <span>
                Room numbers usually indicate the floor (e.g., ENG 201 is on the
                2nd floor)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              <span>
                Use building abbreviations for faster search (e.g., "ENG" for
                Engineering)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              <span>
                Check amenities to ensure the room has the equipment you need
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              <span>Get directions to arrive on time for your class</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassroomFinder;
