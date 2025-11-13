-- ============================================================
-- PHASE 1: ACADEMIC FEATURES SCHEMA
-- ============================================================

-- Extended Users Table (if not already exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
  university_id TEXT UNIQUE,
  graduation_year INT,
  major VARCHAR(255),
  class_year VARCHAR(50),
  interests TEXT[],
  profile_visibility VARCHAR(50) DEFAULT 'public',
  pronouns VARCHAR(50),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  is_graduated BOOLEAN DEFAULT false
);

-- ============================================================
-- COURSES & CLASS INTEGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code VARCHAR(50) NOT NULL,
  course_name TEXT NOT NULL,
  professor VARCHAR(255),
  department VARCHAR(255),
  semester VARCHAR(50),
  section VARCHAR(10),
  credits INT,
  schedule_json JSONB,
  location VARCHAR(255),
  enrollment_count INT DEFAULT 0,
  max_enrollment INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS course_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES course_communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(community_id, user_id)
);

-- ============================================================
-- STUDY GROUPS & COLLABORATION
-- ============================================================

CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  location VARCHAR(255),
  meeting_time TIMESTAMP,
  max_members INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS study_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- ASSIGNMENTS & DEADLINES
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  assignment_type VARCHAR(50),
  total_points INT,
  is_group_project BOOLEAN DEFAULT false,
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started',
  submission_date TIMESTAMP,
  grade INT,
  notes TEXT,
  UNIQUE(user_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS group_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES group_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  tasks_assigned TEXT,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- ============================================================
-- NOTE SHARING & COLLABORATION
-- ============================================================

CREATE TABLE IF NOT EXISTS shared_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS note_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES shared_notes(id) ON DELETE CASCADE,
  version_number INT,
  content TEXT NOT NULL,
  changed_by_id UUID REFERENCES users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collaborative_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collab_note_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES collaborative_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  access_level VARCHAR(50) DEFAULT 'view',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(note_id, user_id)
);

CREATE TABLE IF NOT EXISTS note_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES shared_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- PROJECT MATCHING
-- ============================================================

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(50) DEFAULT 'beginner',
  endorsements INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS project_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  team_size INT,
  current_members INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'recruiting',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES project_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255),
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- ============================================================
-- PEER TUTORING
-- ============================================================

CREATE TABLE IF NOT EXISTS tutoring_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  subjects_tutored TEXT[],
  hourly_rate DECIMAL(10, 2),
  availability_json JSONB,
  location_preference VARCHAR(50) DEFAULT 'both',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutoring_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  description TEXT,
  requested_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  session_date TIMESTAMP,
  duration_minutes INT,
  meeting_link TEXT,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutoring_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  session_id UUID REFERENCES tutoring_sessions(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tutor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2),
  total_reviews INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now()
);

-- ============================================================
-- RESOURCE LIBRARY
-- ============================================================

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type VARCHAR(50),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  uploaded_by_id UUID REFERENCES users(id),
  file_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  isbn VARCHAR(20),
  course_id UUID REFERENCES courses(id),
  price_new DECIMAL(10, 2),
  price_used DECIMAL(10, 2),
  condition VARCHAR(50),
  edition INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS textbook_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  textbook_id UUID REFERENCES textbooks(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  condition VARCHAR(50),
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS professor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id VARCHAR(255),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  difficulty_rating INT CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  workload_rating INT CHECK (workload_rating >= 1 AND workload_rating <= 5),
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- ACADEMIC Q&A FORUM
-- ============================================================

CREATE TABLE IF NOT EXISTS qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  upvotes INT DEFAULT 0,
  views INT DEFAULT 0,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  answerer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qa_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answerable_type VARCHAR(50),
  answerable_id UUID NOT NULL,
  commenter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS answer_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES qa_answers(id) ON DELETE CASCADE,
  vote_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, answer_id)
);

CREATE TABLE IF NOT EXISTS question_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  vote_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS question_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_creator ON study_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_shared_notes_creator ON shared_notes(creator_id);
CREATE INDEX IF NOT EXISTS idx_shared_notes_course ON shared_notes(course_id);
CREATE INDEX IF NOT EXISTS idx_project_listings_creator ON project_listings(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_listings_status ON project_listings(status);
CREATE INDEX IF NOT EXISTS idx_tutoring_profiles_active ON tutoring_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_course ON resources(course_id);
CREATE INDEX IF NOT EXISTS idx_qa_questions_course ON qa_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_question ON qa_answers(question_id);

-- ============================================================
-- RLS POLICIES FOR PHASE 1
-- ============================================================

-- Course RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses"
ON courses FOR SELECT USING (true);

-- Course Enrollments RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view enrollments"
ON course_enrollments FOR SELECT USING (true);
CREATE POLICY "Users can enroll themselves"
ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study Groups RLS
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view study groups"
ON study_groups FOR SELECT USING (true);
CREATE POLICY "Users can create study groups"
ON study_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their groups"
ON study_groups FOR UPDATE USING (auth.uid() = creator_id);

-- Shared Notes RLS
ALTER TABLE shared_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public notes"
ON shared_notes FOR SELECT USING (is_public = true OR creator_id = auth.uid());
CREATE POLICY "Users can create notes"
ON shared_notes FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Assignments RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrolled students can view course assignments"
ON assignments FOR SELECT USING (true);

-- Tutoring Profiles RLS
ALTER TABLE tutoring_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tutor profiles"
ON tutoring_profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create own tutoring profile"
ON tutoring_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Q&A Questions RLS
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view questions"
ON qa_questions FOR SELECT USING (true);
CREATE POLICY "Users can create questions"
ON qa_questions FOR INSERT WITH CHECK (auth.uid() = asker_id);

-- Q&A Answers RLS
ALTER TABLE qa_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view answers"
ON qa_answers FOR SELECT USING (true);
CREATE POLICY "Users can submit answers"
ON qa_answers FOR INSERT WITH CHECK (auth.uid() = answerer_id);
