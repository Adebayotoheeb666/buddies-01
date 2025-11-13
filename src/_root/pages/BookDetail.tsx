import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockLibraryBooks } from "@/lib/mockData/phase3MockData";

const BookDetail = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const book = mockLibraryBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-3 mb-4">Book not found</p>
          <Button onClick={() => navigate('/library')}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const isAvailable = book.available_copies > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/library')}
          className="mb-6 bg-dark-4 hover:bg-dark-3"
        >
          <img src="/assets/icons/back.svg" width={20} height={20} alt="back" className="mr-2" />
          Back to Library
        </Button>

        {/* Book Header */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mb-6">
          <div className="flex gap-6">
            {/* Book Cover */}
            <div className="w-32 h-48 bg-dark-4 rounded-lg flex items-center justify-center text-5xl flex-shrink-0">
              📖
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                  <p className="text-xl text-light-3 mb-2">{book.author}</p>
                  <p className="text-light-4">Published: {book.published_year}</p>
                </div>
                <div>
                  {isAvailable ? (
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold">
                      Checked Out
                    </span>
                  )}
                </div>
              </div>

              {/* Availability Info */}
              <div className="bg-dark-4 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-500">
                      {book.total_copies}
                    </div>
                    <div className="text-sm text-light-4">Total Copies</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {book.available_copies}
                    </div>
                    <div className="text-sm text-light-4">Available</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {book.total_copies - book.available_copies}
                    </div>
                    <div className="text-sm text-light-4">Checked Out</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {isAvailable ? (
                  <Button
                    onClick={() => alert('Checkout functionality would be here')}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Checkout This Book
                  </Button>
                ) : (
                  <Button
                    onClick={() => alert('Place hold functionality would be here')}
                    className="flex-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  >
                    Place Hold
                  </Button>
                )}
                <Button
                  onClick={() => alert('Add to wishlist functionality')}
                  className="bg-dark-4 hover:bg-dark-2 px-6"
                >
                  ⭐ Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Catalog Information */}
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
            <h2 className="text-xl font-bold mb-4">📋 Catalog Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-light-4 text-sm mb-1">ISBN</p>
                <p className="text-light-1">{book.isbn}</p>
              </div>
              <div>
                <p className="text-light-4 text-sm mb-1">Catalog Number</p>
                <p className="text-light-1">{book.catalog_number}</p>
              </div>
              <div>
                <p className="text-light-4 text-sm mb-1">Subject</p>
                <p className="text-light-1">{book.subject}</p>
              </div>
              <div>
                <p className="text-light-4 text-sm mb-1">Published Year</p>
                <p className="text-light-1">{book.published_year}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
            <h2 className="text-xl font-bold mb-4">📍 Location</h2>
            <div className="space-y-3">
              <div>
                <p className="text-light-4 text-sm mb-1">Library Location</p>
                <p className="text-light-1">{book.location}</p>
              </div>
              <div className="bg-dark-4 rounded-lg p-4 mt-4">
                <p className="text-sm text-light-3 mb-2">
                  💡 <strong>Finding this book:</strong>
                </p>
                <ol className="text-sm text-light-3 space-y-1 ml-4 list-decimal">
                  <li>Go to the location specified above</li>
                  <li>Look for the catalog number: {book.catalog_number}</li>
                  <li>Books are organized alphabetically by author</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* About This Book */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mb-6">
          <h2 className="text-xl font-bold mb-4">📖 About This Book</h2>
          <p className="text-light-3 leading-relaxed">
            This is a comprehensive resource in {book.subject} written by {book.author}. 
            Originally published in {book.published_year}, this book has become a fundamental 
            text in its field. The library maintains {book.total_copies} copies to meet student demand.
          </p>
        </div>

        {/* Checkout Information */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4">
          <h2 className="text-xl font-bold mb-4">ℹ️ Checkout Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Loan Period</h3>
              <ul className="text-sm text-light-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Undergraduate Students: 3 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Graduate Students: 6 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Faculty/Staff: 12 weeks</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Renewal Policy</h3>
              <ul className="text-sm text-light-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Books can be renewed up to 3 times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Renewals not allowed if book is on hold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  <span>Late returns incur $0.25/day fine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Books */}
        <div className="bg-dark-3 rounded-lg p-6 border border-dark-4 mt-6">
          <h2 className="text-xl font-bold mb-4">📚 Related Books</h2>
          <p className="text-light-3 text-sm mb-4">
            Other books in {book.subject}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockLibraryBooks
              .filter((b) => b.subject === book.subject && b.id !== book.id)
              .slice(0, 4)
              .map((relatedBook) => (
                <div
                  key={relatedBook.id}
                  onClick={() => navigate(`/library/books/${relatedBook.id}`)}
                  className="bg-dark-4 rounded-lg p-3 hover:bg-dark-2 transition-colors cursor-pointer flex gap-3"
                >
                  <div className="w-12 h-16 bg-dark-3 rounded flex items-center justify-center flex-shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{relatedBook.title}</p>
                    <p className="text-xs text-light-4 truncate">{relatedBook.author}</p>
                    <p className="text-xs mt-1">
                      {relatedBook.available_copies > 0 ? (
                        <span className="text-green-400">Available</span>
                      ) : (
                        <span className="text-red-400">Checked Out</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
