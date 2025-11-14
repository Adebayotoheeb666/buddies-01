// Campus Map & Navigation
export interface CampusLocation {
  id: string;
  name: string;
  location_type: "building" | "classroom" | "cafe" | "library" | "gym" | "other";
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  hours_json?: Record<string, { opens: string; closes: string }>;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  created_at: string;
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
  created_at: string;
}

export interface BuildingRoute {
  id: string;
  from_location_id: string;
  to_location_id: string;
  distance_meters: number;
  walking_time_minutes: number;
  route_description?: string;
  route_coordinates?: Array<{ lat: number; lng: number }>;
  created_at: string;
}

// Dining Services
export interface DiningHall {
  id: string;
  name: string;
  location_id: string;
  capacity: number;
  accepts_meal_plan: boolean;
  accepts_cash: boolean;
  created_at: string;
}

export interface Menu {
  id: string;
  dining_hall_id: string;
  menu_date: string;
  meal_type: "breakfast" | "lunch" | "dinner";
  created_at: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  item_name: string;
  description?: string;
  dietary_info?: string[];
  created_at: string;
}

export interface DiningWaitTime {
  id: string;
  dining_hall_id: string;
  reported_by_id: string;
  wait_time_minutes: number;
  reported_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  plan_type: "unlimited" | "14_meals" | "10_meals" | "other";
  remaining_meals: number;
  remaining_swipes: number;
  balance: number;
  expiry_date: string;
  created_at: string;
}

export interface DiningReview {
  id: string;
  dining_hall_id: string;
  reviewer_id: string;
  rating: number;
  review_text?: string;
  food_quality_rating?: number;
  cleanliness_rating?: number;
  service_rating?: number;
  created_at: string;
}

export interface FoodReview {
  id: string;
  menu_item_id: string;
  reviewer_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

// Library System
export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  isbn?: string;
  catalog_number?: string;
  published_year?: number;
  total_copies: number;
  available_copies: number;
  location?: string;
  subject?: string;
  created_at: string;
}

export interface BookCheckout {
  id: string;
  user_id: string;
  book_id: string;
  checkout_date: string;
  due_date: string;
  return_date?: string;
  created_at: string;
}

export interface StudyRoomBooking {
  id: string;
  user_id: string;
  room_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  amenities?: string[];
  status: "confirmed" | "cancelled";
  created_at: string;
}

export interface LibraryZone {
  id: string;
  zone_name: string;
  noise_level: "quiet" | "moderate" | "collaborative";
  equipment_available?: string[];
  opening_hours_json?: Record<string, { opens: string; closes: string }>;
  created_at: string;
}

export interface BookHold {
  id: string;
  user_id: string;
  book_id: string;
  position_in_queue: number;
  created_at: string;
}

// Facilities Booking
export interface Facility {
  id: string;
  name: string;
  facility_type: "gym" | "sports_court" | "club_space" | "meeting_room" | "other";
  location_id: string;
  capacity: number;
  hourly_rate?: number;
  description?: string;
  amenities?: string[];
  rules_and_policies?: string;
  created_at: string;
}

export interface FacilityEquipment {
  id: string;
  facility_id: string;
  equipment_name: string;
  quantity: number;
  condition: "new" | "good" | "fair" | "poor";
  created_at: string;
}

export interface FacilityBooking {
  id: string;
  user_id: string;
  facility_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
  number_of_people: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface FacilityReview {
  id: string;
  facility_id: string;
  reviewer_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}
