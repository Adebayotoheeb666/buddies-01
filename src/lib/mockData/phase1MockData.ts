import {
  Course,
  CourseEnrollment,
  StudyGroup,
  Assignment,
  SharedNote,
  ProjectListing,
  TutoringProfile,
  Resource,
  QAQuestion,
  QAAnswer,
  Skill,
  UserSkill,
  ClassYearGroup,
  DepartmentNetwork,
  InterestGroup,
  CampusPoll,
  PollOption,
  MemePost,
  StudentOrganization,
  OrganizationEvent,
} from "@/types/academic.types";
import { IUser } from "@/types";

// ============================================================
// MOCK USERS (for relationships)
// ============================================================

export const mockUsers: IUser[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Alice Johnson",
    username: "alice_j",
    email: "alice@university.edu",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    bio: "Computer Science major | Love coding and helping others",
    university_id: "A123456",
    graduation_year: 2025,
    major: "Computer Science",
    class_year: "Senior",
    pronouns: "She/Her",
    interests: ["Coding", "Web Development", "AI/ML"],
    verification_status: "verified",
    is_graduated: false,
    profile_visibility: "public",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Bob Smith",
    username: "bob_smith",
    email: "bob@university.edu",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    bio: "Mathematics student | Passionate about tutoring",
    university_id: "B123456",
    graduation_year: 2026,
    major: "Mathematics",
    class_year: "Junior",
    pronouns: "He/Him",
    interests: ["Mathematics", "Tutoring", "Problem Solving"],
    verification_status: "verified",
    is_graduated: false,
    profile_visibility: "public",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Carol Davis",
    username: "carol_d",
    email: "carol@university.edu",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    bio: "Physics enthusiast | Lab researcher",
    university_id: "C123456",
    graduation_year: 2024,
    major: "Physics",
    class_year: "Senior",
    pronouns: "She/Her",
    interests: ["Physics", "Research", "Science"],
    verification_status: "verified",
    is_graduated: false,
    profile_visibility: "public",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "David Lee",
    username: "david_lee",
    email: "david@university.edu",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    bio: "Engineering student | Build cool projects",
    university_id: "D123456",
    graduation_year: 2026,
    major: "Engineering",
    class_year: "Junior",
    pronouns: "He/Him",
    interests: ["Engineering", "Robotics", "IoT"],
    verification_status: "verified",
    is_graduated: false,
    profile_visibility: "public",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Emma Wilson",
    username: "emma_w",
    email: "emma@university.edu",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    bio: "Biology major | Interested in research",
    university_id: "E123456",
    graduation_year: 2027,
    major: "Biology",
    class_year: "Sophomore",
    pronouns: "She/Her",
    interests: ["Biology", "Research", "Medicine"],
    verification_status: "verified",
    is_graduated: false,
    profile_visibility: "public",
  },
];

// ============================================================
// MOCK COURSES
// ============================================================

export const mockCourses: Course[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    course_code: "CS101",
    course_name: "Introduction to Computer Science",
    professor: "Dr. Sarah Anderson",
    department: "Computer Science",
    semester: "Fall 2024",
    section: "A",
    credits: 3,
    schedule_json: {
      days: ["Monday", "Wednesday", "Friday"],
      startTime: "09:00",
      endTime: "10:30",
    },
    location: "Science Building 101",
    enrollment_count: 45,
    max_enrollment: 50,
    created_at: new Date("2024-08-01").toISOString(),
    updated_at: new Date("2024-08-01").toISOString(),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    course_code: "MATH201",
    course_name: "Calculus II",
    professor: "Prof. Michael Brown",
    department: "Mathematics",
    semester: "Fall 2024",
    section: "B",
    credits: 4,
    schedule_json: {
      days: ["Tuesday", "Thursday"],
      startTime: "11:00",
      endTime: "12:30",
    },
    location: "Math Building 205",
    enrollment_count: 38,
    max_enrollment: 40,
    created_at: new Date("2024-08-01").toISOString(),
    updated_at: new Date("2024-08-01").toISOString(),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    course_code: "PHYS301",
    course_name: "Modern Physics",
    professor: "Dr. James White",
    department: "Physics",
    semester: "Fall 2024",
    section: "A",
    credits: 4,
    schedule_json: {
      days: ["Monday", "Wednesday"],
      startTime: "14:00",
      endTime: "15:30",
    },
    location: "Physics Lab Building 310",
    enrollment_count: 28,
    max_enrollment: 35,
    created_at: new Date("2024-08-01").toISOString(),
    updated_at: new Date("2024-08-01").toISOString(),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440004",
    course_code: "ENG102",
    course_name: "English Composition II",
    professor: "Prof. Rachel Green",
    department: "English",
    semester: "Fall 2024",
    section: "C",
    credits: 3,
    schedule_json: {
      days: ["Tuesday", "Thursday"],
      startTime: "13:00",
      endTime: "14:30",
    },
    location: "Liberal Arts 215",
    enrollment_count: 32,
    max_enrollment: 35,
    created_at: new Date("2024-08-01").toISOString(),
    updated_at: new Date("2024-08-01").toISOString(),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440005",
    course_code: "BIO201",
    course_name: "Organic Chemistry",
    professor: "Dr. Patricia Chen",
    department: "Biology",
    semester: "Fall 2024",
    section: "A",
    credits: 4,
    schedule_json: {
      days: ["Monday", "Wednesday", "Friday"],
      startTime: "10:00",
      endTime: "11:30",
    },
    location: "Science Building 205",
    enrollment_count: 42,
    max_enrollment: 45,
    created_at: new Date("2024-08-01").toISOString(),
    updated_at: new Date("2024-08-01").toISOString(),
  },
];

// ============================================================
// MOCK COURSE ENROLLMENTS
// ============================================================

export const mockCourseEnrollments: CourseEnrollment[] = [
  {
    id: "770e8400-e29b-41d4-a716-446655440001",
    user_id: mockUsers[0].id,
    course_id: mockCourses[0].id,
    enrollment_date: new Date("2024-08-15").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440002",
    user_id: mockUsers[0].id,
    course_id: mockCourses[1].id,
    enrollment_date: new Date("2024-08-15").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440003",
    user_id: mockUsers[1].id,
    course_id: mockCourses[1].id,
    enrollment_date: new Date("2024-08-16").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440004",
    user_id: mockUsers[1].id,
    course_id: mockCourses[2].id,
    enrollment_date: new Date("2024-08-16").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440005",
    user_id: mockUsers[2].id,
    course_id: mockCourses[2].id,
    enrollment_date: new Date("2024-08-17").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440006",
    user_id: mockUsers[2].id,
    course_id: mockCourses[4].id,
    enrollment_date: new Date("2024-08-17").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440007",
    user_id: mockUsers[3].id,
    course_id: mockCourses[0].id,
    enrollment_date: new Date("2024-08-18").toISOString(),
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440008",
    user_id: mockUsers[4].id,
    course_id: mockCourses[4].id,
    enrollment_date: new Date("2024-08-18").toISOString(),
  },
];

// ============================================================
// MOCK STUDY GROUPS
// ============================================================

export const mockStudyGroups: StudyGroup[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440001",
    name: "CS101 Study Squad",
    description: "Meet up for CS101 exam prep and homework help",
    creator_id: mockUsers[0].id,
    course_id: mockCourses[0].id,
    location: "Library Room 210",
    meeting_time: new Date("2024-09-25T18:00:00").toISOString(),
    max_members: 8,
    is_active: true,
    created_at: new Date("2024-09-01").toISOString(),
    updated_at: new Date("2024-09-01").toISOString(),
    members_count: 5,
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    name: "Calculus Warriors",
    description: "MATH201 collaborative learning group",
    creator_id: mockUsers[1].id,
    course_id: mockCourses[1].id,
    location: "Coffee Shop Near Campus",
    meeting_time: new Date("2024-09-26T17:00:00").toISOString(),
    max_members: 6,
    is_active: true,
    created_at: new Date("2024-09-02").toISOString(),
    updated_at: new Date("2024-09-02").toISOString(),
    members_count: 4,
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440003",
    name: "Physics Lab Prep",
    description: "Prepare for physics lab practicals together",
    creator_id: mockUsers[2].id,
    course_id: mockCourses[2].id,
    location: "Physics Building Lounge",
    meeting_time: new Date("2024-09-24T16:00:00").toISOString(),
    max_members: 5,
    is_active: true,
    created_at: new Date("2024-09-03").toISOString(),
    updated_at: new Date("2024-09-03").toISOString(),
    members_count: 3,
  },
];

// ============================================================
// MOCK ASSIGNMENTS
// ============================================================

export const mockAssignments: Assignment[] = [
  {
    id: "990e8400-e29b-41d4-a716-446655440001",
    course_id: mockCourses[0].id,
    title: "Introduction to Python Programming",
    description: "Write a Python program to solve basic problems",
    due_date: new Date("2024-09-20T23:59:59").toISOString(),
    assignment_type: "homework",
    total_points: 50,
    is_group_project: false,
    created_by_id: mockUsers[0].id,
    created_at: new Date("2024-09-05").toISOString(),
  },
  {
    id: "990e8400-e29b-41d4-a716-446655440002",
    course_id: mockCourses[1].id,
    title: "Calculus Problem Set 3",
    description: "Complete problems 1-30 from Chapter 5",
    due_date: new Date("2024-09-22T23:59:59").toISOString(),
    assignment_type: "homework",
    total_points: 40,
    is_group_project: false,
    created_by_id: mockUsers[1].id,
    created_at: new Date("2024-09-06").toISOString(),
  },
  {
    id: "990e8400-e29b-41d4-a716-446655440003",
    course_id: mockCourses[2].id,
    title: "Physics Midterm Exam",
    description: "Comprehensive exam covering chapters 1-7",
    due_date: new Date("2024-10-15T14:00:00").toISOString(),
    assignment_type: "exam",
    total_points: 100,
    is_group_project: false,
    created_by_id: mockUsers[2].id,
    created_at: new Date("2024-09-10").toISOString(),
  },
  {
    id: "990e8400-e29b-41d4-a716-446655440004",
    course_id: mockCourses[0].id,
    title: "Final Project - Web Application",
    description:
      "Build a functional web application using HTML, CSS, and JavaScript",
    due_date: new Date("2024-12-01T23:59:59").toISOString(),
    assignment_type: "project",
    total_points: 150,
    is_group_project: true,
    created_by_id: mockUsers[0].id,
    created_at: new Date("2024-09-08").toISOString(),
  },
];

// ============================================================
// MOCK SHARED NOTES
// ============================================================

export const mockSharedNotes: SharedNote[] = [
  {
    id: "aa0e8400-e29b-41d4-a716-446655440001",
    creator_id: mockUsers[0].id,
    course_id: mockCourses[0].id,
    title: "CS101 Lecture Notes - Week 1",
    content:
      "Introduction to programming concepts, variables, data types, and basic operations...",
    tags: ["lecture", "introduction", "fundamentals"],
    is_public: true,
    created_at: new Date("2024-09-04").toISOString(),
    updated_at: new Date("2024-09-04").toISOString(),
  },
  {
    id: "aa0e8400-e29b-41d4-a716-446655440002",
    creator_id: mockUsers[1].id,
    course_id: mockCourses[1].id,
    title: "Calculus Integration Techniques Summary",
    content:
      "Quick reference guide for integration techniques including substitution, by parts...",
    tags: ["integration", "techniques", "review"],
    is_public: true,
    created_at: new Date("2024-09-05").toISOString(),
    updated_at: new Date("2024-09-05").toISOString(),
  },
  {
    id: "aa0e8400-e29b-41d4-a716-446655440003",
    creator_id: mockUsers[2].id,
    course_id: mockCourses[2].id,
    title: "Modern Physics Equations Sheet",
    content:
      "All important equations for the physics course with derivations...",
    tags: ["physics", "equations", "reference"],
    is_public: true,
    created_at: new Date("2024-09-06").toISOString(),
    updated_at: new Date("2024-09-06").toISOString(),
  },
];

// ============================================================
// MOCK SKILLS
// ============================================================

export const mockSkills: Skill[] = [
  {
    id: "bb0e8400-e29b-41d4-a716-446655440001",
    name: "Python",
    category: "technical",
    created_at: new Date().toISOString(),
  },
  {
    id: "bb0e8400-e29b-41d4-a716-446655440002",
    name: "JavaScript",
    category: "technical",
    created_at: new Date().toISOString(),
  },
  {
    id: "bb0e8400-e29b-41d4-a716-446655440003",
    name: "Data Analysis",
    category: "technical",
    created_at: new Date().toISOString(),
  },
  {
    id: "bb0e8400-e29b-41d4-a716-446655440004",
    name: "Communication",
    category: "soft",
    created_at: new Date().toISOString(),
  },
  {
    id: "bb0e8400-e29b-41d4-a716-446655440005",
    name: "Leadership",
    category: "soft",
    created_at: new Date().toISOString(),
  },
  {
    id: "bb0e8400-e29b-41d4-a716-446655440006",
    name: "Problem Solving",
    category: "soft",
    created_at: new Date().toISOString(),
  },
];

// ============================================================
// MOCK USER SKILLS
// ============================================================

export const mockUserSkills: UserSkill[] = [
  {
    id: "cc0e8400-e29b-41d4-a716-446655440001",
    user_id: mockUsers[0].id,
    skill_id: mockSkills[0].id,
    proficiency_level: "advanced",
    endorsements: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "cc0e8400-e29b-41d4-a716-446655440002",
    user_id: mockUsers[0].id,
    skill_id: mockSkills[1].id,
    proficiency_level: "intermediate",
    endorsements: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "cc0e8400-e29b-41d4-a716-446655440003",
    user_id: mockUsers[1].id,
    skill_id: mockSkills[2].id,
    proficiency_level: "expert",
    endorsements: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "cc0e8400-e29b-41d4-a716-446655440004",
    user_id: mockUsers[1].id,
    skill_id: mockSkills[5].id,
    proficiency_level: "advanced",
    endorsements: 6,
    created_at: new Date().toISOString(),
  },
];

// ============================================================
// MOCK PROJECT LISTINGS
// ============================================================

export const mockProjectListings: ProjectListing[] = [
  {
    id: "dd0e8400-e29b-41d4-a716-446655440001",
    creator_id: mockUsers[3].id,
    title: "Campus Event Management App",
    description: "Build a web app to manage and discover campus events",
    required_skills: ["JavaScript", "React", "Database Design"],
    team_size: 4,
    current_members: 2,
    status: "recruiting",
    due_date: new Date("2024-12-15").toISOString(),
    created_at: new Date("2024-09-05").toISOString(),
    members_count: 2,
  },
  {
    id: "dd0e8400-e29b-41d4-a716-446655440002",
    creator_id: mockUsers[2].id,
    title: "Research Data Visualization",
    description: "Visualize experimental results using Python and matplotlib",
    required_skills: ["Python", "Data Analysis", "Visualization"],
    team_size: 3,
    current_members: 1,
    status: "recruiting",
    due_date: new Date("2024-11-30").toISOString(),
    created_at: new Date("2024-09-06").toISOString(),
    members_count: 1,
  },
];

// ============================================================
// MOCK TUTORING PROFILES
// ============================================================

export const mockTutoringProfiles: TutoringProfile[] = [
  {
    id: "ee0e8400-e29b-41d4-a716-446655440001",
    user_id: mockUsers[1].id,
    bio: "Expert in mathematics with 3+ years of tutoring experience",
    subjects_tutored: ["Calculus", "Algebra", "Geometry"],
    hourly_rate: 25,
    availability_json: {
      monday: ["16:00-20:00"],
      wednesday: ["16:00-20:00"],
      saturday: ["10:00-18:00"],
    },
    location_preference: "both",
    is_active: true,
    created_at: new Date("2024-08-20").toISOString(),
  },
  {
    id: "ee0e8400-e29b-41d4-a716-446655440002",
    user_id: mockUsers[0].id,
    bio: "Computer Science student offering programming tutoring",
    subjects_tutored: ["Python", "JavaScript", "Data Structures"],
    hourly_rate: 20,
    availability_json: {
      tuesday: ["17:00-21:00"],
      thursday: ["17:00-21:00"],
      sunday: ["14:00-18:00"],
    },
    location_preference: "virtual",
    is_active: true,
    created_at: new Date("2024-08-22").toISOString(),
  },
];

// ============================================================
// MOCK RESOURCES
// ============================================================

export const mockResources: Resource[] = [
  {
    id: "ff0e8400-e29b-41d4-a716-446655440001",
    title: "Python Programming Guide",
    description: "Comprehensive guide to Python programming basics",
    resource_type: "guide",
    course_id: mockCourses[0].id,
    uploaded_by_id: mockUsers[0].id,
    file_url: "https://example.com/python-guide.pdf",
    tags: ["python", "programming", "tutorial"],
    is_public: true,
    views: 156,
    downloads: 42,
    created_at: new Date("2024-09-01").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440002",
    title: "Calculus Formula Reference",
    description: "Quick reference for common calculus formulas",
    resource_type: "guide",
    course_id: mockCourses[1].id,
    uploaded_by_id: mockUsers[1].id,
    file_url: "https://example.com/calculus-reference.pdf",
    tags: ["calculus", "mathematics", "formulas"],
    is_public: true,
    views: 203,
    downloads: 87,
    created_at: new Date("2024-09-02").toISOString(),
  },
];

// ============================================================
// MOCK Q&A QUESTIONS
// ============================================================

export const mockQAQuestions: QAQuestion[] = [
  {
    id: "gg0e8400-e29b-41d4-a716-446655440001",
    asker_id: mockUsers[3].id,
    course_id: mockCourses[0].id,
    title: "How do I implement a loop in Python?",
    content:
      "I am having trouble understanding how for loops work in Python. Can someone explain with an example?",
    tags: ["python", "loops", "beginner"],
    upvotes: 8,
    views: 142,
    is_answered: true,
    created_at: new Date("2024-09-10").toISOString(),
    updated_at: new Date("2024-09-11").toISOString(),
    answers_count: 3,
  },
  {
    id: "gg0e8400-e29b-41d4-a716-446655440002",
    asker_id: mockUsers[4].id,
    course_id: mockCourses[1].id,
    title: "Understanding the derivative of inverse functions",
    content:
      "I do not understand how to find the derivative of inverse functions. The notes are confusing.",
    tags: ["calculus", "derivatives", "inverse-functions"],
    upvotes: 5,
    views: 89,
    is_answered: true,
    created_at: new Date("2024-09-12").toISOString(),
    updated_at: new Date("2024-09-13").toISOString(),
    answers_count: 2,
  },
];

// ============================================================
// MOCK Q&A ANSWERS
// ============================================================

export const mockQAAnswers: QAAnswer[] = [
  {
    id: "hh0e8400-e29b-41d4-a716-446655440001",
    question_id: mockQAQuestions[0].id,
    answerer_id: mockUsers[0].id,
    content:
      "A for loop in Python iterates over a sequence. Here is an example: for i in range(10): print(i)",
    upvotes: 12,
    is_verified: true,
    verification_by_id: mockUsers[0].id,
    created_at: new Date("2024-09-10").toISOString(),
    updated_at: new Date("2024-09-11").toISOString(),
  },
  {
    id: "hh0e8400-e29b-41d4-a716-446655440002",
    question_id: mockQAQuestions[1].id,
    answerer_id: mockUsers[1].id,
    content:
      "The derivative of an inverse function uses the formula: (f^-1)' = 1 / f'(f^-1(x)). Let me provide more details...",
    upvotes: 9,
    is_verified: true,
    verification_by_id: mockUsers[1].id,
    created_at: new Date("2024-09-12").toISOString(),
    updated_at: new Date("2024-09-13").toISOString(),
  },
];

// ============================================================
// MOCK USER CONNECTIONS (FOLLOWERS/FOLLOWING)
// ============================================================

export interface UserConnection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export const mockUserConnections: UserConnection[] = [
  {
    id: "ff0e8400-e29b-41d4-a716-446655440001",
    follower_id: mockUsers[0].id,
    following_id: mockUsers[1].id,
    created_at: new Date("2024-08-01").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440002",
    follower_id: mockUsers[0].id,
    following_id: mockUsers[2].id,
    created_at: new Date("2024-08-02").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440003",
    follower_id: mockUsers[1].id,
    following_id: mockUsers[0].id,
    created_at: new Date("2024-08-03").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440004",
    follower_id: mockUsers[1].id,
    following_id: mockUsers[3].id,
    created_at: new Date("2024-08-04").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440005",
    follower_id: mockUsers[2].id,
    following_id: mockUsers[0].id,
    created_at: new Date("2024-08-05").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440006",
    follower_id: mockUsers[3].id,
    following_id: mockUsers[0].id,
    created_at: new Date("2024-08-06").toISOString(),
  },
  {
    id: "ff0e8400-e29b-41d4-a716-446655440007",
    follower_id: mockUsers[4].id,
    following_id: mockUsers[0].id,
    created_at: new Date("2024-08-07").toISOString(),
  },
];

// ============================================================
// MOCK CLASS YEAR GROUPS (Phase 4)
// ============================================================

export const mockClassYearGroups: ClassYearGroup[] = [
  {
    id: "ii0e8400-e29b-41d4-a716-446655440001",
    class_year: "Senior",
    member_count: 245,
    created_at: new Date("2024-01-15").toISOString(),
  },
  {
    id: "ii0e8400-e29b-41d4-a716-446655440002",
    class_year: "Junior",
    member_count: 198,
    created_at: new Date("2024-01-15").toISOString(),
  },
  {
    id: "ii0e8400-e29b-41d4-a716-446655440003",
    class_year: "Sophomore",
    member_count: 212,
    created_at: new Date("2024-01-15").toISOString(),
  },
  {
    id: "ii0e8400-e29b-41d4-a716-446655440004",
    class_year: "Freshman",
    member_count: 267,
    created_at: new Date("2024-01-15").toISOString(),
  },
];

// ============================================================
// MOCK DEPARTMENT NETWORKS (Phase 4)
// ============================================================

export const mockDepartmentNetworks: DepartmentNetwork[] = [
  {
    id: "jj0e8400-e29b-41d4-a716-446655440001",
    department: "Computer Science",
    description:
      "Connect with fellow CS students, share coding projects, and collaborate on tech initiatives",
    member_count: 156,
    created_at: new Date("2024-02-01").toISOString(),
  },
  {
    id: "jj0e8400-e29b-41d4-a716-446655440002",
    department: "Business Administration",
    description:
      "Network with business majors, share entrepreneurship ideas, and discuss career opportunities",
    member_count: 142,
    created_at: new Date("2024-02-01").toISOString(),
  },
  {
    id: "jj0e8400-e29b-41d4-a716-446655440003",
    department: "Biology",
    description:
      "Biology students discussing research, lab work, and pre-medical requirements",
    member_count: 98,
    created_at: new Date("2024-02-01").toISOString(),
  },
  {
    id: "jj0e8400-e29b-41d4-a716-446655440004",
    department: "Engineering",
    description: "Engineering students collaborating on design projects and technical challenges",
    member_count: 167,
    created_at: new Date("2024-02-01").toISOString(),
  },
];

// ============================================================
// MOCK INTEREST GROUPS (Phase 4)
// ============================================================

export const mockInterestGroups: InterestGroup[] = [
  {
    id: "kk0e8400-e29b-41d4-a716-446655440001",
    name: "Gaming Community",
    description: "For students who love video games and esports",
    interests: ["gaming", "esports", "streaming"],
    creator_id: mockUsers[0].id,
    member_count: 87,
    is_private: false,
    created_at: new Date("2024-03-10").toISOString(),
  },
  {
    id: "kk0e8400-e29b-41d4-a716-446655440002",
    name: "Fitness Enthusiasts",
    description: "Health and fitness focused group for gym buddies and fitness challenges",
    interests: ["fitness", "health", "wellness"],
    creator_id: mockUsers[1].id,
    member_count: 124,
    is_private: false,
    created_at: new Date("2024-03-12").toISOString(),
  },
  {
    id: "kk0e8400-e29b-41d4-a716-446655440003",
    name: "Photography Club",
    description: "Passionate photographers sharing tips, hosting photo walks, and contests",
    interests: ["photography", "art", "visual"],
    creator_id: mockUsers[2].id,
    member_count: 56,
    is_private: false,
    created_at: new Date("2024-03-15").toISOString(),
  },
  {
    id: "kk0e8400-e29b-41d4-a716-446655440004",
    name: "Anime Lovers",
    description: "Discussing anime, manga, and Japanese culture",
    interests: ["anime", "manga", "culture"],
    creator_id: mockUsers[3].id,
    member_count: 143,
    is_private: false,
    created_at: new Date("2024-03-18").toISOString(),
  },
];

// ============================================================
// MOCK CAMPUS POLLS (Phase 4)
// ============================================================

export const mockCampusPolls: CampusPoll[] = [
  {
    id: "ll0e8400-e29b-41d4-a716-446655440001",
    creator_id: mockUsers[0].id,
    title: "What should be the campus event for this semester?",
    description: "Help us decide on the biggest campus gathering",
    poll_type: "event_preference",
    expires_at: new Date("2024-09-30").toISOString(),
    created_at: new Date("2024-09-10").toISOString(),
    votes_count: 542,
  },
  {
    id: "ll0e8400-e29b-41d4-a716-446655440002",
    creator_id: mockUsers[1].id,
    title: "Should we extend library hours?",
    description: "Vote on extending library hours during exam season",
    poll_type: "campus_issue",
    expires_at: new Date("2024-09-25").toISOString(),
    created_at: new Date("2024-09-08").toISOString(),
    votes_count: 876,
  },
  {
    id: "ll0e8400-e29b-41d4-a716-446655440003",
    creator_id: mockUsers[2].id,
    title: "Best dining hall option?",
    description: "Rate your favorite campus dining location",
    poll_type: "general",
    expires_at: new Date("2024-09-22").toISOString(),
    created_at: new Date("2024-09-05").toISOString(),
    votes_count: 634,
  },
];

// ============================================================
// MOCK CAMPUS POLL OPTIONS (Phase 4)
// ============================================================

export const mockPollOptions: PollOption[] = [
  {
    id: "mm0e8400-e29b-41d4-a716-446655440001",
    poll_id: mockCampusPolls[0].id,
    option_text: "Fall Music Festival",
    vote_count: 234,
    created_at: new Date("2024-09-10").toISOString(),
  },
  {
    id: "mm0e8400-e29b-41d4-a716-446655440002",
    poll_id: mockCampusPolls[0].id,
    option_text: "Sports Tournament",
    vote_count: 178,
    created_at: new Date("2024-09-10").toISOString(),
  },
  {
    id: "mm0e8400-e29b-41d4-a716-446655440003",
    poll_id: mockCampusPolls[0].id,
    option_text: "Carnival & Fair",
    vote_count: 130,
    created_at: new Date("2024-09-10").toISOString(),
  },
  {
    id: "mm0e8400-e29b-41d4-a716-446655440004",
    poll_id: mockCampusPolls[1].id,
    option_text: "Yes, extend to 2am",
    vote_count: 512,
    created_at: new Date("2024-09-08").toISOString(),
  },
  {
    id: "mm0e8400-e29b-41d4-a716-446655440005",
    poll_id: mockCampusPolls[1].id,
    option_text: "No, keep current hours",
    vote_count: 364,
    created_at: new Date("2024-09-08").toISOString(),
  },
];

// ============================================================
// MOCK MEME POSTS (Phase 4)
// ============================================================

export const mockMemePosts: MemePost[] = [
  {
    id: "nn0e8400-e29b-41d4-a716-446655440001",
    creator_id: mockUsers[3].id,
    image_url:
      "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme1&size=400",
    caption: "Me after finishing one assignment",
    likes: 342,
    shares: 45,
    created_at: new Date("2024-09-12").toISOString(),
  },
  {
    id: "nn0e8400-e29b-41d4-a716-446655440002",
    creator_id: mockUsers[4].id,
    image_url:
      "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme2&size=400",
    caption: "Waiting for the professor to finish class early",
    likes: 521,
    shares: 67,
    created_at: new Date("2024-09-11").toISOString(),
  },
  {
    id: "nn0e8400-e29b-41d4-a716-446655440003",
    creator_id: mockUsers[0].id,
    image_url:
      "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme3&size=400",
    caption: "When you realize an assignment is due tomorrow",
    likes: 687,
    shares: 89,
    created_at: new Date("2024-09-10").toISOString(),
  },
];

// ============================================================
// MOCK STUDENT ORGANIZATIONS (Phase 4)
// ============================================================

export const mockStudentOrganizations: StudentOrganization[] = [
  {
    id: "oo0e8400-e29b-41d4-a716-446655440001",
    name: "Robotics Club",
    acronym: "RC",
    description: "Building and competing with robots in national competitions",
    category: "academic",
    president_id: mockUsers[0].id,
    email: "robotics@university.edu",
    meeting_schedule: "Every Monday 6 PM",
    member_count: 45,
    created_at: new Date("2023-09-01").toISOString(),
  },
  {
    id: "oo0e8400-e29b-41d4-a716-446655440002",
    name: "Basketball Team",
    acronym: "BBT",
    description: "Competitive basketball team with games and tournaments",
    category: "sports",
    president_id: mockUsers[1].id,
    email: "basketball@university.edu",
    meeting_schedule: "Monday & Wednesday 5 PM",
    member_count: 32,
    created_at: new Date("2023-08-15").toISOString(),
  },
  {
    id: "oo0e8400-e29b-41d4-a716-446655440003",
    name: "Cultural Exchange Club",
    acronym: "CEC",
    description: "Celebrating diverse cultures and international traditions",
    category: "cultural",
    president_id: mockUsers[2].id,
    email: "culture@university.edu",
    meeting_schedule: "Every Thursday 7 PM",
    member_count: 67,
    created_at: new Date("2023-09-10").toISOString(),
  },
  {
    id: "oo0e8400-e29b-41d4-a716-446655440004",
    name: "Community Service Corps",
    acronym: "CSC",
    description: "Volunteering and community service initiatives",
    category: "service",
    president_id: mockUsers[3].id,
    email: "service@university.edu",
    meeting_schedule: "Saturday 10 AM",
    member_count: 89,
    created_at: new Date("2023-08-20").toISOString(),
  },
];

// ============================================================
// MOCK ORGANIZATION EVENTS (Phase 4)
// ============================================================

export const mockOrganizationEvents: OrganizationEvent[] = [
  {
    id: "pp0e8400-e29b-41d4-a716-446655440001",
    organization_id: mockStudentOrganizations[0].id,
    title: "Robotics Competition - Regional Finals",
    description: "Our team competes in the regional robotics championship",
    event_date: new Date("2024-10-15").toISOString(),
    location: "Engineering Building, Room 201",
    event_type: "meeting",
    capacity: 150,
    rsvp_count: 78,
    created_by_id: mockUsers[0].id,
    created_at: new Date("2024-09-05").toISOString(),
  },
  {
    id: "pp0e8400-e29b-41d4-a716-446655440002",
    organization_id: mockStudentOrganizations[1].id,
    title: "Basketball Game vs State University",
    description: "Home game - support our team!",
    event_date: new Date("2024-10-20").toISOString(),
    location: "Sports Arena",
    event_type: "social",
    capacity: 500,
    rsvp_count: 234,
    created_by_id: mockUsers[1].id,
    created_at: new Date("2024-09-08").toISOString(),
  },
  {
    id: "pp0e8400-e29b-41d4-a716-446655440003",
    organization_id: mockStudentOrganizations[2].id,
    title: "International Food Festival",
    description: "Try cuisines from around the world and celebrate global cultures",
    event_date: new Date("2024-10-25").toISOString(),
    location: "Student Center Courtyard",
    event_type: "social",
    capacity: 300,
    rsvp_count: 145,
    created_by_id: mockUsers[2].id,
    created_at: new Date("2024-09-10").toISOString(),
  },
  {
    id: "pp0e8400-e29b-41d4-a716-446655440004",
    organization_id: mockStudentOrganizations[3].id,
    title: "Volunteer Day - Local Food Bank",
    description: "Help pack and distribute food to the community",
    event_date: new Date("2024-10-22").toISOString(),
    location: "Downtown Food Bank",
    event_type: "workshop",
    capacity: 100,
    rsvp_count: 67,
    created_by_id: mockUsers[3].id,
    created_at: new Date("2024-09-12").toISOString(),
  },
];

// ============================================================
// EXPORT FUNCTION TO GET ALL MOCK DATA
// ============================================================

export const getAllMockData = () => ({
  users: mockUsers,
  connections: mockUserConnections,
  courses: mockCourses,
  enrollments: mockCourseEnrollments,
  studyGroups: mockStudyGroups,
  assignments: mockAssignments,
  notes: mockSharedNotes,
  skills: mockSkills,
  userSkills: mockUserSkills,
  projects: mockProjectListings,
  tutoringProfiles: mockTutoringProfiles,
  resources: mockResources,
  qaQuestions: mockQAQuestions,
  qaAnswers: mockQAAnswers,
  classYearGroups: mockClassYearGroups,
  departmentNetworks: mockDepartmentNetworks,
  interestGroups: mockInterestGroups,
  campusPolls: mockCampusPolls,
  pollOptions: mockPollOptions,
  memePosts: mockMemePosts,
  studentOrganizations: mockStudentOrganizations,
  organizationEvents: mockOrganizationEvents,
});
