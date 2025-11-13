# University Social Network Platform - Implementation Blueprint

## Project Overview

A comprehensive university-specific social media platform designed to connect students, facilitate academic collaboration, integrate campus services, and enhance university life through community engagement.

**Target Users:** Current students, staff, faculty, and alumni
**Authentication:** University .edu email verification required
**Primary Tech Stack:** React, TypeScript, Supabase, Tailwind CSS

---

## Phase 1: Core Foundation (Weeks 1-4)

### 1.1 Enhanced Authentication & User Profiles

#### Database Schema

```sql
-- Extended Users Table
ALTER TABLE users ADD COLUMN (
  university_id TEXT UNIQUE,
  graduation_year INT,
  major VARCHAR(255),
  class_year VARCHAR(50), -- Freshman, Sophomore, Junior, Senior
  bio TEXT,
  interests TEXT[], -- Array of interests
  profile_visibility VARCHAR(50), -- public, friends, private
  pronouns VARCHAR(50),
  verification_status VARCHAR(50), -- verified, pending, unverified
  is_graduated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- University Email Verification
CREATE TABLE email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  verification_token TEXT UNIQUE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- User Interests
CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- User Connections/Following
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(follower_id, following_id)
);
```

#### Components to Create

- `EnhancedSignupForm` - Multi-step signup with university email verification
- `UniversityEmailVerification` - Email verification flow
- `EnhancedProfilePage` - Display interests, major, class year, verification badge
- `ProfileEditModal` - Edit profile information
- `FollowingSystem` - Follow/unfollow functionality

#### API Endpoints

- `POST /auth/signup` - Create account with .edu email verification
- `POST /auth/verify-email` - Verify university email
- `PUT /profiles/{userId}` - Update user profile
- `GET /profiles/{userId}` - Get user profile with stats
- `POST /users/{userId}/follow` - Follow user
- `DELETE /users/{userId}/follow` - Unfollow user
- `GET /users/{userId}/followers` - Get follower list
- `GET /users/{userId}/following` - Get following list

---

### 1.2 Course & Class Integration

#### Database Schema

```sql
-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code VARCHAR(50) NOT NULL, -- CS101, MATH201, etc.
  course_name TEXT NOT NULL,
  professor VARCHAR(255),
  department VARCHAR(255),
  semester VARCHAR(50), -- Fall 2024, Spring 2025, etc.
  section VARCHAR(10),
  credits INT,
  schedule_json JSONB, -- {days: ['MWF'], startTime: '09:00', endTime: '10:30'}
  location VARCHAR(255),
  enrollment_count INT DEFAULT 0,
  max_enrollment INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Course Enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Course Communities
CREATE TABLE course_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Course Community Members
CREATE TABLE course_community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES course_communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50), -- member, moderator, owner
  UNIQUE(community_id, user_id)
);
```

#### Components to Create

- `CourseDirectory` - Browse and search courses
- `CourseCard` - Display course info with enrollment button
- `EnrollCourseModal` - Enroll in course
- `CourseScheduleView` - View schedule, compare with classmates
- `CourseCommunity` - Course-specific community page
- `ClassmateFinder` - Find students in same courses

#### API Endpoints

- `GET /courses` - List all courses (with filters: department, semester, professor)
- `GET /courses/{courseId}` - Get course details
- `POST /enrollments` - Enroll in course
- `DELETE /enrollments/{enrollmentId}` - Drop course
- `GET /users/{userId}/courses` - Get user's enrolled courses
- `GET /courses/{courseId}/classmates` - Get classmates
- `GET /courses/{courseId}/schedule-comparison` - Compare schedules

---

### 1.3 Study Groups & Collaboration

#### Database Schema

```sql
-- Study Groups
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  location VARCHAR(255), -- virtual, library, dorm, etc.
  meeting_time TIMESTAMP,
  max_members INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Study Group Members
CREATE TABLE study_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  role VARCHAR(50), -- member, moderator, organizer
  UNIQUE(group_id, user_id)
);

-- Study Group Messages
CREATE TABLE study_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Virtual Study Rooms
CREATE TABLE virtual_study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  room_code VARCHAR(50) UNIQUE,
  video_call_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `StudyGroupBrowser` - Browse and search study groups
- `CreateStudyGroupModal` - Create new study group
- `StudyGroupDetail` - View group details, member list, chat
- `StudyGroupChat` - Real-time chat for study groups
- `VirtualStudyRoom` - Launch virtual study sessions
- `JoinStudyGroup` - Join group functionality

#### API Endpoints

- `GET /study-groups` - List study groups (filters: course, location, time)
- `POST /study-groups` - Create study group
- `GET /study-groups/{groupId}` - Get group details
- `POST /study-groups/{groupId}/join` - Join group
- `DELETE /study-groups/{groupId}/members/{userId}` - Leave group
- `POST /study-groups/{groupId}/messages` - Send message
- `GET /study-groups/{groupId}/messages` - Get messages
- `POST /study-groups/{groupId}/virtual-room` - Create virtual room

---

### 1.4 Assignment & Deadline Tracking

#### Database Schema

```sql
-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  assignment_type VARCHAR(50), -- homework, project, exam, quiz
  total_points INT,
  is_group_project BOOLEAN DEFAULT false,
  created_by_id UUID REFERENCES users(id), -- TA or Professor
  created_at TIMESTAMP DEFAULT now()
);

-- User Assignment Tracking
CREATE TABLE assignment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  status VARCHAR(50), -- not_started, in_progress, completed, submitted
  submission_date TIMESTAMP,
  grade INT,
  notes TEXT,
  UNIQUE(user_id, assignment_id)
);

-- Group Project Coordination
CREATE TABLE group_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Group Project Members
CREATE TABLE group_project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES group_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50), -- member, lead
  tasks_assigned TEXT,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Assignment Deadlines (for reminders)
CREATE TABLE assignment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP NOT NULL,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `AssignmentTracker` - View all assignments with status
- `DeadlineCountdown` - Show days/hours until deadline
- `GroupProjectBoard` - Kanban board for project coordination
- `AssignmentReminders` - Set and manage reminders
- `ExamCountdown` - Special countdown for exams

#### API Endpoints

- `GET /assignments` - List user's assignments (filters: course, type, status)
- `POST /assignments/{assignmentId}/track` - Track assignment progress
- `PUT /assignments/{assignmentId}/status` - Update assignment status
- `GET /assignments/{assignmentId}/deadline` - Get deadline info
- `POST /reminders` - Create reminder
- `GET /group-projects/{projectId}` - Get project details
- `PUT /group-projects/{projectId}/tasks` - Update task assignments

---

## Phase 2: Academic Collaboration (Weeks 5-8)

### 2.1 Note Sharing & Collaborative Note-Taking

#### Database Schema

```sql
-- Shared Notes
CREATE TABLE shared_notes (
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

-- Note Versions (version control)
CREATE TABLE note_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES shared_notes(id) ON DELETE CASCADE,
  version_number INT,
  content TEXT NOT NULL,
  changed_by_id UUID REFERENCES users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Collaborative Notes
CREATE TABLE collaborative_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Collaborative Note Contributors
CREATE TABLE collab_note_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES collaborative_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  access_level VARCHAR(50), -- view, edit, admin
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(note_id, user_id)
);

-- Note Comments
CREATE TABLE note_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES shared_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `NoteSharing` - Upload and share notes
- `NoteVersionControl` - View and restore previous versions
- `CollaborativeNoteEditor` - Real-time collaborative editing
- `NoteLibrary` - Browse shared notes by course
- `NoteComments` - Comment on notes

#### API Endpoints

- `POST /notes` - Create/upload note
- `GET /notes` - List notes (filters: course, tags, creator)
- `GET /notes/{noteId}` - Get note details
- `POST /notes/{noteId}/share` - Share with specific users
- `GET /notes/{noteId}/versions` - Get version history
- `PUT /notes/{noteId}/restore` - Restore to previous version
- `POST /collaborative-notes` - Create collaborative note
- `PATCH /collaborative-notes/{noteId}` - Update collaborative note
- `POST /notes/{noteId}/comments` - Add comment

---

### 2.2 Project Matching System

#### Database Schema

```sql
-- Skills
CREATE TABLE skills (
  id UUID PRIMARYKey DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50), -- technical, soft, design, etc.
  created_at TIMESTAMP DEFAULT now()
);

-- User Skills
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(50), -- beginner, intermediate, advanced, expert
  endorsements INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Projects Needing Team Members
CREATE TABLE project_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[],
  team_size INT,
  current_members INT,
  status VARCHAR(50), -- recruiting, in_progress, completed
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Project Team Members
CREATE TABLE project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES project_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(255),
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Project Collaboration Board
CREATE TABLE project_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES project_listings(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Project Tasks
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES project_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to_id UUID REFERENCES users(id),
  status VARCHAR(50), -- todo, in_progress, done
  priority VARCHAR(50), -- low, medium, high
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `SkillProfile` - Add and showcase skills
- `ProjectListings` - Browse projects needing team members
- `CreateProjectListing` - Post project and required skills
- `ProjectMatcher` - AI-powered skill matching for projects
- `ProjectBoard` - Kanban board for project collaboration
- `TeamMembersList` - Manage project team

#### API Endpoints

- `POST /skills` - Add skill to profile
- `GET /skills` - Get user skills
- `DELETE /skills/{skillId}` - Remove skill
- `POST /projects` - Create project listing
- `GET /projects` - List projects (filters: skills, status, team size)
- `GET /projects/{projectId}` - Get project details
- `POST /projects/{projectId}/apply` - Apply to join project
- `POST /projects/{projectId}/members` - Accept member to project
- `GET /projects/{projectId}/matches` - Get matching team members
- `POST /projects/{projectId}/tasks` - Create task
- `PATCH /projects/{projectId}/tasks/{taskId}` - Update task status

---

### 2.3 Peer Tutoring Platform

#### Database Schema

```sql
-- Tutoring Profiles
CREATE TABLE tutoring_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  subjects_tutored TEXT[],
  hourly_rate DECIMAL(10, 2),
  availability_json JSONB, -- {monday: ['09:00-17:00'], tuesday: ...}
  location_preference VARCHAR(50), -- in_person, virtual, both
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Tutoring Requests
CREATE TABLE tutoring_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  description TEXT,
  requested_date TIMESTAMP,
  status VARCHAR(50), -- pending, accepted, completed, cancelled
  created_at TIMESTAMP DEFAULT now()
);

-- Tutoring Sessions
CREATE TABLE tutoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  session_date TIMESTAMP,
  duration_minutes INT,
  meeting_link TEXT, -- for virtual sessions
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Tutoring Reviews
CREATE TABLE tutoring_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  session_id UUID REFERENCES tutoring_sessions(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Tutor Ratings (aggregate)
CREATE TABLE tutor_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  average_rating DECIMAL(3, 2),
  total_reviews INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `TutoringProfileSetup` - Create tutoring profile with subjects
- `TutoringBrowser` - Browse tutors by subject and rating
- `TutorCard` - Display tutor info, availability, reviews
- `RequestTutoringModal` - Request tutoring session
- `TutoringCalendar` - View availability and schedule
- `SessionNotes` - Take notes during/after session
- `ReviewTutor` - Leave review and rating
- `TutorDashboard` - Manage sessions and requests

#### API Endpoints

- `POST /tutoring/profiles` - Create tutoring profile
- `GET /tutors` - List tutors (filters: subject, rating, availability)
- `GET /tutors/{tutorId}` - Get tutor details and reviews
- `POST /tutoring/requests` - Request tutoring session
- `PATCH /tutoring/requests/{requestId}` - Accept/decline request
- `POST /tutoring/sessions/{sessionId}/complete` - Mark session complete
- `POST /tutoring/reviews` - Leave review
- `GET /tutoring/profiles/{userId}/rating` - Get tutor rating

---

### 2.4 Resource Library

#### Database Schema

```sql
-- Resource Library
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type VARCHAR(50), -- textbook, notes, guide, video, etc.
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  uploaded_by_id UUID REFERENCES users(id),
  file_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Textbook Marketplace
CREATE TABLE textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  isbn VARCHAR(20),
  course_id UUID REFERENCES courses(id),
  price_new DECIMAL(10, 2),
  price_used DECIMAL(10, 2),
  condition VARCHAR(50), -- new, like_new, good, acceptable
  edition INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Textbook Listings
CREATE TABLE textbook_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  textbook_id UUID REFERENCES textbooks(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  condition VARCHAR(50),
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Professor Reviews
CREATE TABLE professor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id VARCHAR(255) NOT NULL, -- Professor name or ID
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  difficulty_rating INT CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  workload_rating INT CHECK (workload_rating >= 1 AND workload_rating <= 5),
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `ResourceLibrary` - Browse resources by course
- `UploadResource` - Upload course materials
- `TextbookMarketplace` - Browse and buy/sell textbooks
- `TextbookListing` - Create listing for textbook
- `ProfessorReviews` - Browse and write reviews
- `AnonymousReviewForm` - Anonymous review submission

#### API Endpoints

- `POST /resources` - Upload resource
- `GET /resources` - List resources (filters: course, type, tags)
- `GET /resources/{resourceId}` - Get resource details
- `POST /resources/{resourceId}/download` - Download resource
- `POST /textbooks` - Add textbook listing
- `GET /textbooks` - Search textbooks
- `GET /textbooks/{textbookId}/listings` - Get selling listings
- `POST /professor-reviews` - Submit professor review
- `GET /professors/{professorId}/reviews` - Get professor reviews

---

### 2.5 Academic Q&A Forum

#### Database Schema

```sql
-- Q&A Questions
CREATE TABLE qa_questions (
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

-- Q&A Answers
CREATE TABLE qa_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  answerer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false, -- verified by professor/TA
  verification_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Q&A Comments
CREATE TABLE qa_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answerable_type VARCHAR(50), -- question, answer
  answerable_id UUID NOT NULL, -- references either question or answer
  commenter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Answer Votes
CREATE TABLE answer_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES qa_answers(id) ON DELETE CASCADE,
  vote_type VARCHAR(50), -- upvote, downvote
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, answer_id)
);

-- Question Votes
CREATE TABLE question_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  vote_type VARCHAR(50), -- upvote, downvote
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Follow Questions
CREATE TABLE question_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES qa_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, question_id)
);
```

#### Components to Create

- `QAForum` - Main forum page with question list
- `AskQuestion` - Create new question
- `QuestionDetail` - View question and answers
- `AnswerForm` - Submit answer
- `VotingSystem` - Upvote/downvote questions and answers
- `VerificationBadge` - Show verified answers from professor/TA
- `QuestionSearch` - Search questions by keyword
- `FollowQuestion` - Get notifications for answers

#### API Endpoints

- `POST /qa/questions` - Create question
- `GET /qa/questions` - List questions (filters: course, tags, unanswered)
- `GET /qa/questions/{questionId}` - Get question details
- `POST /qa/questions/{questionId}/answers` - Submit answer
- `GET /qa/questions/{questionId}/answers` - Get answers sorted by votes
- `POST /qa/answers/{answerId}/verify` - Verify answer (professor/TA only)
- `POST /qa/answers/{answerId}/upvote` - Upvote answer
- `POST /qa/questions/{questionId}/follow` - Follow question
- `GET /qa/search` - Search questions

---

## Phase 3: Campus Life & Services (Weeks 9-12)

### 3.1 Interactive Campus Map & Navigation

#### Database Schema

```sql
-- Campus Locations
CREATE TABLE campus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_type VARCHAR(50), -- building, classroom, cafe, library, etc.
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  hours_json JSONB, -- {monday: {opens: '08:00', closes: '22:00'}, ...}
  contact_info JSONB, -- {phone, email, website}
  created_at TIMESTAMP DEFAULT now()
);

-- Classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES campus_locations(id),
  building_name VARCHAR(255),
  room_number VARCHAR(50),
  capacity INT,
  has_projector BOOLEAN,
  has_whiteboard BOOLEAN,
  has_computers BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);

-- Building Routes
CREATE TABLE building_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location_id UUID REFERENCES campus_locations(id),
  to_location_id UUID REFERENCES campus_locations(id),
  distance_meters INT,
  walking_time_minutes INT,
  route_description TEXT,
  route_coordinates JSONB, -- Array of {lat, lng}
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `InteractiveCampusMap` - Map component with markers
- `LocationDetail` - Show location info, hours, contact
- `ClassroomFinder` - Find classrooms by building/number
- `RouteCalculator` - Calculate shortest route between locations
- `NavigationDirections` - Turn-by-turn directions
- `FavoritesLocations` - Save favorite locations
- `BuildingHours` - Display building hours

#### API Endpoints

- `GET /campus/locations` - List all locations
- `GET /campus/locations/{locationId}` - Get location details
- `GET /campus/classrooms` - Find classrooms
- `GET /campus/routes` - Calculate route between locations
- `GET /campus/locations/search` - Search by name
- `POST /campus/favorites` - Save favorite location

---

### 3.2 Dining Services Integration

#### Database Schema

```sql
-- Dining Halls
CREATE TABLE dining_halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_id UUID REFERENCES campus_locations(id),
  capacity INT,
  accepts_meal_plan BOOLEAN,
  accepts_cash BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);

-- Menus
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dining_hall_id UUID REFERENCES dining_halls(id) ON DELETE CASCADE,
  menu_date DATE NOT NULL,
  meal_type VARCHAR(50), -- breakfast, lunch, dinner
  created_at TIMESTAMP DEFAULT now()
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  dietary_info TEXT[], -- vegetarian, vegan, gluten-free, etc.
  created_at TIMESTAMP DEFAULT now()
);

-- Dining Wait Times
CREATE TABLE dining_wait_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dining_hall_id UUID REFERENCES dining_halls(id) ON DELETE CASCADE,
  reported_by_id UUID REFERENCES users(id),
  wait_time_minutes INT,
  reported_at TIMESTAMP DEFAULT now()
);

-- Meal Plan
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50), -- unlimited, 14_meals, 10_meals, etc.
  remaining_meals INT,
  remaining_swipes INT,
  balance DECIMAL(10, 2),
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Dining Reviews
CREATE TABLE dining_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dining_hall_id UUID REFERENCES dining_halls(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  food_quality_rating INT,
  cleanliness_rating INT,
  service_rating INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Food Reviews
CREATE TABLE food_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id),
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `DiningHallsList` - Browse dining halls
- `MenuView` - View daily menus
- `WaitTimeTracker` - Report and view wait times
- `MealPlanTracker` - Track remaining meals/balance
- `DiningReviews` - View and write reviews
- `FoodRatings` - Rate specific food items
- `DiningSearch` - Find dining options by dietary needs

#### API Endpoints

- `GET /dining/halls` - List all dining halls
- `GET /dining/halls/{hallId}` - Get hall details
- `GET /dining/menus/{hallId}` - Get menu for date
- `POST /dining/wait-times` - Report wait time
- `GET /dining/wait-times/{hallId}` - Get current wait time
- `GET /users/{userId}/meal-plan` - Get meal plan info
- `POST /dining/reviews` - Leave dining review
- `POST /dining/food-reviews` - Rate food item
- `GET /dining/search` - Search dining options

---

### 3.3 Library System Integration

#### Database Schema

```sql
-- Library Catalog
CREATE TABLE library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  isbn VARCHAR(20),
  catalog_number VARCHAR(50),
  published_year INT,
  total_copies INT,
  available_copies INT,
  location VARCHAR(255),
  subject TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Book Checkouts
CREATE TABLE book_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES library_books(id),
  checkout_date TIMESTAMP,
  due_date TIMESTAMP,
  return_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Study Room Bookings
CREATE TABLE study_room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_name VARCHAR(255),
  booking_date DATE,
  start_time TIME,
  end_time TIME,
  capacity INT,
  amenities TEXT[],
  status VARCHAR(50), -- confirmed, cancelled
  created_at TIMESTAMP DEFAULT now()
);

-- Library Zones
CREATE TABLE library_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name VARCHAR(255),
  noise_level VARCHAR(50), -- quiet, moderate, collaborative
  equipment_available TEXT[],
  opening_hours_json JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Book Holds
CREATE TABLE book_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES library_books(id),
  position_in_queue INT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `LibrarySearch` - Search library catalog
- `BookDetail` - View book info, availability, location
- `CheckoutHistory` - View checkout history
- `StudyRoomBooking` - Browse and book study rooms
- `RoomAmenities` - Filter rooms by amenities
- `QuietZoneIndicator` - Show noise levels in library zones
- `BookHolds` - Place holds on books

#### API Endpoints

- `GET /library/books` - Search library catalog
- `GET /library/books/{bookId}` - Get book details
- `GET /library/books/{bookId}/availability` - Check availability
- `POST /library/checkouts` - Checkout book
- `GET /users/{userId}/checkouts` - Get user's checkouts
- `POST /library/study-rooms` - Book study room
- `GET /library/study-rooms` - List available study rooms
- `POST /library/holds` - Place book hold

---

### 3.4 Facilities Booking

#### Database Schema

```sql
-- Facilities
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  facility_type VARCHAR(50), -- gym, sports_court, club_space, meeting_room
  location_id UUID REFERENCES campus_locations(id),
  capacity INT,
  hourly_rate DECIMAL(10, 2),
  description TEXT,
  amenities TEXT[],
  rules_and_policies TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Equipment
CREATE TABLE facility_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  equipment_name VARCHAR(255),
  quantity INT,
  condition VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

-- Facility Bookings
CREATE TABLE facility_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  booking_date DATE,
  start_time TIME,
  end_time TIME,
  purpose TEXT,
  number_of_people INT,
  status VARCHAR(50), -- pending, confirmed, cancelled
  created_at TIMESTAMP DEFAULT now()
);

-- Facility Reviews
CREATE TABLE facility_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `FacilitiesBrowser` - Browse available facilities
- `FacilityDetail` - View facility info, amenities, reviews
- `BookingCalendar` - Check availability and book
- `BookingConfirmation` - Confirm and manage bookings
- `FacilityReviews` - View and write reviews
- `EquipmentChecklist` - View available equipment

#### API Endpoints

- `GET /facilities` - List facilities (filters: type, location, date)
- `GET /facilities/{facilityId}` - Get facility details
- `GET /facilities/{facilityId}/availability` - Check availability
- `POST /facilities/{facilityId}/bookings` - Create booking
- `GET /users/{userId}/facility-bookings` - Get user's bookings
- `PATCH /bookings/{bookingId}` - Modify/cancel booking
- `POST /facilities/{facilityId}/reviews` - Leave review

---

## Phase 4: Social & Networking (Weeks 13-16)

### 4.1 Student Networking & Social Features

#### Database Schema

```sql
-- Class Year Groups
CREATE TABLE class_year_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_year VARCHAR(50) NOT NULL, -- Freshman, Sophomore, Junior, Senior
  created_at TIMESTAMP DEFAULT now()
);

-- Class Year Group Members
CREATE TABLE class_year_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES class_year_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Major/Department Networks
CREATE TABLE department_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Department Network Members
CREATE TABLE department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES department_networks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(network_id, user_id)
);

-- International Student Hub
CREATE TABLE international_student_hub (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_of_origin VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_spoken TEXT[],
  needs_visa_support BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);

-- Commuter Network
CREATE TABLE commuter_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  commute_area VARCHAR(255),
  interested_in_carpool BOOLEAN,
  parking_info TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Campus Polls
CREATE TABLE campus_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  poll_type VARCHAR(50), -- campus_issue, event_preference, general
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);

-- Poll Options
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES campus_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  vote_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Poll Votes
CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES campus_polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Interest-Based Groups
CREATE TABLE interest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  interests TEXT[],
  creator_id UUID REFERENCES users(id),
  member_count INT DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Interest Group Members
CREATE TABLE interest_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES interest_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Meme Board
CREATE TABLE meme_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT,
  likes INT DEFAULT 0,
  shares INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Anonymous Confessions
CREATE TABLE anonymous_confessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  anonymity_status VARCHAR(50), -- fully_anonymous, visible_to_friends
  moderation_status VARCHAR(50), -- pending, approved, rejected
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `ClassYearNetwork` - Connect with class year groups
- `DepartmentNetwork` - Browse department communities
- `InternationalStudentHub` - Resources and networking for international students
- `CommuterNetwork` - Find carpools, parking info
- `CampusPolls` - Create and vote on polls
- `InterestGroups` - Create/join groups by interest
- `MemeBoard` - Share campus humor
- `AnonymousConfessions` - Post anonymous confessions (moderated)
- `NetworkDiscovery` - Discover networking opportunities

#### API Endpoints

- `GET /networks/class-year` - Get class year group
- `POST /networks/class-year/join` - Join class year group
- `GET /networks/departments` - List department networks
- `POST /networks/departments/{networkId}/join` - Join department network
- `GET /hubs/international` - Get international student hub
- `GET /networks/commuters` - Find carpool opportunities
- `POST /networks/commuters/join` - Join commuter network
- `GET /polls` - List polls
- `POST /polls` - Create poll
- `POST /polls/{pollId}/vote` - Vote on poll
- `GET /groups/interest` - List interest groups
- `POST /groups/interest` - Create interest group
- `POST /groups/interest/{groupId}/join` - Join group
- `POST /meme-board` - Post meme
- `GET /meme-board` - View meme board
- `POST /confessions` - Post anonymous confession

---

### 4.2 Club & Organization Management

#### Database Schema

```sql
-- Student Organizations
CREATE TABLE student_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  acronym VARCHAR(50),
  description TEXT,
  category VARCHAR(50), -- academic, cultural, sports, greek, etc.
  president_id UUID REFERENCES users(id),
  email TEXT,
  meeting_schedule TEXT,
  total_members INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Organization Members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES student_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50), -- member, officer, president
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Organization Events
CREATE TABLE organization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES student_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location_id UUID REFERENCES campus_locations(id),
  event_type VARCHAR(50), -- meeting, social, recruitment, workshop
  capacity INT,
  rsvp_count INT DEFAULT 0,
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES organization_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50), -- going, interested, not_going
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Event Check-ins (QR code attendance)
CREATE TABLE event_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES organization_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP DEFAULT now()
);

-- Organization Recruitment
CREATE TABLE recruitment_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES student_organizations(id),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Recruitment Applications
CREATE TABLE recruitment_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruitment_period_id UUID REFERENCES recruitment_periods(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50), -- applied, interviewed, accepted, rejected
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `ClubDirectory` - Browse all organizations
- `ClubDetail` - View club info, members, events
- `JoinClub` - Join/leave organizations
- `CreateOrganization` - Create new organization
- `OrganizationDashboard` - Manage club (for officers)
- `EventManagement` - Create and manage club events
- `EventRSVP` - RSVP to events
- `EventCheckIn` - QR code check-in system
- `RecruitmentPeriod` - Manage club recruitment
- `MeetingNotifications` - Get meeting reminders

#### API Endpoints

- `GET /organizations` - List all clubs
- `GET /organizations/{orgId}` - Get club details
- `POST /organizations` - Create organization
- `POST /organizations/{orgId}/join` - Join club
- `DELETE /organizations/{orgId}/members/{userId}` - Leave club
- `GET /organizations/{orgId}/events` - Get club events
- `POST /organizations/{orgId}/events` - Create event
- `POST /organizations/{orgId}/events/{eventId}/rsvp` - RSVP to event
- `POST /organizations/{orgId}/events/{eventId}/check-in` - Check in to event
- `POST /organizations/{orgId}/recruitment` - Start recruitment period
- `POST /organizations/{orgId}/recruitment/apply` - Apply to organization

---

## Phase 5: Career Development & Professional Growth (Weeks 17-20)

### 5.1 Career Services & Job Board

#### Database Schema

```sql
-- Job & Internship Postings
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_type VARCHAR(50), -- internship, full-time, part-time, contract
  description TEXT,
  requirements TEXT[],
  location VARCHAR(255),
  salary_range TEXT,
  application_deadline DATE,
  posted_by_id UUID REFERENCES users(id),
  application_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50), -- applied, reviewing, interview, accepted, rejected
  applied_at TIMESTAMP DEFAULT now(),
  UNIQUE(applicant_id, job_posting_id)
);

-- Internship Board
CREATE TABLE internship_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255),
  position_title VARCHAR(255),
  description TEXT,
  semester VARCHAR(50),
  gpa_requirement DECIMAL(3, 2),
  major_preferences TEXT[],
  deadline DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Application Tracking
CREATE TABLE application_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES job_postings(id),
  company_name VARCHAR(255),
  position_title VARCHAR(255),
  status VARCHAR(50), -- applied, phone_screen, interview, offer, rejected, withdrawn
  status_date TIMESTAMP,
  notes TEXT,
  deadline_reminder BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Career Fair Registrations
CREATE TABLE career_fairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location_id UUID REFERENCES campus_locations(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Career Fair Companies
CREATE TABLE career_fair_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_fair_id UUID REFERENCES career_fairs(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  booth_number VARCHAR(50),
  description TEXT,
  hiring_positions TEXT[],
  recruiter_info JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Schedule Meetings
CREATE TABLE career_fair_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_fair_id UUID REFERENCES career_fairs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES career_fair_companies(id),
  meeting_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Resume/Portfolio
CREATE TABLE user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  resume_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  personal_website TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Portfolio Projects
CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES user_portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  project_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Skills Endorsements
CREATE TABLE skill_endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endorser_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, endorser_id, skill_id)
);
```

#### Components to Create

- `JobBoard` - Browse job/internship postings
- `JobFilters` - Filter by company, position, deadline
- `JobDetail` - View job details and apply
- `ApplicationTracker` - Track all applications
- `DeadlineReminders` - Get reminders for application deadlines
- `CareerFairSchedule` - View companies and schedule meetings
- `ResumeBuilder` - Create/upload resume
- `PortfolioShowcase` - Display projects and experience
- `SkillEndorsements` - Endorse and get endorsed for skills

#### API Endpoints

- `GET /jobs` - List job postings (filters: type, location, deadline)
- `GET /jobs/{jobId}` - Get job details
- `POST /jobs/{jobId}/apply` - Apply to job
- `GET /users/{userId}/applications` - Get user's applications
- `PATCH /applications/{appId}` - Update application status
- `GET /internships` - List internship openings
- `GET /career-fairs` - List upcoming career fairs
- `GET /career-fairs/{fairId}/companies` - Get companies at fair
- `POST /career-fairs/{fairId}/schedule-meeting` - Schedule meeting
- `PUT /portfolios/{userId}` - Update portfolio
- `POST /portfolios/{userId}/projects` - Add portfolio project

---

### 5.2 Alumni Network & Mentorship

#### Database Schema

```sql
-- Alumni Profiles
CREATE TABLE alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  graduation_year INT NOT NULL,
  current_company VARCHAR(255),
  current_position VARCHAR(255),
  industry VARCHAR(255),
  willing_to_mentor BOOLEAN DEFAULT false,
  expertise_areas TEXT[],
  availability JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Mentorship Relationships
CREATE TABLE mentorship_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT,
  started_at TIMESTAMP DEFAULT now(),
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

-- Mentorship Sessions
CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID REFERENCES mentorship_pairs(id) ON DELETE CASCADE,
  session_date TIMESTAMP,
  topic TEXT,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Mentorship Feedback
CREATE TABLE mentorship_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID REFERENCES mentorship_pairs(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Career Path Profiles
CREATE TABLE career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID REFERENCES alumni_profiles(id),
  path_description TEXT,
  key_milestones TEXT[],
  challenges_overcome TEXT,
  advice TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Networking Events
CREATE TABLE alumni_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type VARCHAR(50), -- networking, panel, workshop, reunion
  event_date TIMESTAMP,
  location_id UUID REFERENCES campus_locations(id),
  organizer_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Alumni Network Groups
CREATE TABLE alumni_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  industry_focus VARCHAR(255),
  created_at TIMESTAMP DEFAULT now()
);

-- Alumni Network Members
CREATE TABLE alumni_network_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID REFERENCES alumni_networks(id) ON DELETE CASCADE,
  alumni_id UUID REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(network_id, alumni_id)
);
```

#### Components to Create

- `AlumniDirectory` - Browse alumni by company, industry
- `MentorshipRequest` - Request mentor
- `MentorDashboard` - Manage mentees and sessions
- `CareerPathStories` - Read alumni career journeys
- `AlumniNetworks` - Join alumni networks by industry
- `NetworkingEvents` - Discover alumni networking events
- `MentorshipFeedback` - Rate mentor relationships
- `IndustryNetworks` - Connect with alumni in your field

#### API Endpoints

- `GET /alumni` - List alumni (filters: industry, company, graduation year)
- `GET /alumni/{alumniId}` - Get alumni profile
- `POST /mentorship/requests` - Request mentorship
- `GET /mentorship/matches` - Get mentor recommendations
- `POST /mentorship/pairs/{pairId}/sessions` - Log mentorship session
- `GET /alumni/networks` - List alumni networks
- `POST /alumni/networks/{networkId}/join` - Join network
- `GET /alumni/events` - List alumni events
- `GET /career-paths` - Browse career path stories

---

### 5.3 Research & Startup Opportunities

#### Database Schema

```sql
-- Research Opportunities
CREATE TABLE research_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id VARCHAR(255),
  title TEXT NOT NULL,
  description TEXT,
  lab_name VARCHAR(255),
  required_skills TEXT[],
  position_type VARCHAR(50), -- research_assistant, grad_student, undergrad
  start_date DATE,
  duration VARCHAR(50), -- semester, year, ongoing
  stipend DECIMAL(10, 2),
  applications_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Research Applications
CREATE TABLE research_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES research_opportunities(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cv_url TEXT,
  motivation_statement TEXT,
  status VARCHAR(50), -- applied, interview, accepted, rejected
  applied_at TIMESTAMP DEFAULT now(),
  UNIQUE(opportunity_id, applicant_id)
);

-- Research Projects
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  research_area VARCHAR(255),
  start_date DATE,
  end_date DATE,
  outcomes TEXT,
  publications TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

-- Startup Opportunities
CREATE TABLE startup_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  startup_name VARCHAR(255),
  description TEXT,
  stage VARCHAR(50), -- idea, prototype, mvp, funded
  looking_for TEXT[], -- co-founder, investor, engineer, designer
  skills_needed TEXT[],
  equity_offered DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT now()
);

-- Startup Team Members
CREATE TABLE startup_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startup_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50),
  equity_percent DECIMAL(5, 2),
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(startup_id, user_id)
);

-- Co-Founder Matching
CREATE TABLE cofounder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  entrepreneurial_experience TEXT,
  industry_interest TEXT[],
  looking_for_cofounders BOOLEAN DEFAULT false,
  ideal_cofounder_description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Pitch Competitions
CREATE TABLE pitch_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  competition_date TIMESTAMP,
  prize_pool DECIMAL(10, 2),
  max_teams INT,
  registration_deadline DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Pitch Competition Registrations
CREATE TABLE pitch_competition_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES pitch_competitions(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startup_opportunities(id),
  team_lead_id UUID REFERENCES users(id),
  pitch_title TEXT,
  pitch_video_url TEXT,
  status VARCHAR(50), -- registered, accepted, presenting, ranked
  ranking INT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `ResearchBrowser` - Browse research opportunities
- `ResearchApplication` - Apply to research positions
- `ResearchPortfolio` - Showcase research projects
- `StartupBrowser` - Browse startup opportunities
- `CreateStartup` - Post startup idea
- `CoFounderMatching` - Find co-founder matches
- `StartupTeamDashboard` - Manage startup team
- `PitchCompetitions` - Browse and register for competitions

#### API Endpoints

- `GET /research` - List research opportunities
- `GET /research/{opportunityId}` - Get opportunity details
- `POST /research/{opportunityId}/apply` - Apply to research
- `POST /research/projects` - Add research project
- `GET /startups` - List startup opportunities
- `POST /startups` - Create startup
- `GET /cofounder-matches` - Get co-founder recommendations
- `POST /startups/{startupId}/members` - Add team member
- `GET /pitch-competitions` - List competitions
- `POST /pitch-competitions/{competitionId}/register` - Register startup

---

## Phase 6: Safety, Wellness & Administrative Features (Weeks 21-24)

### 6.1 Safety & Emergency Features

#### Database Schema

```sql
-- Safety Alerts
CREATE TABLE safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50), -- crime, weather, emergency, other
  title TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES campus_locations(id),
  severity VARCHAR(50), -- low, medium, high, critical
  issued_by_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Safe Walk Program
CREATE TABLE safe_walk_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  escort_id UUID REFERENCES users(id),
  from_location VARCHAR(255),
  to_location VARCHAR(255),
  request_time TIMESTAMP,
  completion_time TIMESTAMP,
  status VARCHAR(50), -- pending, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT now()
);

-- Location Sharing
CREATE TABLE location_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sharer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Real-time Location Tracking (for safe walk)
CREATE TABLE location_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  safe_walk_id UUID REFERENCES safe_walk_requests(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Emergency Contacts
CREATE TABLE emergency_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50), -- campus_police, counseling, health, crisis
  service_name VARCHAR(255),
  phone VARCHAR(20),
  email TEXT,
  available_hours TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `SafetyAlerts` - Display active alerts
- `SafeWalkRequest` - Request walking companion
- `SafeWalkDashboard` - Accept and track walks
- `LocationSharing` - Share location with friends
- `EmergencyContacts` - Quick access to resources
- `AlertNotifications` - Real-time alert notifications

---

### 6.2 Mental Health & Wellness

#### Database Schema

```sql
-- Wellness Resources
CREATE TABLE wellness_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type VARCHAR(50), -- counseling, meditation, exercise, nutrition
  url TEXT,
  is_campus_resource BOOLEAN,
  created_at TIMESTAMP DEFAULT now()
);

-- Counseling Appointments
CREATE TABLE counseling_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  counselor_name VARCHAR(255),
  appointment_date TIMESTAMP,
  status VARCHAR(50), -- scheduled, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Wellness Check-Ins
CREATE TABLE wellness_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_score INT CHECK (mood_score >= 1 AND mood_score <= 10),
  stress_level INT CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_hours DECIMAL(3, 1),
  exercise_minutes INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Wellness Goals
CREATE TABLE wellness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50), -- meditation, exercise, sleep, mental_health
  target_value TEXT,
  frequency VARCHAR(50), -- daily, weekly, monthly
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Peer Support Forums
CREATE TABLE support_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic VARCHAR(50), -- mental_health, stress, anxiety, relationships
  is_moderated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Support Forum Threads
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES support_forums(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Forum Replies
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  replier_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  is_helpful INT DEFAULT 0, -- Count of helpful votes
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `WellnessResourceLibrary` - Browse resources
- `CounselingAppointments` - Book/track appointments
- `WellnessTracking` - Log daily check-ins
- `WellnessGoals` - Set and track wellness goals
- `BreakReminders` - Study break suggestions
- `SupportForums` - Anonymous peer support
- `MoodTracking` - Track mood over time
- `StressLevel` - Monitor and manage stress

---

### 6.3 Academic Integrity & Moderation

#### Database Schema

```sql
-- Content Moderation
CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_content_id UUID,
  reported_content_type VARCHAR(50), -- post, comment, assignment, confession
  reporter_id UUID REFERENCES users(id),
  reason VARCHAR(255),
  description TEXT,
  status VARCHAR(50), -- pending, reviewing, approved, rejected
  reviewed_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Academic Integrity Flags
CREATE TABLE integrity_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flagged_user_id UUID REFERENCES users(id),
  flag_type VARCHAR(50), -- plagiarism, cheating, unauthorized_sharing
  description TEXT,
  evidence_link TEXT,
  status VARCHAR(50), -- reported, investigated, resolved
  resolved_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Moderation Actions
CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID,
  moderator_id UUID REFERENCES users(id),
  action_type VARCHAR(50), -- warned, removed, suspended, banned
  reason TEXT,
  appeal_allowed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- User Appeals
CREATE TABLE appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  moderation_action_id UUID REFERENCES moderation_actions(id),
  appeal_text TEXT,
  status VARCHAR(50), -- pending, approved, denied
  reviewed_by_id UUID REFERENCES users(id),
  decision_text TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `ReportContent` - Report inappropriate content
- `ModerationDashboard` - Review reports (moderators only)
- `ActionLogs` - View moderation history
- `AppealProcess` - Submit appeals for moderation actions
- `AcademicIntegrityGuide` - Education on policies

---

## Phase 7: Gamification & Analytics (Weeks 25-28)

### 7.1 Engagement & Gamification

#### Database Schema

```sql
-- Achievement System
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  badge_icon_url TEXT,
  requirement_type VARCHAR(50), -- events_attended, clubs_joined, posts_created
  requirement_count INT,
  category VARCHAR(50), -- social, academic, campus, exploration
  points_reward INT,
  created_at TIMESTAMP DEFAULT now()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Points & Rewards
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_points INT DEFAULT 0,
  points_this_semester INT DEFAULT 0,
  level INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT now()
);

-- Point Transactions
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INT,
  transaction_type VARCHAR(50), -- event_attendance, post_creation, achievement
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Leaderboards
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  leaderboard_type VARCHAR(50), -- points, events_attended, clubs_joined
  period VARCHAR(50), -- weekly, monthly, semester, all_time
  updated_at TIMESTAMP DEFAULT now()
);

-- Leaderboard Entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_id UUID REFERENCES leaderboards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rank INT,
  score INT,
  is_opted_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Semester Recap
CREATE TABLE semester_recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  semester VARCHAR(50),
  events_attended INT,
  clubs_joined INT,
  posts_created INT,
  friends_made INT,
  achievements_unlocked INT,
  recap_data JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Social Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type VARCHAR(50), -- photo, social, attendance, exploration
  start_date DATE,
  end_date DATE,
  reward_points INT,
  participation_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Challenge Participations
CREATE TABLE challenge_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_image_url TEXT,
  status VARCHAR(50), -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Photo Contests
CREATE TABLE photo_contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  theme VARCHAR(255),
  start_date DATE,
  end_date DATE,
  prizes JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Photo Submissions
CREATE TABLE photo_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES photo_contests(id) ON DELETE CASCADE,
  submitter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  votes INT DEFAULT 0,
  ranking INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Campus Bucket List
CREATE TABLE bucket_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Bucket List Items
CREATE TABLE bucket_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_list_id UUID REFERENCES bucket_lists(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_date TIMESTAMP,
  location_id UUID REFERENCES campus_locations(id),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Attendance Streaks
CREATE TABLE attendance_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50), -- events, clubs, study_groups
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `AchievementBadges` - Display unlocked badges
- `PointsDisplay` - Show points and level
- `Leaderboard` - Browse leaderboards (opt-in)
- `Challenges` - Browse and participate in challenges
- `PhotoContests` - Submit and vote on photos
- `SemesterRecap` - Generate semester summary
- `BucketList` - Campus experiences checklist
- `StreakTracker` - Track activity streaks
- `RewardsShop` - Spend points on rewards

---

### 7.2 Analytics & Insights

#### Database Schema

```sql
-- User Analytics
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  posts_created INT DEFAULT 0,
  posts_liked INT DEFAULT 0,
  connections_made INT DEFAULT 0,
  events_attended INT DEFAULT 0,
  clubs_joined INT DEFAULT 0,
  study_groups_created INT DEFAULT 0,
  study_groups_joined INT DEFAULT 0,
  courses_enrolled INT DEFAULT 0,
  assignments_completed INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT now()
);

-- Feature Usage
CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_name VARCHAR(255),
  usage_count INT DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Campus Exploration
CREATE TABLE campus_exploration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES campus_locations(id),
  visit_count INT DEFAULT 0,
  first_visit TIMESTAMP,
  last_visit TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Admin Dashboard Metrics
CREATE TABLE admin_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR(50), -- daily_active_users, event_attendance, engagement
  value INT,
  date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Student Engagement Summary
CREATE TABLE engagement_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(50), -- week, month, semester
  engagement_score INT,
  activity_breakdown JSONB,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

-- Early Warning System
CREATE TABLE at_risk_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  risk_type VARCHAR(50), -- low_engagement, academic_struggle, mental_health
  risk_score INT,
  indicators TEXT[],
  intervention_sent BOOLEAN DEFAULT false,
  identified_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `EngagementMetrics` - Personal engagement stats
- `ActivityDashboard` - Summary of activities
- `NetworkGrowth` - Visualize connections over time
- `AdminDashboard` - University-wide metrics
- `EventAnalytics` - Attendance tracking for events
- `StudentSentiment` - Mood and feedback tracking
- `UsagePatterns` - Feature usage analytics

---

## Phase 8: Unique Social Features (Weeks 29-32)

### 8.1 "Spotted" Features & Social Discovery

#### Database Schema

```sql
-- Missed Connections
CREATE TABLE missed_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  location VARCHAR(255),
  posted_date TIMESTAMP,
  image_url TEXT,
  is_moderated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Random Coffee Matches
CREATE TABLE random_coffee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_date TIMESTAMP DEFAULT now(),
  meeting_confirmed BOOLEAN DEFAULT false,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Study Buddy Roulette
CREATE TABLE study_buddy_roulette (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  match_date TIMESTAMP DEFAULT now(),
  study_date TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Time Capsules
CREATE TABLE time_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  capsule_type VARCHAR(50), -- freshman_year, senior_reflections, semester_memories
  title TEXT,
  content TEXT,
  media_urls TEXT[],
  visibility_type VARCHAR(50), -- private, friends, public
  open_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Capsule Contributions
CREATE TABLE capsule_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capsule_id UUID REFERENCES time_capsules(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contribution_text TEXT,
  contribution_media_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Campus Legends
CREATE TABLE campus_legends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50), -- funny, spooky, historical, achievement
  upvotes INT DEFAULT 0,
  created_by_id UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Professor Quotes
CREATE TABLE professor_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_name VARCHAR(255),
  course_id UUID REFERENCES courses(id),
  quote_text TEXT NOT NULL,
  context TEXT,
  submitted_by_id UUID REFERENCES users(id),
  is_approved BOOLEAN DEFAULT false,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Inside Jokes Repository
CREATE TABLE inside_jokes (
  id UUID PRIMARY KEY DEFAULT gem_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  explanation TEXT,
  origin_year INT,
  category VARCHAR(50),
  upvotes INT DEFAULT 0,
  submitted_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);
```

#### Components to Create

- `MissedConnections` - Post and browse missed connections
- `RandomCoffeeMatch` - Match with random students
- `StudyBuddyRoulette` - Random study buddy matching
- `TimeCapsules` - Create and contribute to capsules
- `CampusLegends` - Browse campus stories and myths
- `ProfessorQuotes` - Read memorable quotes
- `InsideJokes` - Explore university humor and traditions

---

## Component Architecture & File Structure

### Proposed Folder Structure

```
src/
├── components/
│   ├── academic/
│   │   ├── CourseDirectory/
│   │   ├── StudyGroups/
│   │   ├── AssignmentTracker/
│   │   ├── NoteSharing/
│   │   └── QAForum/
│   ├── campus/
│   │   ├── CampusMap/
│   │   ├── Dining/
│   │   ├── Library/
│   │   └── FacilitiesBooking/
│   ├── career/
│   │   ├── JobBoard/
│   │   ├── CareerFair/
│   │   ├── ResearchOpportunities/
│   │   └── AlumniNetwork/
│   ├── social/
│   │   ├── ClassYearGroups/
│   │   ├── ClubDirectory/
│   │   ├── CampusPolls/
│   │   └── AnonymousFeatures/
│   ├── safety/
│   │   ├── SafetyAlerts/
│   │   ├── SafeWalkProgram/
│   │   └── WellnessResources/
│   ├── gamification/
│   │   ├── Achievements/
│   │   ├── Leaderboard/
│   │   ├── Challenges/
│   │   └── SemesterRecap/
│   └── admin/
│       ├── ModerationDashboard/
│       ├── Analytics/
│       └── UserManagement/
├── lib/
│   ├── supabase/
│   │   ├── config.ts
│   │   └── api.ts (with all service-specific modules)
│   ├── hooks/
│   │   ├── useAcademicData.ts
│   │   ├── useCampusServices.ts
│   │   ├── useCareerData.ts
│   │   ├── useSocialFeatures.ts
│   │   ├── useGamification.ts
│   │   └── useAnalytics.ts
│   ├── services/
│   │   ├── academicService.ts
│   │   ├── campusService.ts
│   │   ├── careerService.ts
│   │   ├── socialService.ts
│   │   ├── safetyService.ts
│   │   ├── gamificationService.ts
│   │   └── analyticsService.ts
│   └── types/
│       ├── academic.types.ts
│       ├── campus.types.ts
│       ├── career.types.ts
│       ├── social.types.ts
│       ├─��� safety.types.ts
│       └── gamification.types.ts
├── pages/
│   ├── academic/
│   │   ├── CoursesPage.tsx
│   │   ├── StudyGroupsPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   └── ForumPage.tsx
│   ├── campus/
│   │   ├── MapPage.tsx
│   │   ├── DiningPage.tsx
│   │   ├── LibraryPage.tsx
│   │   └── FacilitiesPage.tsx
│   ├── career/
│   │   ├── JobBoardPage.tsx
│   │   ├── AlumniPage.tsx
│   │   ├── ResearchPage.tsx
│   │   └── PortfolioPage.tsx
│   ├── social/
│   │   ├── NetworksPage.tsx
│   │   ├── ClubsPage.tsx
│   │   └── DiscoverPage.tsx
│   ├── safety/
│   │   ├── SafetyPage.tsx
│   │   └── WellnessPage.tsx
│   └── dashboard/
│       ├── AdminDashboard.tsx
│       └── PersonalDashboard.tsx
└── context/
    ├── UniversityContext.tsx
    └── PermissionsContext.tsx
```

---

## Implementation Priorities

### Critical Path (MVP)

1. Enhanced authentication with .edu email
2. Course integration & communities
3. Study groups
4. Job board
5. Campus map & services (dining, library)
6. Club directory & events
7. Safety alerts

### High Priority

8. Note sharing
9. Q&A forums
10. Peer tutoring
11. Project matching
12. Career services (mentorship, alumni)
13. Gamification basics (points, achievements)
14. Analytics

### Medium Priority

15. Research opportunities
16. Roommate matching
17. Wellness features
18. Advanced gamification (leaderboards, recaps)
19. Startup ecosystem
20. "Spotted" features

### Nice to Have

21. Advanced analytics
22. Time capsules
23. Campus legends
24. Integration with external services (LMS, calendar)

---

## API Architecture

### RESTful Endpoints Organized by Feature

- `/api/academic/*` - All academic features
- `/api/campus/*` - All campus services
- `/api/career/*` - All career services
- `/api/social/*` - All social features
- `/api/safety/*` - Safety features
- `/api/gamification/*` - Gamification features
- `/api/admin/*` - Admin operations

### Real-Time Features (WebSocket)

- Study group chat
- Collaborative note editing
- Live event check-ins
- Location sharing for safe walk
- Campus alert notifications

---

## Security Considerations

1. **University Email Verification** - Only allow .edu emails during signup
2. **Role-Based Access Control** - Students, faculty, staff, alumni, admin
3. **Privacy Defaults** - All academic content private by default
4. **Audit Logging** - Track sensitive operations
5. **Content Moderation** - Flag and review inappropriate content
6. **Data Encryption** - Encrypt sensitive personal data
7. **Rate Limiting** - Prevent abuse of APIs
8. **Anonymous Protections** - Verify anonymity where promised

---

## Success Metrics

1. **Adoption**: Track sign-up and daily active users
2. **Engagement**: Monitor time spent, features used, social connections
3. **Academic Impact**: Track study group participation, note sharing
4. **Career**: Job placement rates, internship placements
5. **Safety**: Emergency alert effectiveness, safe walk usage
6. **Community**: Event attendance, club growth, campus involvement

---

## Next Steps

1. Set up Supabase with all database schemas
2. Create TypeScript interfaces for all data types
3. Implement authentication with university email verification
4. Build core academic features (courses, study groups, assignments)
5. Develop campus service integrations
6. Iterate with user feedback from pilot groups
