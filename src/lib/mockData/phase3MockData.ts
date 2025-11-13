export interface CampusLocation {
  id: string;
  name: string;
  location_type:
    | "building"
    | "classroom"
    | "cafe"
    | "library"
    | "gym"
    | "parking"
    | "dorm"
    | "dining";
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  hours: {
    monday?: { opens: string; closes: string };
    tuesday?: { opens: string; closes: string };
    wednesday?: { opens: string; closes: string };
    thursday?: { opens: string; closes: string };
    friday?: { opens: string; closes: string };
    saturday?: { opens: string; closes: string };
    sunday?: { opens: string; closes: string };
  };
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface Classroom {
  id: string;
  location_id: string;
  building_name: string;
  room_number: string;
  capacity: number;
  has_projector: boolean;
  has_whiteboard: boolean;
  has_computers: boolean;
}

export interface BuildingRoute {
  id: string;
  from_location_id: string;
  to_location_id: string;
  distance_meters: number;
  walking_time_minutes: number;
  route_description: string;
  route_coordinates: { lat: number; lng: number }[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  catalog_number: string;
  published_year: number;
  total_copies: number;
  available_copies: number;
  location: string;
  subject: string;
  cover_url?: string;
}

export interface BookCheckout {
  id: string;
  user_id: string;
  book_id: string;
  checkout_date: string;
  due_date: string;
  return_date?: string;
}

export interface StudyRoom {
  id: string;
  room_name: string;
  capacity: number;
  amenities: string[];
  noise_level: "quiet" | "moderate" | "collaborative";
  has_whiteboard: boolean;
  has_tv: boolean;
  has_computers: boolean;
  floor: number;
}

export interface StudyRoomBooking {
  id: string;
  user_id: string;
  room_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled";
}

export interface LibraryZone {
  id: string;
  zone_name: string;
  noise_level: "quiet" | "moderate" | "collaborative";
  equipment_available: string[];
  floor: number;
  description: string;
}

// Mock Campus Locations
export const mockCampusLocations: CampusLocation[] = [
  {
    id: "1",
    name: "Main Library",
    location_type: "library",
    description:
      "Central campus library with extensive resources and study spaces",
    latitude: 40.7128,
    longitude: -74.006,
    address: "100 University Ave",
    hours: {
      monday: { opens: "07:00", closes: "23:00" },
      tuesday: { opens: "07:00", closes: "23:00" },
      wednesday: { opens: "07:00", closes: "23:00" },
      thursday: { opens: "07:00", closes: "23:00" },
      friday: { opens: "07:00", closes: "21:00" },
      saturday: { opens: "09:00", closes: "21:00" },
      sunday: { opens: "09:00", closes: "23:00" },
    },
    contact_info: {
      phone: "(555) 123-4567",
      email: "library@university.edu",
      website: "https://library.university.edu",
    },
  },
  {
    id: "2",
    name: "Engineering Building",
    location_type: "building",
    description:
      "Home to Computer Science, Electrical, and Mechanical Engineering departments",
    latitude: 40.713,
    longitude: -74.0055,
    address: "200 Engineering Way",
    hours: {
      monday: { opens: "06:00", closes: "22:00" },
      tuesday: { opens: "06:00", closes: "22:00" },
      wednesday: { opens: "06:00", closes: "22:00" },
      thursday: { opens: "06:00", closes: "22:00" },
      friday: { opens: "06:00", closes: "20:00" },
      saturday: { opens: "08:00", closes: "18:00" },
      sunday: { opens: "08:00", closes: "20:00" },
    },
    contact_info: {
      phone: "(555) 234-5678",
      email: "engineering@university.edu",
    },
  },
  {
    id: "3",
    name: "Student Union",
    location_type: "building",
    description: "Student center with dining, meeting spaces, and recreation",
    latitude: 40.7125,
    longitude: -74.0065,
    address: "50 Campus Center Drive",
    hours: {
      monday: { opens: "07:00", closes: "23:00" },
      tuesday: { opens: "07:00", closes: "23:00" },
      wednesday: { opens: "07:00", closes: "23:00" },
      thursday: { opens: "07:00", closes: "23:00" },
      friday: { opens: "07:00", closes: "01:00" },
      saturday: { opens: "08:00", closes: "01:00" },
      sunday: { opens: "08:00", closes: "23:00" },
    },
    contact_info: {
      phone: "(555) 345-6789",
      email: "union@university.edu",
      website: "https://union.university.edu",
    },
  },
  {
    id: "4",
    name: "Science Complex",
    location_type: "building",
    description: "Biology, Chemistry, and Physics departments with labs",
    latitude: 40.7132,
    longitude: -74.0058,
    address: "150 Science Way",
    hours: {
      monday: { opens: "06:00", closes: "22:00" },
      tuesday: { opens: "06:00", closes: "22:00" },
      wednesday: { opens: "06:00", closes: "22:00" },
      thursday: { opens: "06:00", closes: "22:00" },
      friday: { opens: "06:00", closes: "20:00" },
    },
    contact_info: {
      phone: "(555) 456-7890",
    },
  },
  {
    id: "5",
    name: "Campus Café",
    location_type: "cafe",
    description: "Coffee shop and light meals",
    latitude: 40.7127,
    longitude: -74.0062,
    address: "75 University Ave",
    hours: {
      monday: { opens: "07:00", closes: "20:00" },
      tuesday: { opens: "07:00", closes: "20:00" },
      wednesday: { opens: "07:00", closes: "20:00" },
      thursday: { opens: "07:00", closes: "20:00" },
      friday: { opens: "07:00", closes: "18:00" },
      saturday: { opens: "08:00", closes: "18:00" },
      sunday: { opens: "08:00", closes: "18:00" },
    },
    contact_info: {
      phone: "(555) 567-8901",
    },
  },
  {
    id: "6",
    name: "Recreation Center",
    location_type: "gym",
    description: "Fitness center with gym, pool, and courts",
    latitude: 40.7126,
    longitude: -74.0068,
    address: "25 Athletic Drive",
    hours: {
      monday: { opens: "06:00", closes: "23:00" },
      tuesday: { opens: "06:00", closes: "23:00" },
      wednesday: { opens: "06:00", closes: "23:00" },
      thursday: { opens: "06:00", closes: "23:00" },
      friday: { opens: "06:00", closes: "22:00" },
      saturday: { opens: "08:00", closes: "22:00" },
      sunday: { opens: "08:00", closes: "22:00" },
    },
    contact_info: {
      phone: "(555) 678-9012",
      website: "https://rec.university.edu",
    },
  },
  {
    id: "7",
    name: "Main Dining Hall",
    location_type: "dining",
    description: "All-you-can-eat dining with multiple stations",
    latitude: 40.7124,
    longitude: -74.0064,
    address: "30 Dining Commons",
    hours: {
      monday: { opens: "07:00", closes: "21:00" },
      tuesday: { opens: "07:00", closes: "21:00" },
      wednesday: { opens: "07:00", closes: "21:00" },
      thursday: { opens: "07:00", closes: "21:00" },
      friday: { opens: "07:00", closes: "20:00" },
      saturday: { opens: "08:00", closes: "20:00" },
      sunday: { opens: "08:00", closes: "21:00" },
    },
    contact_info: {
      phone: "(555) 789-0123",
    },
  },
  {
    id: "8",
    name: "North Parking Garage",
    location_type: "parking",
    description: "Multi-level parking structure with student permits",
    latitude: 40.7134,
    longitude: -74.007,
    address: "500 Parking Lane",
    hours: {
      monday: { opens: "00:00", closes: "23:59" },
      tuesday: { opens: "00:00", closes: "23:59" },
      wednesday: { opens: "00:00", closes: "23:59" },
      thursday: { opens: "00:00", closes: "23:59" },
      friday: { opens: "00:00", closes: "23:59" },
      saturday: { opens: "00:00", closes: "23:59" },
      sunday: { opens: "00:00", closes: "23:59" },
    },
    contact_info: {
      phone: "(555) 890-1234",
    },
  },
];

// Mock Classrooms
export const mockClassrooms: Classroom[] = [
  {
    id: "1",
    location_id: "2",
    building_name: "Engineering Building",
    room_number: "ENG 201",
    capacity: 50,
    has_projector: true,
    has_whiteboard: true,
    has_computers: false,
  },
  {
    id: "2",
    location_id: "2",
    building_name: "Engineering Building",
    room_number: "ENG 105",
    capacity: 30,
    has_projector: true,
    has_whiteboard: true,
    has_computers: true,
  },
  {
    id: "3",
    location_id: "4",
    building_name: "Science Complex",
    room_number: "SCI 301",
    capacity: 40,
    has_projector: true,
    has_whiteboard: false,
    has_computers: false,
  },
  {
    id: "4",
    location_id: "4",
    building_name: "Science Complex",
    room_number: "SCI 215",
    capacity: 25,
    has_projector: true,
    has_whiteboard: true,
    has_computers: true,
  },
  {
    id: "5",
    location_id: "2",
    building_name: "Engineering Building",
    room_number: "ENG 410",
    capacity: 75,
    has_projector: true,
    has_whiteboard: true,
    has_computers: false,
  },
];

// Mock Building Routes
export const mockBuildingRoutes: BuildingRoute[] = [
  {
    id: "1",
    from_location_id: "1",
    to_location_id: "2",
    distance_meters: 200,
    walking_time_minutes: 3,
    route_description:
      "Exit Main Library, turn right, walk 200m to Engineering Building",
    route_coordinates: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7129, lng: -74.0058 },
      { lat: 40.713, lng: -74.0055 },
    ],
  },
  {
    id: "2",
    from_location_id: "1",
    to_location_id: "3",
    distance_meters: 150,
    walking_time_minutes: 2,
    route_description: "Exit Main Library, walk west to Student Union",
    route_coordinates: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7127, lng: -74.0063 },
      { lat: 40.7125, lng: -74.0065 },
    ],
  },
  {
    id: "3",
    from_location_id: "2",
    to_location_id: "4",
    distance_meters: 100,
    walking_time_minutes: 2,
    route_description: "Walk from Engineering Building to Science Complex",
    route_coordinates: [
      { lat: 40.713, lng: -74.0055 },
      { lat: 40.7131, lng: -74.0057 },
      { lat: 40.7132, lng: -74.0058 },
    ],
  },
  {
    id: "4",
    from_location_id: "3",
    to_location_id: "6",
    distance_meters: 180,
    walking_time_minutes: 3,
    route_description: "Walk from Student Union to Recreation Center",
    route_coordinates: [
      { lat: 40.7125, lng: -74.0065 },
      { lat: 40.7126, lng: -74.0067 },
      { lat: 40.7126, lng: -74.0068 },
    ],
  },
];

// Mock Library Books
export const mockLibraryBooks: LibraryBook[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    catalog_number: "QA76.6.C662",
    published_year: 2009,
    total_copies: 5,
    available_copies: 2,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Computer Science",
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    catalog_number: "QA76.76.D47M37",
    published_year: 2008,
    total_copies: 3,
    available_copies: 1,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Software Engineering",
  },
  {
    id: "3",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "978-0135957059",
    catalog_number: "QA76.758.H86",
    published_year: 2019,
    total_copies: 4,
    available_copies: 4,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Software Engineering",
  },
  {
    id: "4",
    title: "Design Patterns",
    author: "Erich Gamma",
    isbn: "978-0201633610",
    catalog_number: "QA76.64.D47",
    published_year: 1994,
    total_copies: 3,
    available_copies: 0,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Software Engineering",
  },
  {
    id: "5",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    catalog_number: "QA303.2.S74",
    published_year: 2015,
    total_copies: 10,
    available_copies: 6,
    location: "Main Library - 2nd Floor, Mathematics Section",
    subject: "Mathematics",
  },
  {
    id: "6",
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    isbn: "978-1133954057",
    catalog_number: "QC23.2.S47",
    published_year: 2013,
    total_copies: 8,
    available_copies: 3,
    location: "Science Library - 1st Floor",
    subject: "Physics",
  },
  {
    id: "7",
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0134042282",
    catalog_number: "QD251.3.B78",
    published_year: 2016,
    total_copies: 7,
    available_copies: 2,
    location: "Science Library - 2nd Floor",
    subject: "Chemistry",
  },
  {
    id: "8",
    title: "Campbell Biology",
    author: "Lisa A. Urry",
    isbn: "978-0134093413",
    catalog_number: "QH308.2.C34",
    published_year: 2016,
    total_copies: 6,
    available_copies: 4,
    location: "Science Library - 2nd Floor",
    subject: "Biology",
  },
  {
    id: "9",
    title: "Data Structures and Algorithms in Java",
    author: "Michael T. Goodrich",
    isbn: "978-1118771334",
    catalog_number: "QA76.73.J38G66",
    published_year: 2014,
    total_copies: 4,
    available_copies: 3,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Computer Science",
  },
  {
    id: "10",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "978-0136042594",
    catalog_number: "Q335.R86",
    published_year: 2020,
    total_copies: 5,
    available_copies: 1,
    location: "Main Library - 3rd Floor, Computer Science Section",
    subject: "Artificial Intelligence",
  },
];

// Mock Study Rooms
export const mockStudyRooms: StudyRoom[] = [
  {
    id: "1",
    room_name: "Study Room 101",
    capacity: 4,
    amenities: ["Whiteboard", "TV Display", "HDMI Cable"],
    noise_level: "quiet",
    has_whiteboard: true,
    has_tv: true,
    has_computers: false,
    floor: 1,
  },
  {
    id: "2",
    room_name: "Study Room 102",
    capacity: 6,
    amenities: ["Whiteboard", "TV Display", "Computer"],
    noise_level: "moderate",
    has_whiteboard: true,
    has_tv: true,
    has_computers: true,
    floor: 1,
  },
  {
    id: "3",
    room_name: "Study Room 201",
    capacity: 8,
    amenities: ["Whiteboard", "TV Display", "Conference Phone"],
    noise_level: "collaborative",
    has_whiteboard: true,
    has_tv: true,
    has_computers: false,
    floor: 2,
  },
  {
    id: "4",
    room_name: "Study Room 202",
    capacity: 4,
    amenities: ["Whiteboard"],
    noise_level: "quiet",
    has_whiteboard: true,
    has_tv: false,
    has_computers: false,
    floor: 2,
  },
  {
    id: "5",
    room_name: "Study Room 301",
    capacity: 10,
    amenities: ["Whiteboard", "TV Display", "Computer", "Conference Phone"],
    noise_level: "collaborative",
    has_whiteboard: true,
    has_tv: true,
    has_computers: true,
    floor: 3,
  },
  {
    id: "6",
    room_name: "Study Room 302",
    capacity: 4,
    amenities: ["Whiteboard", "TV Display"],
    noise_level: "moderate",
    has_whiteboard: true,
    has_tv: true,
    has_computers: false,
    floor: 3,
  },
];

// Mock Library Zones
export const mockLibraryZones: LibraryZone[] = [
  {
    id: "1",
    zone_name: "Silent Study Zone",
    noise_level: "quiet",
    equipment_available: ["Desktop Computers", "Printers", "Scanners"],
    floor: 4,
    description: "Completely silent individual study area",
  },
  {
    id: "2",
    zone_name: "Collaborative Learning Space",
    noise_level: "collaborative",
    equipment_available: [
      "Whiteboards",
      "Group Tables",
      "TV Displays",
      "Presentation Equipment",
    ],
    floor: 1,
    description: "Open space for group work and discussions",
  },
  {
    id: "3",
    zone_name: "Quiet Reading Room",
    noise_level: "quiet",
    equipment_available: ["Comfortable Chairs", "Reading Lamps"],
    floor: 3,
    description: "Peaceful environment for focused reading",
  },
  {
    id: "4",
    zone_name: "Technology Commons",
    noise_level: "moderate",
    equipment_available: [
      "Desktop Computers",
      "Laptops for Checkout",
      "3D Printers",
      "VR Equipment",
    ],
    floor: 2,
    description: "Advanced technology and media creation space",
  },
  {
    id: "5",
    zone_name: "Study Lounge",
    noise_level: "moderate",
    equipment_available: ["Couches", "Coffee Machine", "Vending Machines"],
    floor: 1,
    description: "Relaxed study area with refreshments",
  },
];

// Mock Book Checkouts (for current user)
export const mockBookCheckouts: BookCheckout[] = [
  {
    id: "1",
    user_id: "current-user",
    book_id: "1",
    checkout_date: "2024-01-15",
    due_date: "2024-02-15",
  },
  {
    id: "2",
    user_id: "current-user",
    book_id: "5",
    checkout_date: "2024-01-20",
    due_date: "2024-02-20",
  },
];

// Mock Study Room Bookings
export const mockStudyRoomBookings: StudyRoomBooking[] = [
  {
    id: "1",
    user_id: "current-user",
    room_id: "1",
    booking_date: "2024-02-01",
    start_time: "14:00",
    end_time: "16:00",
    status: "confirmed",
  },
  {
    id: "2",
    user_id: "current-user",
    room_id: "3",
    booking_date: "2024-02-03",
    start_time: "10:00",
    end_time: "12:00",
    status: "confirmed",
  },
];
