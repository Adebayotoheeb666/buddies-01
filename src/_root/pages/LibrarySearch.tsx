import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  mockLibraryBooks,
  mockBookCheckouts,
} from "@/lib/mockData/phase3MockData";

const LibrarySearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const subjects = Array.from(new Set(mockLibraryBooks.map((b) => b.subject)));

  const filteredBooks = mockLibraryBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = !selectedSubject || book.subject === selectedSubject;
    const matchesAvailability = !showOnlyAvailable || book.available_copies > 0;

    return matchesSearch && matchesSubject && matchesAvailability;
  });

  const myCheckouts = mockBookCheckouts.filter(
    (checkout) => !checkout.return_date
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Library Catalog</h1>
          <p className="text-light-3">
            Search books, check availability, and manage your checkouts
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={() => navigate("/library/checkouts")}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4">
            <div>
              <div className="text-lg font-semibold mb-1">
                📚 My Checkouts ({myCheckouts.length})
              </div>
              <div className="text-sm text-light-3">View borrowed books</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate("/library/study-rooms")}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4">
            <div>
              <div className="text-lg font-semibold mb-1">🚪 Study Rooms</div>
              <div className="text-sm text-light-3">Book a study space</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate("/library/zones")}
            className="bg-dark-4 hover:bg-dark-3 text-left justify-start h-auto p-4">
            <div>
              <div className="text-lg font-semibold mb-1">📍 Library Zones</div>
              <div className="text-sm text-light-3">Find study areas</div>
            </div>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by title, author, ISBN, or subject..."
            className="w-full px-4 py-3 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Subject Filter */}
          <div>
            <p className="text-sm text-light-3 mb-3">Filter by Subject</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setSelectedSubject(null)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSubject === null
                    ? "bg-primary-500 text-white"
                    : "bg-dark-4 text-light-3 hover:bg-dark-3"
                }`}>
                All Subjects
              </Button>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedSubject === subject
                      ? "bg-primary-500 text-white"
                      : "bg-dark-4 text-light-3 hover:bg-dark-3"
                  }`}>
                  {subject}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available-only"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            <label
              htmlFor="available-only"
              className="text-light-2 cursor-pointer">
              Show only available books
            </label>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-light-3">
            Found {filteredBooks.length} book
            {filteredBooks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Books List */}
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/library/books/${book.id}`)}
              className="bg-dark-3 rounded-lg p-5 border border-dark-4 hover:border-primary-500 transition-colors cursor-pointer">
              <div className="flex gap-4">
                {/* Book Cover Placeholder */}
                <div className="w-20 h-28 bg-dark-4 rounded flex items-center justify-center text-3xl flex-shrink-0">
                  📖
                </div>

                {/* Book Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                      <p className="text-light-3 mb-2">{book.author}</p>
                    </div>
                    <div className="ml-4">
                      {book.available_copies > 0 ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm font-semibold">
                          Checked Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-light-4">Subject</p>
                      <p className="text-sm text-light-2">{book.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-light-4">ISBN</p>
                      <p className="text-sm text-light-2">{book.isbn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-light-4">Published</p>
                      <p className="text-sm text-light-2">
                        {book.published_year}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-light-4">Copies Available</p>
                      <p className="text-sm text-light-2">
                        {book.available_copies} / {book.total_copies}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <p className="text-xs text-light-4 mb-1">Location</p>
                    <p className="text-sm text-light-3">📍 {book.location}</p>
                  </div>

                  {/* Catalog Number */}
                  <div className="text-xs text-light-4">
                    Catalog #: {book.catalog_number}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/library/books/${book.id}`);
                  }}
                  className="bg-primary-500/20 text-primary-500 hover:bg-primary-500/30 text-sm py-2 px-4">
                  View Details
                </Button>
                {book.available_copies > 0 ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Book checkout functionality would be here");
                    }}
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm py-2 px-4">
                    Checkout Book
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Book hold functionality would be here");
                    }}
                    className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-sm py-2 px-4">
                    Place Hold
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-light-3 mb-2">No books found</p>
            <p className="text-light-4 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarySearch;
