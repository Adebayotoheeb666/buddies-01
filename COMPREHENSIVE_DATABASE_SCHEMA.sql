-- ============================================================
-- COMPREHENSIVE DATABASE SCHEMA FOR CAMPUS CONNECT
-- This script creates all tables, enums, triggers, and functions
-- Run this against your Supabase PostgreSQL database
-- ============================================================

-- ============================================================
-- SECTION 1: CORE AUTH & USER MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT auth.uid(),
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  imageUrl TEXT,
  imageId TEXT,
  university_id TEXT UNIQUE,
  graduation_year INT,
  major VARCHAR(255),
  class_year VARCHAR(50),
  interests TEXT[],
  profile_visibility VARCHAR(50) DEFAULT 'public',
  pronouns VARCHAR(50),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  is_graduated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- SECTION 2: SOCIAL FEATURES - POSTS & INTERACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  creator UUID NOT NULL,
  caption TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  imageName TEXT NOT NULL,
  location TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  likes UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (creator) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_creator ON public.posts(creator);
CREATE INDEX idx_posts_created_at ON public.posts(created_at);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = creator);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = creator);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = creator);

-- Saves/Bookmarks
CREATE TABLE IF NOT EXISTS public.saves (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE,
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_saves_user_id ON public.saves(user_id);
CREATE INDEX idx_saves_post_id ON public.saves(post_id);

ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saves" ON public.saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create saves" ON public.saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON public.saves FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SECTION 3: CHAT & MESSAGING SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

CREATE TABLE IF NOT EXISTS public.group_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  icon_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.group_chat_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_chat_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  group_chat_id UUID REFERENCES public.group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((chat_id IS NOT NULL AND group_chat_id IS NULL) OR (chat_id IS NULL AND group_chat_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS public.read_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  group_chat_id UUID REFERENCES public.group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((chat_id IS NOT NULL AND group_chat_id IS NULL) OR (chat_id IS NULL AND group_chat_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Indexes
CREATE INDEX idx_chats_user1_id ON public.chats(user1_id);
CREATE INDEX idx_chats_user2_id ON public.chats(user2_id);
CREATE INDEX idx_chats_last_message_at ON public.chats(last_message_at DESC NULLS LAST);
CREATE INDEX idx_group_chats_created_by_id ON public.group_chats(created_by_id);
CREATE INDEX idx_group_chat_members_user_id ON public.group_chat_members(user_id);
CREATE INDEX idx_group_chat_members_group_chat_id ON public.group_chat_members(group_chat_id);
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_group_chat_id ON public.messages(group_chat_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_read_receipts_message_id ON public.read_receipts(message_id);
CREATE INDEX idx_read_receipts_user_id ON public.read_receipts(user_id);
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_typing_indicators_chat_id ON public.typing_indicators(chat_id);
CREATE INDEX idx_typing_indicators_group_chat_id ON public.typing_indicators(group_chat_id);

-- Chat RLS Policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can view group chats they are members of" ON public.group_chats
  FOR SELECT USING (
    id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid())
    OR is_public = TRUE
  );
CREATE POLICY "Users can create group chats" ON public.group_chats
  FOR INSERT WITH CHECK (auth.uid() = created_by_id);

CREATE POLICY "Users can view group members they share a group with" ON public.group_chat_members
  FOR SELECT USING (
    group_chat_id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can join groups" ON public.group_chat_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages from their chats" ON public.messages
  FOR SELECT USING (
    (chat_id IN (SELECT id FROM public.chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
    OR (group_chat_id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid()))
  );
CREATE POLICY "Users can send messages to their chats" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = deleted_by_id);

CREATE POLICY "Users can view read receipts for their messages" ON public.read_receipts
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM public.messages WHERE sender_id = auth.uid()
      OR (chat_id IN (SELECT id FROM public.chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
      OR (group_chat_id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid()))
    )
  );
CREATE POLICY "Users can mark messages as read" ON public.read_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view message reactions" ON public.message_reactions
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM public.messages WHERE
      (chat_id IN (SELECT id FROM public.chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
      OR (group_chat_id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid()))
    )
  );
CREATE POLICY "Users can add reactions" ON public.message_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.message_reactions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view typing indicators" ON public.typing_indicators
  FOR SELECT USING (
    (chat_id IN (SELECT id FROM public.chats WHERE user1_id = auth.uid() OR user2_id = auth.uid()))
    OR (group_chat_id IN (SELECT group_chat_id FROM public.group_chat_members WHERE user_id = auth.uid()))
  );
CREATE POLICY "Users can set their own typing status" ON public.typing_indicators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all user presence" ON public.user_presence
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can update their own presence" ON public.user_presence
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own presence on update" ON public.user_presence
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- SECTION 4: ACADEMIC FEATURES - COURSES & ENROLLMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.courses (
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

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.course_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.course_communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(community_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_courses_semester ON public.courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_department ON public.courses(department);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON public.course_enrollments(course_id);

-- ============================================================
-- SECTION 5: STUDY GROUPS & COLLABORATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  location VARCHAR(255),
  meeting_time TIMESTAMP,
  max_members INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.study_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_groups_creator ON public.study_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user ON public.study_group_members(user_id);

-- ============================================================
-- SECTION 6: ASSIGNMENTS & TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  assignment_type VARCHAR(50),
  total_points INT,
  is_group_project BOOLEAN DEFAULT false,
  created_by_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assignment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started',
  submission_date TIMESTAMP,
  grade INT,
  notes TEXT,
  UNIQUE(user_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS public.group_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.group_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  tasks_assigned TEXT,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_course ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);

-- ============================================================
-- SECTION 7: NOTE SHARING & COLLABORATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shared_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.note_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES public.shared_notes(id) ON DELETE CASCADE,
  version_number INT,
  content TEXT NOT NULL,
  changed_by_id UUID REFERENCES public.users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collaborative_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  current_content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collab_note_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES public.collaborative_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  access_level VARCHAR(50) DEFAULT 'view',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(note_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.note_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES public.shared_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shared_notes_creator ON public.shared_notes(creator_id);
CREATE INDEX IF NOT EXISTS idx_shared_notes_course ON public.shared_notes(course_id);

-- ============================================================
-- SECTION 8: SKILLS & PROJECT MATCHING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(50) DEFAULT 'beginner',
  endorsements INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.project_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  team_size INT,
  current_members INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'recruiting',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.project_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(255),
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_listings_creator ON public.project_listings(creator_id);
CREATE INDEX IF NOT EXISTS idx_project_listings_status ON public.project_listings(status);

-- ============================================================
-- SECTION 9: PEER TUTORING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tutoring_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  subjects_tutored TEXT[],
  hourly_rate DECIMAL(10, 2),
  availability_json JSONB,
  location_preference VARCHAR(50) DEFAULT 'both',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutoring_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  description TEXT,
  requested_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  session_date TIMESTAMP,
  duration_minutes INT,
  meeting_link TEXT,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutoring_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  session_id UUID REFERENCES public.tutoring_sessions(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2),
  total_reviews INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tutoring_profiles_active ON public.tutoring_profiles(is_active);

-- ============================================================
-- SECTION 10: RESOURCE LIBRARY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type VARCHAR(50),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  uploaded_by_id UUID REFERENCES public.users(id),
  file_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  isbn VARCHAR(20),
  course_id UUID REFERENCES public.courses(id),
  price_new DECIMAL(10, 2),
  price_used DECIMAL(10, 2),
  condition VARCHAR(50),
  edition INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.textbook_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  textbook_id UUID REFERENCES public.textbooks(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  condition VARCHAR(50),
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.professor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id VARCHAR(255),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  difficulty_rating INT CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  workload_rating INT CHECK (workload_rating >= 1 AND workload_rating <= 5),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_course ON public.resources(course_id);

-- ============================================================
-- SECTION 11: ACADEMIC Q&A FORUM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  upvotes INT DEFAULT 0,
  views INT DEFAULT 0,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qa_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE,
  answerer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_by_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qa_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answerable_type VARCHAR(50),
  answerable_id UUID NOT NULL,
  commenter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.answer_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES public.qa_answers(id) ON DELETE CASCADE,
  vote_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, answer_id)
);

CREATE TABLE IF NOT EXISTS public.question_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE,
  vote_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.question_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.qa_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_qa_questions_course ON public.qa_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_qa_answers_question ON public.qa_answers(question_id);

-- ============================================================
-- SECTION 12: SOCIAL - CLASS YEAR GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.class_year_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_year VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  member_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_year_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.class_year_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- ============================================================
-- SECTION 13: SOCIAL - DEPARTMENT NETWORKS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.department_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  member_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES public.department_networks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(network_id, user_id)
);

-- ============================================================
-- SECTION 14: SOCIAL - CAMPUS POLLS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.campus_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  poll_type VARCHAR(50),
  created_by_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.campus_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.campus_polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, poll_id)
);

-- ============================================================
-- SECTION 15: SOCIAL - INTEREST GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.interest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category VARCHAR(255),
  is_private BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  member_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interest_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.interest_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50) DEFAULT 'member',
  UNIQUE(group_id, user_id)
);

-- ============================================================
-- SECTION 16: SOCIAL - MEME POSTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.meme_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  image_url TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 17: SOCIAL - ANONYMOUS CONFESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.anonymous_confessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  moderation_status VARCHAR(50) DEFAULT 'pending',
  submitted_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 18: SOCIAL - STUDENT ORGANIZATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.student_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  founder_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  logo_url TEXT,
  member_count INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.student_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.organization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.student_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INT,
  attendee_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.organization_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'going',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.event_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.organization_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- ============================================================
-- SECTION 19: SOCIAL - RECRUITMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.recruitment_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.student_organizations(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id UUID REFERENCES public.recruitment_periods(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 20: GAMIFICATION FEATURES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  criteria TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_points INT DEFAULT 0,
  current_level INT DEFAULT 1,
  last_updated TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  points INT NOT NULL,
  action VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rank INT,
  points INT,
  period VARCHAR(50),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50),
  points_reward INT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  progress INT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.semester_recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  semester VARCHAR(50),
  summary_data JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 21: CAMPUS FEATURES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.campus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  hours_json JSONB,
  contact_info TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.campus_locations(id) ON DELETE CASCADE,
  building_name VARCHAR(255),
  room_number VARCHAR(50),
  capacity INT,
  has_projector BOOLEAN DEFAULT false,
  has_whiteboard BOOLEAN DEFAULT false,
  has_av_equipment BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.building_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location_id UUID REFERENCES public.campus_locations(id) ON DELETE CASCADE,
  to_location_id UUID REFERENCES public.campus_locations(id) ON DELETE CASCADE,
  distance_meters INT,
  walking_time_minutes INT,
  route_coordinates JSONB,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(from_location_id, to_location_id)
);

CREATE TABLE IF NOT EXISTS public.library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  isbn VARCHAR(20),
  available_count INT DEFAULT 1,
  total_count INT DEFAULT 1,
  location_id UUID REFERENCES public.campus_locations(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.book_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  checkout_date TIMESTAMP DEFAULT now(),
  due_date TIMESTAMP,
  return_date TIMESTAMP,
  is_overdue BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.dining_halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location_id UUID REFERENCES public.campus_locations(id) ON DELETE CASCADE,
  hours_json JSONB,
  cuisine_types TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dining_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dining_hall_id UUID REFERENCES public.dining_halls(id) ON DELETE CASCADE,
  menu_date DATE,
  meal_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dining_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.dining_menus(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  allergen_info TEXT
);

CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  facility_type VARCHAR(50),
  location_id UUID REFERENCES public.campus_locations(id) ON DELETE CASCADE,
  hours_json JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.facility_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  booking_date TIMESTAMP NOT NULL,
  duration_minutes INT,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 22: SAFETY & WELLNESS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES public.campus_locations(id) ON DELETE SET NULL,
  severity VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.safe_walk_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  start_location_id UUID REFERENCES public.campus_locations(id),
  end_location_id UUID REFERENCES public.campus_locations(id),
  status VARCHAR(50) DEFAULT 'pending',
  assigned_volunteer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.location_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.location_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_share_id UUID REFERENCES public.location_shares(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.emergency_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50),
  phone VARCHAR(20),
  email TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wellness_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50),
  contact_info TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.counseling_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wellness_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  mood_rating INT CHECK (mood_rating >= 1 AND mood_rating <= 10),
  stress_level INT CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wellness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  category VARCHAR(50),
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reported_content_id UUID,
  reported_content_type VARCHAR(50),
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.content_reports(id) ON DELETE CASCADE,
  action_type VARCHAR(50),
  action_date TIMESTAMP DEFAULT now(),
  notes TEXT
);

-- ============================================================
-- SECTION 23: CAREER & PROFESSIONAL DEVELOPMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  job_type VARCHAR(50),
  salary_range VARCHAR(50),
  posted_by_id UUID REFERENCES public.users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.internship_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  salary_stipend DECIMAL(10, 2),
  posted_by_id UUID REFERENCES public.users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  website_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES public.user_portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  graduation_year INT,
  current_company VARCHAR(255),
  current_position VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mentorship_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID REFERENCES public.mentorship_pairs(id) ON DELETE CASCADE,
  session_date TIMESTAMP,
  topic VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- SECTION 24: INDEXES FOR GENERAL PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_campus_locations_type ON public.campus_locations(location_type);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON public.job_postings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internship_postings_created_at ON public.internship_postings(created_at DESC);

-- ============================================================
-- SECTION 25: STORAGE BUCKET FOR POSTS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.role() = 'authenticated');

-- ============================================================
-- SECTION 26: HELPER FUNCTIONS
-- ============================================================

-- Function to increment a numeric value (used for likes, votes, etc.)
CREATE OR REPLACE FUNCTION public.increment_counter(table_name TEXT, column_name TEXT, row_id UUID, increment_amount INT DEFAULT 1)
RETURNS INT AS $$
DECLARE
  result INT;
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2 RETURNING %I', table_name, column_name, column_name, column_name)
  INTO result
  USING increment_amount, row_id;
  RETURN COALESCE(result, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's total points
CREATE OR REPLACE FUNCTION public.get_user_total_points(user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN COALESCE((SELECT total_points FROM public.user_points WHERE user_id = $1), 0);
END;
$$ LANGUAGE plpgsql;

-- Function to update user last activity (for streaks)
CREATE OR REPLACE FUNCTION public.update_user_activity(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.attendance_streaks (user_id, current_streak, longest_streak, last_activity_date)
  VALUES ($1, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = CASE WHEN attendance_streaks.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN attendance_streaks.current_streak + 1 ELSE 1 END,
    longest_streak = GREATEST(attendance_streaks.longest_streak, CASE WHEN attendance_streaks.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN attendance_streaks.current_streak + 1 ELSE attendance_streaks.current_streak END),
    last_activity_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SECTION 27: TRIGGERS FOR DATA INTEGRITY
-- ============================================================

-- Trigger to update user updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_user_updated_at();

-- Trigger to update posts updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_posts_updated_at();

-- Trigger to update messages updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_messages_updated_at();

-- Trigger to create user_points entry when new user is created
CREATE OR REPLACE FUNCTION public.create_user_points()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_points (user_id, total_points, current_level)
  VALUES (NEW.id, 0, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_points
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_points();

-- Trigger to create user_presence entry when new user is created
CREATE OR REPLACE FUNCTION public.create_user_presence()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, is_online, last_seen_at)
  VALUES (NEW.id, FALSE, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_presence
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.create_user_presence();

-- Trigger to update chat last_message_at when new message is inserted
CREATE OR REPLACE FUNCTION public.update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.chat_id IS NOT NULL THEN
    UPDATE public.chats SET last_message_at = NOW(), updated_at = NOW() WHERE id = NEW.chat_id;
  END IF;
  IF NEW.group_chat_id IS NOT NULL THEN
    UPDATE public.group_chats SET updated_at = NOW() WHERE id = NEW.group_chat_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_last_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_last_message();

-- Trigger to update shared_notes updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_shared_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shared_notes_updated_at
BEFORE UPDATE ON public.shared_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_shared_notes_updated_at();

-- Trigger to update qa_questions updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_qa_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_qa_questions_updated_at
BEFORE UPDATE ON public.qa_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_qa_questions_updated_at();

-- Trigger to update qa_answers updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_qa_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_qa_answers_updated_at
BEFORE UPDATE ON public.qa_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_qa_answers_updated_at();

-- Trigger to update interest_groups updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_interest_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_interest_groups_updated_at
BEFORE UPDATE ON public.interest_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_interest_groups_updated_at();

-- Trigger to update student_organizations updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_student_organizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_organizations_updated_at
BEFORE UPDATE ON public.student_organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_student_organizations_updated_at();

-- Trigger to update courses updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_courses_updated_at();

-- Trigger to update collaborative_notes updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_collaborative_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_collaborative_notes_updated_at
BEFORE UPDATE ON public.collaborative_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_collaborative_notes_updated_at();

-- Trigger to update study_groups updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_study_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_study_groups_updated_at();

-- Trigger to update user_portfolios updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_portfolios_updated_at
BEFORE UPDATE ON public.user_portfolios
FOR EACH ROW
EXECUTE FUNCTION public.update_user_portfolios_updated_at();

-- ============================================================
-- END OF SCHEMA
-- ============================================================
