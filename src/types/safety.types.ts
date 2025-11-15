// Safety & Emergency Features
export interface SafetyAlert {
  id: string;
  alert_type: "crime" | "weather" | "emergency" | "other";
  title: string;
  description?: string;
  location_id?: string;
  severity: "low" | "medium" | "high" | "critical";
  issued_by_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface SafeWalkRequest {
  id: string;
  requester_id: string;
  escort_id?: string;
  from_location: string;
  to_location: string;
  request_time: string;
  completion_time?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

export interface LocationShare {
  id: string;
  sharer_id: string;
  shared_with_id: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface LocationUpdate {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  safe_walk_id?: string;
  created_at: string;
}

export interface EmergencyResource {
  id: string;
  resource_type: "campus_police" | "counseling" | "health" | "crisis";
  service_name: string;
  phone?: string;
  email?: string;
  available_hours?: string;
  description?: string;
  created_at: string;
}

// Mental Health & Wellness
export interface WellnessResource {
  id: string;
  title: string;
  description?: string;
  resource_type: "counseling" | "meditation" | "exercise" | "nutrition";
  url?: string;
  is_campus_resource: boolean;
  created_at: string;
}

export interface CounselingAppointment {
  id: string;
  user_id: string;
  counselor_name: string;
  appointment_date: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
}

export interface WellnessCheckIn {
  id: string;
  user_id: string;
  mood_score: number;
  stress_level: number;
  sleep_hours: number;
  exercise_minutes: number;
  notes?: string;
  created_at: string;
}

export interface WellnessGoal {
  id: string;
  user_id: string;
  goal_type: "meditation" | "exercise" | "sleep" | "mental_health";
  target_value: string;
  frequency: "daily" | "weekly" | "monthly";
  progress: number;
  created_at: string;
}

export interface SupportForum {
  id: string;
  title: string;
  description?: string;
  topic: "mental_health" | "stress" | "anxiety" | "relationships";
  is_moderated: boolean;
  created_at: string;
}

export interface ForumThread {
  id: string;
  forum_id: string;
  creator_id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  pinned: boolean;
  created_at: string;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  replier_id: string;
  content: string;
  is_anonymous: boolean;
  is_helpful: number;
  created_at: string;
}

// Academic Integrity & Moderation
export interface ContentReport {
  id: string;
  reported_content_id: string;
  reported_content_type: "post" | "comment" | "assignment" | "confession";
  reporter_id: string;
  reason: string;
  description?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  reviewed_by_id?: string;
  created_at: string;
}

export interface IntegrityFlag {
  id: string;
  flagged_user_id: string;
  flag_type: "plagiarism" | "cheating" | "unauthorized_sharing";
  description?: string;
  evidence_link?: string;
  status: "reported" | "investigated" | "resolved";
  resolved_by_id?: string;
  created_at: string;
}

export interface ModerationAction {
  id: string;
  content_id: string;
  moderator_id: string;
  action_type: "warned" | "removed" | "suspended" | "banned";
  reason: string;
  appeal_allowed: boolean;
  created_at: string;
}

export interface Appeal {
  id: string;
  user_id: string;
  moderation_action_id: string;
  appeal_text: string;
  status: "pending" | "approved" | "denied";
  reviewed_by_id?: string;
  decision_text?: string;
  created_at: string;
}
