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
}
