// ============================================================
// PHASE 7: GAMIFICATION & ANALYTICS
// ============================================================

// 7.1 ENGAGEMENT & GAMIFICATION

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  badge_icon_url?: string;
  requirement_type: "events_attended" | "clubs_joined" | "posts_created" | "other";
  requirement_count: number;
  category: "social" | "academic" | "campus" | "exploration";
  points_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  points_this_semester: number;
  level: number;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: "event_attendance" | "post_creation" | "achievement" | "challenge" | "other";
  description?: string;
  created_at: string;
}

export interface Leaderboard {
  id: string;
  name: string;
  leaderboard_type: "points" | "events_attended" | "clubs_joined" | "other";
  period: "weekly" | "monthly" | "semester" | "all_time";
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  user_id: string;
  rank: number;
  score: number;
  is_opted_in: boolean;
  created_at: string;
}

export interface SemesterRecap {
  id: string;
  user_id: string;
  semester: string;
  events_attended: number;
  clubs_joined: number;
  posts_created: number;
  friends_made: number;
  achievements_unlocked: number;
  recap_data?: Record<string, unknown>;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  challenge_type: "photo" | "social" | "attendance" | "exploration";
  start_date: string;
  end_date: string;
  reward_points: number;
  participation_count: number;
  created_at: string;
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  submission_text?: string;
  submission_image_url?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface PhotoContest {
  id: string;
  title: string;
  description?: string;
  theme: string;
  start_date: string;
  end_date: string;
  prizes?: Record<string, unknown>;
  created_at: string;
}

export interface PhotoSubmission {
  id: string;
  contest_id: string;
  submitter_id: string;
  photo_url: string;
  caption?: string;
  votes: number;
  ranking?: number;
  created_at: string;
}

export interface BucketList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
}

export interface BucketListItem {
  id: string;
  bucket_list_id: string;
  activity: string;
  completed: boolean;
  completed_date?: string;
  location_id?: string;
  photo_url?: string;
  created_at: string;
}

export interface AttendanceStreak {
  id: string;
  user_id: string;
  activity_type: "events" | "clubs" | "study_groups";
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  updated_at: string;
}

// 7.2 ANALYTICS & INSIGHTS

export interface UserAnalytics {
  id: string;
  user_id: string;
  posts_created: number;
  posts_liked: number;
  connections_made: number;
  events_attended: number;
  clubs_joined: number;
  study_groups_created: number;
  study_groups_joined: number;
  courses_enrolled: number;
  assignments_completed: number;
  last_updated: string;
}

export interface FeatureUsage {
  id: string;
  user_id: string;
  feature_name: string;
  usage_count: number;
  last_used?: string;
  created_at: string;
}

export interface CampusExploration {
  id: string;
  user_id: string;
  location_id: string;
  visit_count: number;
  first_visit?: string;
  last_visit?: string;
  created_at: string;
}

export interface AdminMetrics {
  id: string;
  metric_type: "daily_active_users" | "event_attendance" | "engagement" | "new_signups";
  value: number;
  date: string;
  created_at: string;
}

export interface EngagementSummary {
  id: string;
  user_id: string;
  period: "week" | "month" | "semester";
  engagement_score: number;
  activity_breakdown?: Record<string, unknown>;
  recommendations?: string[];
  created_at: string;
}

export interface AtRiskStudent {
  id: string;
  user_id: string;
  risk_type: "low_engagement" | "academic_struggle" | "mental_health";
  risk_score: number;
  indicators?: string[];
  intervention_sent: boolean;
  identified_at: string;
}
