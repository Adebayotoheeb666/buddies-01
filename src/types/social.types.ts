// ============================================================
// CLASS YEAR NETWORKS
// ============================================================

export interface ClassYearGroup {
  id: string;
  class_year: string; // Freshman, Sophomore, Junior, Senior
  created_at: string;
}

export interface ClassYearMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

// ============================================================
// DEPARTMENT NETWORKS
// ============================================================

export interface DepartmentNetwork {
  id: string;
  department: string;
  description: string;
  created_at: string;
  member_count?: number;
}

export interface DepartmentMember {
  id: string;
  network_id: string;
  user_id: string;
  joined_at: string;
}

// ============================================================
// INTERNATIONAL STUDENT HUB
// ============================================================

export interface InternationalStudentProfile {
  id: string;
  user_id: string;
  country_of_origin: string;
  language_spoken: string[];
  needs_visa_support: boolean;
  created_at: string;
}

// ============================================================
// COMMUTER NETWORK
// ============================================================

export interface CommuterProfile {
  id: string;
  user_id: string;
  commute_area: string;
  interested_in_carpool: boolean;
  parking_info: string;
  created_at: string;
}

// ============================================================
// CAMPUS POLLS
// ============================================================

export interface CampusPoll {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  poll_type: "campus_issue" | "event_preference" | "general";
  created_at: string;
  expires_at: string;
  total_votes?: number;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_id: string;
  created_at: string;
}

// ============================================================
// INTEREST-BASED GROUPS
// ============================================================

export interface InterestGroup {
  id: string;
  name: string;
  description: string;
  interests: string[];
  creator_id: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
}

export interface InterestGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

// ============================================================
// MEME BOARD
// ============================================================

export interface MemePost {
  id: string;
  creator_id: string;
  image_url: string;
  caption: string;
  likes: number;
  shares: number;
  created_at: string;
  creator?: {
    name: string;
    imageUrl: string;
  };
}

// ============================================================
// ANONYMOUS CONFESSIONS
// ============================================================

export interface AnonymousConfession {
  id: string;
  poster_id: string;
  content: string;
  anonymity_status: "fully_anonymous" | "visible_to_friends";
  moderation_status: "pending" | "approved" | "rejected";
  is_flagged: boolean;
  created_at: string;
}

// ============================================================
// STUDENT ORGANIZATIONS
// ============================================================

export interface StudentOrganization {
  id: string;
  name: string;
  acronym: string;
  description: string;
  category: "academic" | "cultural" | "sports" | "greek" | "service" | "other";
  president_id: string;
  email: string;
  meeting_schedule: string;
  total_members: number;
  created_at: string;
  is_member?: boolean;
  user_role?: "member" | "officer" | "president";
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: "member" | "officer" | "president";
  joined_at: string;
}

// ============================================================
// ORGANIZATION EVENTS
// ============================================================

export interface OrganizationEvent {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  event_date: string;
  location_id: string | null;
  location_name?: string;
  event_type: "meeting" | "social" | "recruitment" | "workshop";
  capacity: number;
  rsvp_count: number;
  created_by_id: string;
  created_at: string;
  user_rsvp_status?: "going" | "interested" | "not_going";
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: "going" | "interested" | "not_going";
  created_at: string;
}

export interface EventCheckIn {
  id: string;
  event_id: string;
  user_id: string;
  check_in_time: string;
}

// ============================================================
// ORGANIZATION RECRUITMENT
// ============================================================

export interface RecruitmentPeriod {
  id: string;
  organization_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface RecruitmentApplication {
  id: string;
  recruitment_period_id: string;
  applicant_id: string;
  status: "applied" | "interviewed" | "accepted" | "rejected";
  created_at: string;
}

// ============================================================
// NETWORK DISCOVERY
// ============================================================

export interface NetworkDiscoveryCard {
  id: string;
  type: "class_year" | "department" | "interest" | "organization";
  title: string;
  description: string;
  member_count: number;
  is_member: boolean;
  imageUrl?: string;
}
