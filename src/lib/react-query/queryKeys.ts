export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",
  GET_USER_FOLLOWING = "getUserFollowing",
  GET_USER_FOLLOWERS = "getUserFollowers",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",

  // COURSE KEYS
  GET_COURSES = "getCourses",
  GET_COURSE_BY_ID = "getCourseById",
  GET_USER_COURSES = "getUserCourses",

  // STUDY GROUP KEYS
  GET_STUDY_GROUPS = "getStudyGroups",
  GET_STUDY_GROUP_BY_ID = "getStudyGroupById",

  // ASSIGNMENT KEYS
  GET_ASSIGNMENTS = "getAssignments",
  GET_ASSIGNMENT_BY_ID = "getAssignmentById",
  GET_COURSE_ASSIGNMENTS = "getCourseAssignments",

  // NOTES KEYS
  GET_SHARED_NOTES = "getSharedNotes",

  // SKILLS & PROJECT KEYS
  GET_SKILLS = "getSkills",
  GET_USER_SKILLS = "getUserSkills",
  GET_PROJECT_LISTINGS = "getProjectListings",

  // TUTORING KEYS
  GET_TUTORING_PROFILES = "getTutoringProfiles",

  // RESOURCES KEYS
  GET_RESOURCES = "getResources",

  // Q&A KEYS
  GET_QA_QUESTIONS = "getQAQuestions",
  GET_QUESTION_BY_ID = "getQuestionById",

  // CLASS YEAR GROUPS
  GET_CLASS_YEAR_GROUPS = "getClassYearGroups",
  // DEPARTMENT NETWORKS
  GET_DEPARTMENT_NETWORKS = "getDepartmentNetworks",
  // INTEREST GROUPS
  GET_INTEREST_GROUPS = "getInterestGroups",
  GET_INTEREST_GROUP_BY_ID = "getInterestGroupById",
  // CAMPUS POLLS
  GET_CAMPUS_POLLS = "getCampusPolls",
  GET_POLL_BY_ID = "getPollById",
  // MEME POSTS
  GET_MEME_POSTS = "getMemePosts",
  // STUDENT ORGANIZATIONS
  GET_STUDENT_ORGANIZATIONS = "getStudentOrganizations",
  GET_ORGANIZATION_BY_ID = "getOrganizationById",
  GET_ORGANIZATION_EVENTS = "getOrganizationEvents",

  // ACHIEVEMENTS & GAMIFICATION KEYS
  GET_ACHIEVEMENTS = "getAchievements",
  GET_USER_ACHIEVEMENTS = "getUserAchievements",
  GET_USER_POINTS = "getUserPoints",
  GET_LEADERBOARD = "getLeaderboard",
  GET_CHALLENGES = "getChallenges",
  GET_USER_CHALLENGES = "getUserChallenges",
  GET_SEMESTER_RECAPS = "getSemesterRecaps",

  // CAMPUS FEATURES KEYS
  GET_CAMPUS_LOCATIONS = "getCampusLocations",
  GET_CAMPUS_LOCATION_BY_ID = "getCampusLocationById",
  GET_LIBRARY_BOOKS = "getLibraryBooks",
  GET_DINING_HALLS = "getDiningHalls",
  GET_DINING_MENUS = "getDiningMenus",
  GET_FACILITIES = "getFacilities",
  GET_FACILITY_BOOKINGS = "getFacilityBookings",
  GET_SAFETY_ALERTS = "getSafetyAlerts",

  // SOCIAL FEATURES KEYS
  GET_ANONYMOUS_CONFESSIONS = "getAnonymousConfessions",
  GET_USER_CONNECTIONS = "getUserConnections",
  GET_STUDY_GROUP_MEMBERS = "getStudyGroupMembers",
  GET_INTEREST_GROUP_MEMBERS = "getInterestGroupMembers",
  GET_ORGANIZATION_MEMBERS = "getOrganizationMembers",
  GET_EVENT_RSVPS = "getEventRSVPs",

  // ACADEMIC KEYS
  GET_TEXTBOOKS_BY_COURSE = "getTextbooksByCourse",
  GET_TEXTBOOK_LISTINGS = "getTextbookListings",
  GET_PROFESSOR_REVIEWS = "getProfessorReviews",
  GET_TUTORING_SESSIONS = "getTutoringSessions",
  GET_TUTORING_REVIEWS = "getTutoringReviews",
}
