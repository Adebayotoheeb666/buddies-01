import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFacilities,
  getFacilityEquipment,
  getFacilityReviews,
  bookFacility,
  getUserFacilityBookings,
  cancelFacilityBooking,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FacilitiesBooking = () => {
  const { user } = useAuthContext();
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [activeTab, setActiveTab] = useState<"browse" | "mybookings">("browse");

  const { data: facilities, isLoading: facilitiesLoading } = useQuery({
    queryKey: ["facilities", selectedType],
    queryFn: () => getFacilities({ facilityType: selectedType || undefined }),
  });

  const { data: equipment } = useQuery({
    queryKey: ["facility-equipment", selectedFacility],
    queryFn: () => getFacilityEquipment(selectedFacility!),
    enabled: !!selectedFacility,
  });

  const { data: reviews } = useQuery({
    queryKey: ["facility-reviews", selectedFacility],
    queryFn: () => getFacilityReviews(selectedFacility!),
    enabled: !!selectedFacility,
  });

  const { data: userBookings } = useQuery({
    queryKey: ["user-facility-bookings", user?.id],
    queryFn: () => getUserFacilityBookings(user?.id!),
    enabled: !!user?.id,
  });

  const bookingMutation = useMutation({
    mutationFn: () =>
      bookFacility(
        user?.id!,
        selectedFacility!,
        bookingDate,
        startTime,
        endTime,
        numberOfPeople,
        purpose
      ),
    onSuccess: () => {
      alert("Booking submitted! It will be reviewed shortly.");
      setPurpose("");
      setNumberOfPeople(1);
    },
  });

  const facilityTypes = [
    "gym",
    "sports_court",
    "club_space",
    "meeting_room",
    "other",
  ];

  if (facilitiesLoading) return <Loader />;

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-6">
          Facilities Booking
        </h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-dark-4">
          {(["browse", "mybookings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition capitalize ${
                activeTab === tab
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-light-3 hover:text-light-1"
              }`}>
              {tab === "mybookings" ? "My Bookings" : "Browse & Book"}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <>
            {/* Filter */}
            <div className="mb-6">
              <p className="text-light-3 text-sm mb-2">
                Filter by facility type:
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedType("")}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    selectedType === ""
                      ? "bg-purple-500 text-white"
                      : "bg-dark-3 text-light-2"
                  }`}>
                  All Facilities
                </Button>
                {facilityTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-lg px-3 py-2 text-sm capitalize ${
                      selectedType === type
                        ? "bg-purple-500 text-white"
                        : "bg-dark-3 text-light-2"
                    }`}>
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {facilities?.map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => setSelectedFacility(facility.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedFacility === facility.id
                      ? "bg-dark-2 border-purple-500"
                      : "bg-dark-3 border-dark-4 hover:border-purple-500"
                  }`}>
                  <h3 className="h4-bold text-light-1 mb-2">{facility.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-light-3">
                      Capacity: {facility.capacity}
                    </p>
                    {facility.hourly_rate && (
                      <p className="text-light-3">
                        Rate: ${facility.hourly_rate}/hour
                      </p>
                    )}
                    {facility.description && (
                      <p className="text-light-4">{facility.description}</p>
                    )}
                    {facility.amenities && facility.amenities.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {facility.amenities.slice(0, 3).map((amenity: string) => (
                          <span
                            key={amenity}
                            className="text-xs bg-dark-4 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Facility Details */}
            {selectedFacility && (
              <>
                {/* Equipment */}
                {equipment && equipment.length > 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <h3 className="h4-bold text-light-1 mb-3">
                      Available Equipment
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {equipment.map((item) => (
                        <div key={item.id} className="p-2 rounded bg-dark-4">
                          <p className="text-light-2 text-sm font-semibold">
                            {item.equipment_name}
                          </p>
                          <p className="text-light-4 text-xs">
                            Qty: {item.quantity} · {item.condition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500">
                  <h3 className="h4-bold text-light-1 mb-4">
                    Book This Facility
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-light-2 text-sm font-semibold block mb-2">
                          Date
                        </label>
                        <Input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-light-2 text-sm font-semibold block mb-2">
                          Number of People
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={numberOfPeople}
                          onChange={(e) =>
                            setNumberOfPeople(parseInt(e.target.value))
                          }
                          className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-light-2 text-sm font-semibold block mb-2">
                          Start Time
                        </label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-light-2 text-sm font-semibold block mb-2">
                          End Time
                        </label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-light-2 text-sm font-semibold block mb-2">
                        Purpose (optional)
                      </label>
                      <textarea
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="What will you be using this facility for?"
                        className="w-full p-3 rounded-lg bg-dark-3 border border-dark-4 text-white text-sm"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={() => bookingMutation.mutate()}
                      disabled={bookingMutation.isLoading}
                      className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold">
                      {bookingMutation.isLoading
                        ? "Submitting..."
                        : "Submit Booking Request"}
                    </Button>
                  </div>
                </div>

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                  <div className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <h3 className="h4-bold text-light-1 mb-4">Reviews</h3>
                    <div className="space-y-3">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="p-3 bg-dark-4 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span>
                              {Array.from({ length: review.rating })
                                .map(() => "⭐")
                                .join("")}
                            </span>
                            <span className="text-light-4 text-xs">
                              {review.rating}/5
                            </span>
                          </div>
                          {review.review_text && (
                            <p className="text-light-2 text-sm">
                              {review.review_text}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === "mybookings" && (
          <div>
            <h3 className="h4-bold text-light-1 mb-4">Your Bookings</h3>
            {userBookings && userBookings.length > 0 ? (
              <div className="space-y-3">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-light-1">
                          Facility ID: {booking.facility_id}
                        </p>
                        <p className="text-light-3 text-sm mt-1">
                          {booking.booking_date} · {booking.start_time} -{" "}
                          {booking.end_time}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-400"
                            : booking.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-light-3">
                        People: {booking.number_of_people}
                      </p>
                      {booking.purpose && (
                        <p className="text-light-3">
                          Purpose: {booking.purpose}
                        </p>
                      )}
                    </div>
                    {booking.status === "pending" && (
                      <Button className="bg-dark-4 text-light-2 px-3 py-1 text-xs rounded mt-3">
                        Cancel
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">
                  No bookings yet. Start by browsing facilities!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesBooking;
