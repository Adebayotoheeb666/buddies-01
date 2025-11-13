// ============================================================
// COURSE & CLASS TYPES
// ============================================================

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  professor: string;
  department: string;
  semester: string;
  section: string;
  credits: number;
  schedule_json: CourseSchedule;
  location: string;
  enrollment_count: number;
  max_enrollment: number;
  created_at: string;
  updated_at: string;
}

export interface CourseSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_date: string;
}

export interface CourseCommunity {
  id: string;
  course_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CourseCommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  role: "member" | "moderator" | "owner";
}

// ============================================================
// STUDY GROUP TYPES
// ============================================================

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  course_id: string | null;
  location: string;
  meeting_time: string | null;
  max_members: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  members_count?: number;
}

export interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  role: "member" | "moderator" | "organizer";
}

export interface StudyGroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    imageUrl: string;
  };
}

// ============================================================
// ASSIGNMENT & DEADLINE TYPES
// ============================================================

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  assignment_type: "homework" | "project" | "exam" | "quiz";
  total_points: number;
  is_group_project: boolean;
  created_by_id: string;
  created_at: string;
}

export interface AssignmentTracking {
  id: string;
  user_id: string;
  assignment_id: string;
  status: "not_started" | "in_progress" | "completed" | "submitted";
  submission_date: string | null;
  grade: number | null;
  notes: string;
  assignment?: Assignment;
}

export interface GroupProject {
  id: string;
  assignment_id: string;
  project_name: string;
  description: string;
  created_at: string;
}

export interface GroupProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  tasks_assigned: string;
  joined_at: string;
}

// ============================================================
// NOTE SHARING TYPES
// ============================================================

export interface SharedNote {
  id: string;
  creator_id: string;
  course_id: string;
  title: string;
  content: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteVersion {
  id: string;
  note_id: string;
  version_number: number;
  content: string;
  changed_by_id: string;
  change_summary: string;
  created_at: string;
}

export interface CollaborativeNote {
  id: string;
  name: string;
  course_id: string;
  created_by_id: string;
  current_content: string;
  created_at: string;
  updated_at: string;
}

export interface CollaborativeNoteContributor {
  id: string;
  note_id: string;
  user_id: string;
  access_level: "view" | "edit" | "admin";
  joined_at: string;
}

export interface NoteComment {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    name: string;
    imageUrl: string;
  };
}

// ============================================================
// PROJECT MATCHING TYPES
// ============================================================

export interface Skill {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: "beginner" | "intermediate" | "advanced" | "expert";
  endorsements: number;
  created_at: string;
  skill?: Skill;
}

export interface ProjectListing {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  required_skills: string[];
  team_size: number;
  current_members: number;
  status: "recruiting" | "in_progress" | "completed";
  due_date: string | null;
  created_at: string;
  creator?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  members_count?: number;
}

export interface ProjectTeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

// ============================================================
// PEER TUTORING TYPES
// ============================================================

export interface TutoringProfile {
  id: string;
  user_id: string;
  bio: string;
  subjects_tutored: string[];
  hourly_rate: number;
  availability_json: Record<string, string[]>;
  location_preference: "in_person" | "virtual" | "both";
  is_active: boolean;
  created_at: string;
}

export interface TutoringRequest {
  id: string;
  requester_id: string;
  tutor_id: string;
  subject: string;
  description: string;
  requested_date: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  created_at: string;
}

export interface TutoringSession {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  session_date: string;
  duration_minutes: number;
  meeting_link: string | null;
  notes: string;
  completed_at: string | null;
  created_at: string;
}

export interface TutoringReview {
  id: string;
  tutor_id: string;
  reviewer_id: string;
  rating: number;
  review_text: string;
  session_id: string;
  created_at: string;
}

export interface TutorRating {
  id: string;
  tutor_id: string;
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  last_updated: string;
}

// ============================================================
// RESOURCE LIBRARY TYPES
// ============================================================

export interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: "textbook" | "notes" | "guide" | "video" | "other";
  course_id: string | null;
  uploaded_by_id: string;
  file_url: string;
  tags: string[];
  is_public: boolean;
  views: number;
  downloads: number;
  created_at: string;
}

export interface Textbook {
  id: string;
  title: string;
  isbn: string;
  course_id: string;
  price_new: number;
  price_used: number;
  condition: "new" | "like_new" | "good" | "acceptable";
  edition: number;
  created_at: string;
}

export interface TextbookListing {
  id: string;
  seller_id: string;
  textbook_id: string;
  price: number;
  condition: string;
  description: string;
  available: boolean;
  created_at: string;
  textbook?: Textbook;
  seller?: {
    name: string;
    imageUrl: string;
  };
}

export interface ProfessorReview {
  id: string;
  professor_id: string;
  course_id: string;
  reviewer_id: string;
  rating: number;
  review_text: string;
  is_anonymous: boolean;
  difficulty_rating: number;
  workload_rating: number;
  created_at: string;
}

// ============================================================
// Q&A FORUM TYPES
// ============================================================

export interface QAQuestion {
  id: string;
  asker_id: string;
  course_id: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  views: number;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
  asker?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  answers_count?: number;
}

export interface QAAnswer {
  id: string;
  question_id: string;
  answerer_id: string;
  content: string;
  upvotes: number;
  is_verified: boolean;
  verification_by_id: string | null;
  created_at: string;
  updated_at: string;
  answerer?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export interface QAComment {
  id: string;
  answerable_type: "question" | "answer";
  answerable_id: string;
  commenter_id: string;
  content: string;
  created_at: string;
  commenter?: {
    name: string;
    imageUrl: string;
  };
}

export interface AnswerVote {
  id: string;
  user_id: string;
  answer_id: string;
  vote_type: "upvote" | "downvote";
  created_at: string;
}

export interface QuestionVote {
  id: string;
  user_id: string;
  question_id: string;
  vote_type: "upvote" | "downvote";
  created_at: string;
}

export interface QuestionFollower {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}
