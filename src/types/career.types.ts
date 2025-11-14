// Career Services & Job Board
export interface JobPosting {
  id: string;
  company_name: string;
  job_title: string;
  job_type: "internship" | "full-time" | "part-time" | "contract";
  description?: string;
  requirements?: string[];
  location?: string;
  salary_range?: string;
  application_deadline?: string;
  posted_by_id?: string;
  application_count: number;
  created_at: string;
}

export interface JobApplication {
  id: string;
  applicant_id: string;
  job_posting_id: string;
  resume_url?: string;
  cover_letter?: string;
  status: "applied" | "reviewing" | "interview" | "accepted" | "rejected";
  applied_at: string;
}

export interface InternshipPosting {
  id: string;
  company_name: string;
  position_title: string;
  description?: string;
  semester: string;
  gpa_requirement?: number;
  major_preferences?: string[];
  deadline: string;
  created_at: string;
}

export interface ApplicationTracking {
  id: string;
  user_id: string;
  job_posting_id?: string;
  company_name: string;
  position_title: string;
  status: "applied" | "phone_screen" | "interview" | "offer" | "rejected" | "withdrawn";
  status_date: string;
  notes?: string;
  deadline_reminder: boolean;
  created_at: string;
}

export interface CareerFair {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location_id?: string;
  created_at: string;
}

export interface CareerFairCompany {
  id: string;
  career_fair_id: string;
  company_name: string;
  booth_number?: string;
  description?: string;
  hiring_positions?: string[];
  recruiter_info?: Record<string, any>;
  created_at: string;
}

export interface CareerFairMeeting {
  id: string;
  career_fair_id: string;
  student_id: string;
  company_id: string;
  meeting_time: string;
  created_at: string;
}

export interface UserPortfolio {
  id: string;
  user_id: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  personal_website?: string;
  bio?: string;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  portfolio_id: string;
  title: string;
  description?: string;
  technologies?: string[];
  project_url?: string;
  image_url?: string;
  created_at: string;
}

export interface SkillEndorsement {
  id: string;
  user_id: string;
  endorser_id: string;
  skill_id: string;
  created_at: string;
}

// Alumni Network & Mentorship
export interface AlumniProfile {
  id: string;
  user_id: string;
  graduation_year: number;
  current_company?: string;
  current_position?: string;
  industry?: string;
  willing_to_mentor: boolean;
  expertise_areas?: string[];
  availability?: Record<string, any>;
  created_at: string;
}

export interface MentorshipPair {
  id: string;
  mentor_id: string;
  mentee_id: string;
  goal?: string;
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface MentorshipSession {
  id: string;
  pair_id: string;
  session_date: string;
  topic?: string;
  notes?: string;
  completed_at?: string;
  created_at: string;
}

export interface MentorshipFeedback {
  id: string;
  pair_id: string;
  rating: number;
  feedback_text?: string;
  created_at: string;
}

export interface CareerPath {
  id: string;
  alumni_id: string;
  path_description?: string;
  key_milestones?: string[];
  challenges_overcome?: string;
  advice?: string;
  created_at: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  description?: string;
  event_type: "networking" | "panel" | "workshop" | "reunion";
  event_date: string;
  location_id?: string;
  organizer_id?: string;
  created_at: string;
}

export interface AlumniNetwork {
  id: string;
  name: string;
  description?: string;
  industry_focus?: string;
  created_at: string;
}

export interface AlumniNetworkMember {
  id: string;
  network_id: string;
  alumni_id: string;
  joined_at: string;
}

// Research & Startup Opportunities
export interface ResearchOpportunity {
  id: string;
  faculty_id: string;
  title: string;
  description?: string;
  lab_name?: string;
  required_skills?: string[];
  position_type: "research_assistant" | "grad_student" | "undergrad";
  start_date?: string;
  duration?: string;
  stipend?: number;
  applications_count: number;
  created_at: string;
}

export interface ResearchApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  cv_url?: string;
  motivation_statement?: string;
  status: "applied" | "interview" | "accepted" | "rejected";
  applied_at: string;
}

export interface ResearchProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  research_area?: string;
  start_date?: string;
  end_date?: string;
  outcomes?: string;
  publications?: string[];
  created_at: string;
}

export interface StartupOpportunity {
  id: string;
  creator_id: string;
  startup_name: string;
  description?: string;
  stage: "idea" | "prototype" | "mvp" | "funded";
  looking_for?: string[];
  skills_needed?: string[];
  equity_offered?: number;
  created_at: string;
}

export interface StartupTeamMember {
  id: string;
  startup_id: string;
  user_id: string;
  role: string;
  equity_percent?: number;
  joined_at: string;
}

export interface CoFounderProfile {
  id: string;
  user_id: string;
  entrepreneurial_experience?: string;
  industry_interest?: string[];
  looking_for_cofounders: boolean;
  ideal_cofounder_description?: string;
  created_at: string;
}

export interface PitchCompetition {
  id: string;
  title: string;
  description?: string;
  competition_date: string;
  prize_pool?: number;
  max_teams?: number;
  registration_deadline: string;
  created_at: string;
}

export interface PitchCompetitionRegistration {
  id: string;
  competition_id: string;
  startup_id?: string;
  team_lead_id: string;
  pitch_title?: string;
  pitch_video_url?: string;
  status: "registered" | "accepted" | "presenting" | "ranked";
  ranking?: number;
  created_at: string;
}
