import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getLibraryBooks,
  getUserCheckouts,
  getLibraryZones,
  getUserBookHolds,
  getStudyRooms,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LibraryServices = () => {
  const { user } = useAuthContext();
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [activeTab, setActiveTab] = useState<
    "search" | "checkouts" | "zones" | "study"
  >("search");

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ["library-books", searchTitle, searchAuthor, searchSubject],
    queryFn: () =>
      getLibraryBooks({
        title: searchTitle,
        author: searchAuthor,
        subject: searchSubject,
      }),
  });

  const { data: checkouts } = useQuery({
    queryKey: ["user-checkouts", user?.id],
    queryFn: () => getUserCheckouts(user?.id!),
    enabled: !!user?.id,
  });

  const { data: bookHolds } = useQuery({
    queryKey: ["user-book-holds", user?.id],
    queryFn: () => getUserBookHolds(user?.id!),
    enabled: !!user?.id,
  });

  const { data: zones } = useQuery({
    queryKey: ["library-zones"],
    queryFn: getLibraryZones,
  });

  const { data: studyRooms } = useQuery({
    queryKey: ["study-rooms"],
    queryFn: getStudyRooms,
  });

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-6">
          Library Services
        </h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-dark-4">
          {(["search", "checkouts", "zones", "study"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition capitalize ${
                activeTab === tab
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-light-3 hover:text-light-1"
              }`}>
              {tab === "zones"
                ? "Zones"
                : tab === "checkouts"
                ? "My Books"
                : tab === "study"
                ? "Study Rooms"
                : "Search"}
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="rounded-lg bg-dark-3 border border-dark-4 text-white"
              />
              <Input
                type="text"
                placeholder="Search by author..."
                value={searchAuthor}
                onChange={(e) => setSearchAuthor(e.target.value)}
                className="rounded-lg bg-dark-3 border border-dark-4 text-white"
              />
              <Input
                type="text"
                placeholder="Search by subject..."
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                className="rounded-lg bg-dark-3 border border-dark-4 text-white"
              />
            </div>

            {booksLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books?.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <h3 className="h4-bold text-light-1 mb-2">{book.title}</h3>
                    <div className="space-y-2 text-sm">
                      {book.author && (
                        <p className="text-light-3">Author: {book.author}</p>
                      )}
                      {book.isbn && (
                        <p className="text-light-3">ISBN: {book.isbn}</p>
                      )}
                      {book.published_year && (
                        <p className="text-light-3">
                          Published: {book.published_year}
                        </p>
                      )}
                      {book.subject && (
                        <p className="text-light-3">Subject: {book.subject}</p>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-dark-4 mt-2">
                        <p className="text-light-2">
                          Available:{" "}
                          <span className="font-bold">
                            {book.available_copies}
                          </span>{" "}
                          / {book.total_copies}
                        </p>
                        <Button
                          disabled={book.available_copies === 0}
                          className="bg-purple-500 text-white px-3 py-1 text-xs rounded">
                          {book.available_copies > 0 ? "Checkout" : "Hold"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {books?.length === 0 && !booksLoading && (
              <div className="text-center py-12">
                <p className="text-light-3">
                  No books found matching your search
                </p>
              </div>
            )}
          </div>
        )}

        {/* My Checkouts Tab */}
        {activeTab === "checkouts" && (
          <div>
            <h3 className="h4-bold text-light-1 mb-4">Current Checkouts</h3>
            {checkouts && checkouts.length > 0 ? (
              <div className="space-y-3">
                {checkouts.map((checkout) => (
                  <div
                    key={checkout.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-light-1">
                          Book ID: {checkout.book_id}
                        </p>
                        <p className="text-light-3 text-sm mt-1">
                          Checked out:{" "}
                          {new Date(
                            checkout.checkout_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-light-2 font-semibold">
                          Due:{" "}
                          {new Date(checkout.due_date).toLocaleDateString()}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            new Date(checkout.due_date) < new Date()
                              ? "text-red-500"
                              : "text-green-500"
                          }`}>
                          {new Date(checkout.due_date) < new Date()
                            ? "Overdue!"
                            : `${Math.ceil(
                                (new Date(checkout.due_date).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} days remaining`}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-dark-4 text-light-2 px-3 py-1 text-xs rounded mt-2">
                      Renew
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">You have no books checked out</p>
              </div>
            )}

            {bookHolds && bookHolds.length > 0 && (
              <div className="mt-8">
                <h3 className="h4-bold text-light-1 mb-4">Book Holds</h3>
                <div className="space-y-3">
                  {bookHolds.map((hold) => (
                    <div
                      key={hold.id}
                      className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                      <p className="font-semibold text-light-1">
                        Book ID: {hold.book_id}
                      </p>
                      <p className="text-light-3 text-sm mt-1">
                        Position in queue:{" "}
                        <span className="font-bold">
                          {hold.position_in_queue}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Library Zones Tab */}
        {activeTab === "zones" && (
          <div>
            <h3 className="h4-bold text-light-1 mb-4">Library Zones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones?.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="h4-bold text-light-1">{zone.zone_name}</h4>
                    <span className="text-xs px-2 py-1 rounded capitalize bg-purple-500">
                      {zone.noise_level}
                    </span>
                  </div>
                  {zone.equipment_available &&
                    zone.equipment_available.length > 0 && (
                      <div className="mt-3">
                        <p className="text-light-3 text-sm mb-2">Equipment:</p>
                        <div className="flex gap-2 flex-wrap">
                          {zone.equipment_available.map((equipment) => (
                            <span
                              key={equipment}
                              className="text-xs bg-dark-4 px-2 py-1 rounded">
                              {equipment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  {zone.opening_hours_json && (
                    <div className="mt-3 pt-3 border-t border-dark-4">
                      <p className="text-light-2 text-xs font-semibold">
                        Hours
                      </p>
                      <div className="text-light-4 text-xs mt-1 space-y-1">
                        {Object.entries(zone.opening_hours_json).map(
                          ([day, hours]: [string, any]) => (
                            <p key={day}>
                              {day}: {hours.opens} - {hours.closes}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Rooms Tab */}
        {activeTab === "study" && (
          <div>
            <h3 className="h4-bold text-light-1 mb-4">Study Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyRooms?.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                  <h4 className="h4-bold text-light-1 mb-2">
                    {room.room_name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-light-3">
                      Capacity: {room.capacity} people
                    </p>
                    <p className="text-light-3">
                      {room.booking_date} · {room.start_time} - {room.end_time}
                    </p>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-dark-4 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded mt-3 w-full">
                    Book Room
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryServices;
