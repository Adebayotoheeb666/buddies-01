import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  updateMemePost,
  likeMemePost,
  updateConfessionStatus,
  updateJobApplicationStatus,
  updateLibraryReservationStatus,
  cancelLibraryReservation,
  updateFacilityBookingStatus,
  cancelFacilityBooking,
  updateEventRsvpStatus,
  updateWellnessEventRsvpStatus,
  updateSharedNoteStatus,
  updateResourceVisibility,
} from "@/lib/supabase/api";
import {
  getCourses,
  getCourseById,
  getUserCourses,
  getCourseEnrollmentsByUserExcluding,
  getCourseSharedNotesByCourse,
  getStudyGroups,
  getStudyGroupById,
  getAssignments,
  getAssignmentById,
  getCourseAssignments,
  getSharedNotes,
  getSkills,
  getUserSkills,
  getProjectListings,
  getTutoringProfiles,
  getResources,
  getQAQuestions,
  getQuestionById,
  getUserFollowing,
  getUserFollowers,
  getInterestGroups,
  getInterestGroupById,
  getCampusPolls,
  getPollById,
  getMemePosts,
  getStudentOrganizations,
  getAchievements,
  getUserAchievements,
  getUserPoints,
  getLeaderboard,
  getChallenges,
  getUserChallengeParticipations,
  getSemesterRecaps,
  getCampusLocations,
  getCampusLocationById,
  getLibraryBooks,
  getDiningHalls,
  getDiningMenus,
  getFacilities,
  getFacilityBookings,
  getSafetyAlerts,
  getAnonymousConfessions,
  getUserConnections,
  getStudyGroupMembers,
  getStudyGroupMembersCount,
  getInterestGroupMembers,
  getOrganizationMembers,
  getEventRSVPs,
  getTextbooksByCourse,
  getTextbookListings,
  getProfessorReviews,
  getTutoringSessions,
  getTutoringReviews,
  getClassYearGroups,
  getDepartmentNetworks,
  createStudyGroup,
  createCourseEnrollment,
  createSharedNote,
  createResource,
  createQAQuestion,
  createQAAnswer,
  createProjectListing,
  createJobListing,
  createJobApplication,
  createTutorSession,
  createPollVote,
  createLibraryReservation,
  createFacilityBooking,
  createChallengeSubmission,
  createPhotoContestSubmission,
  createPhotoContestVote,
  createWellnessEventRsvp,
  joinStudyGroup,
  joinInterestGroup,
  joinOrganization,
  createUserConnection,
  addUserSkill,
  updateStudyGroup,
  leaveStudyGroup,
  submitAssignmentSolution,
  markQAAnswerAsVerified,
  updateProjectListing,
  updateChallengeSubmission,
  updateBucketListItem,
  updateTutoringProfile,
  completeTutorSession,
  updatePhotoContestSubmission,
  updateInterestGroup,
  leaveInterestGroup,
  updateAssignmentSubmissionStatus,
} from "@/lib/supabase/academic-api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1]?.id;
      return lastId || null;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.id],
      });
    },
  });
};

// ============================================================
// ============================================================
// ACADEMIC FEATURE QUERIES
// ============================================================

// COURSES
export const useGetCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSES],
    queryFn: async () => {
      const data = await getCourses();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetCourseById = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_BY_ID, courseId],
    queryFn: () => getCourseById(courseId || ""),
    enabled: !!courseId,
  });
};

export const useGetUserCourses = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_COURSES, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserCourses(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetCourseClassmates = (
  courseId?: string,
  excludeUserId?: string
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_CLASSMATES, courseId, excludeUserId],
    queryFn: async () => {
      if (!courseId || !excludeUserId) return { documents: [], total: 0 };
      const data = await getCourseEnrollmentsByUserExcluding(
        courseId,
        excludeUserId
      );
      return { documents: data, total: data.length };
    },
    enabled: !!courseId && !!excludeUserId,
  });
};

export const useGetCourseSharedNotes = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_SHARED_NOTES, courseId],
    queryFn: async () => {
      if (!courseId) return { documents: [], total: 0 };
      const data = await getCourseSharedNotesByCourse(courseId);
      return { documents: data, total: data.length };
    },
    enabled: !!courseId,
  });
};

// STUDY GROUPS
export const useGetStudyGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDY_GROUPS],
    queryFn: async () => {
      const data = await getStudyGroups();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetStudyGroupById = (groupId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDY_GROUP_BY_ID, groupId],
    queryFn: () => getStudyGroupById(groupId || ""),
    enabled: !!groupId,
  });
};

// ASSIGNMENTS
export const useGetAssignments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSIGNMENTS],
    queryFn: async () => {
      const data = await getAssignments();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetAssignmentById = (assignmentId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSIGNMENT_BY_ID, assignmentId],
    queryFn: () => getAssignmentById(assignmentId || ""),
    enabled: !!assignmentId,
  });
};

export const useGetCourseAssignments = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_ASSIGNMENTS, courseId],
    queryFn: async () => {
      if (!courseId) return { documents: [], total: 0 };
      const data = await getCourseAssignments(courseId);
      return { documents: data, total: data.length };
    },
    enabled: !!courseId,
  });
};

// SHARED NOTES
export const useGetSharedNotes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SHARED_NOTES],
    queryFn: async () => {
      const data = await getSharedNotes();
      return { documents: data, total: data.length };
    },
  });
};

// SKILLS & PROJECT MATCHING
export const useGetSkills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SKILLS],
    queryFn: async () => {
      const data = await getSkills();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetUserSkills = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SKILLS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserSkills(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetProjectListings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_LISTINGS],
    queryFn: async () => {
      const data = await getProjectListings();
      return { documents: data, total: data.length };
    },
  });
};

// TUTORING
export const useGetTutoringProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TUTORING_PROFILES],
    queryFn: async () => {
      const data = await getTutoringProfiles();
      return { documents: data, total: data.length };
    },
  });
};

// RESOURCES
export const useGetResources = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RESOURCES],
    queryFn: async () => {
      const data = await getResources();
      return { documents: data, total: data.length };
    },
  });
};

// Q&A
export const useGetQAQuestions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_QA_QUESTIONS],
    queryFn: async () => {
      const data = await getQAQuestions();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetQuestionById = (questionId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_QUESTION_BY_ID, questionId],
    queryFn: () => getQuestionById(questionId || ""),
    enabled: !!questionId,
  });
};

// USER CONNECTIONS (FOLLOWERS)
export const useGetUserFollowing = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserFollowing(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetUserFollowers = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserFollowers(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

// ============================================================
// PHASE 4: SOCIAL & NETWORKING QUERIES
// ============================================================

// CLASS YEAR GROUPS
export const useGetClassYearGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLASS_YEAR_GROUPS],
    queryFn: async () => {
      const data = await getClassYearGroups();
      return { documents: data, total: data.length };
    },
  });
};

// DEPARTMENT NETWORKS
export const useGetDepartmentNetworks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DEPARTMENT_NETWORKS],
    queryFn: async () => {
      const data = await getDepartmentNetworks();
      return { documents: data, total: data.length };
    },
  });
};

// INTEREST GROUPS
export const useGetInterestGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INTEREST_GROUPS],
    queryFn: async () => {
      const data = await getInterestGroups();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetInterestGroupById = (groupId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_BY_ID, groupId],
    queryFn: () => getInterestGroupById(groupId || ""),
    enabled: !!groupId,
  });
};

// CAMPUS POLLS
export const useGetCampusPolls = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CAMPUS_POLLS],
    queryFn: async () => {
      const data = await getCampusPolls();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetPollById = (pollId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POLL_BY_ID, pollId],
    queryFn: () => getPollById(pollId || ""),
    enabled: !!pollId,
  });
};

// MEME POSTS
export const useGetMemePosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEME_POSTS],
    queryFn: async () => {
      const data = await getMemePosts();
      return { documents: data, total: data.length };
    },
  });
};

// STUDENT ORGANIZATIONS
export const useGetStudentOrganizations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDENT_ORGANIZATIONS],
    queryFn: async () => {
      const data = await getStudentOrganizations();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetOrganizationById = (orgId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORGANIZATION_BY_ID, orgId],
    queryFn: async () => {
      if (!orgId) return null;
      const { data, error } = await supabase
        .from("student_organizations")
        .select("*")
        .eq("id", orgId)
        .single();

      if (error) {
        console.error("getOrganizationById error:", error);
        return null;
      }
      return data;
    },
    enabled: !!orgId,
  });
};

// ORGANIZATION EVENTS
export const useGetOrganizationEvents = (orgId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORGANIZATION_EVENTS, orgId],
    queryFn: async () => {
      if (!orgId) return { documents: [], total: 0 };
      const data = await getOrganizationEvents(orgId);
      return { documents: data, total: data.length };
    },
    enabled: !!orgId,
  });
};

// ============================================================
// ACHIEVEMENTS & GAMIFICATION QUERIES
// ============================================================

export const useGetAchievements = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACHIEVEMENTS],
    queryFn: async () => {
      const data = await getAchievements();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetUserAchievements = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_ACHIEVEMENTS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserAchievements(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetUserPoints = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POINTS, userId],
    queryFn: () => getUserPoints(userId || ""),
    enabled: !!userId,
  });
};

export const useGetLeaderboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LEADERBOARD],
    queryFn: async () => {
      const data = await getLeaderboard();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetChallenges = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHALLENGES],
    queryFn: async () => {
      const data = await getChallenges();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetUserChallenges = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_CHALLENGES, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserChallengeParticipations(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetSemesterRecaps = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SEMESTER_RECAPS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getSemesterRecaps(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

// ============================================================
// CAMPUS FEATURES QUERIES
// ============================================================

export const useGetCampusLocations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CAMPUS_LOCATIONS],
    queryFn: async () => {
      const data = await getCampusLocations();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetCampusLocationById = (locationId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CAMPUS_LOCATION_BY_ID, locationId],
    queryFn: () => getCampusLocationById(locationId || ""),
    enabled: !!locationId,
  });
};

export const useGetLibraryBooks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIBRARY_BOOKS],
    queryFn: async () => {
      const data = await getLibraryBooks();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetDiningHalls = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DINING_HALLS],
    queryFn: async () => {
      const data = await getDiningHalls();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetDiningMenus = (diningHallId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DINING_MENUS, diningHallId],
    queryFn: async () => {
      if (!diningHallId) return { documents: [], total: 0 };
      const data = await getDiningMenus(diningHallId);
      return { documents: data, total: data.length };
    },
    enabled: !!diningHallId,
  });
};

export const useGetFacilities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FACILITIES],
    queryFn: async () => {
      const data = await getFacilities();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetFacilityBookings = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FACILITY_BOOKINGS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getFacilityBookings(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetSafetyAlerts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAFETY_ALERTS],
    queryFn: async () => {
      const data = await getSafetyAlerts();
      return { documents: data, total: data.length };
    },
  });
};

// ============================================================
// SOCIAL FEATURES QUERIES
// ============================================================

export const useGetAnonymousConfessions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ANONYMOUS_CONFESSIONS],
    queryFn: async () => {
      const data = await getAnonymousConfessions();
      return { documents: data, total: data.length };
    },
  });
};

export const useGetUserConnections = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_CONNECTIONS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getUserConnections(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetStudyGroupMembers = (groupId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDY_GROUP_MEMBERS, groupId],
    queryFn: async () => {
      if (!groupId) return { documents: [], total: 0 };
      const data = await getStudyGroupMembers(groupId);
      return { documents: data, total: data.length };
    },
    enabled: !!groupId,
  });
};

export const useGetInterestGroupMembers = (groupId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_MEMBERS, groupId],
    queryFn: async () => {
      if (!groupId) return { documents: [], total: 0 };
      const data = await getInterestGroupMembers(groupId);
      return { documents: data, total: data.length };
    },
    enabled: !!groupId,
  });
};

export const useGetOrganizationMembers = (orgId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORGANIZATION_MEMBERS, orgId],
    queryFn: async () => {
      if (!orgId) return { documents: [], total: 0 };
      const data = await getOrganizationMembers(orgId);
      return { documents: data, total: data.length };
    },
    enabled: !!orgId,
  });
};

export const useGetEventRSVPs = (eventId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EVENT_RSVPS, eventId],
    queryFn: async () => {
      if (!eventId) return { documents: [], total: 0 };
      const data = await getEventRSVPs(eventId);
      return { documents: data, total: data.length };
    },
    enabled: !!eventId,
  });
};

// ============================================================
// TEXTBOOK & ACADEMIC QUERIES
// ============================================================

export const useGetTextbooksByCourse = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TEXTBOOKS_BY_COURSE, courseId],
    queryFn: async () => {
      if (!courseId) return { documents: [], total: 0 };
      const data = await getTextbooksByCourse(courseId);
      return { documents: data, total: data.length };
    },
    enabled: !!courseId,
  });
};

export const useGetTextbookListings = (textbookId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TEXTBOOK_LISTINGS, textbookId],
    queryFn: async () => {
      if (!textbookId) return { documents: [], total: 0 };
      const data = await getTextbookListings(textbookId);
      return { documents: data, total: data.length };
    },
    enabled: !!textbookId,
  });
};

export const useGetProfessorReviews = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFESSOR_REVIEWS, courseId],
    queryFn: async () => {
      if (!courseId) return { documents: [], total: 0 };
      const data = await getProfessorReviews(courseId);
      return { documents: data, total: data.length };
    },
    enabled: !!courseId,
  });
};

export const useGetTutoringSessions = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TUTORING_SESSIONS, userId],
    queryFn: async () => {
      if (!userId) return { documents: [], total: 0 };
      const data = await getTutoringSessions(userId);
      return { documents: data, total: data.length };
    },
    enabled: !!userId,
  });
};

export const useGetTutoringReviews = (tutorId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TUTORING_REVIEWS, tutorId],
    queryFn: async () => {
      if (!tutorId) return { documents: [], total: 0 };
      const data = await getTutoringReviews(tutorId);
      return { documents: data, total: data.length };
    },
    enabled: !!tutorId,
  });
};

// ============================================================
// CREATE MUTATIONS FOR ACADEMIC FEATURES
// ============================================================

export const useCreateStudyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
      courseId,
      creatorId,
    }: {
      name: string;
      description: string;
      courseId?: string;
      creatorId?: string;
    }) => createStudyGroup(name, description, courseId, creatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUPS],
      });
    },
  });
};

export const useCreateCourseEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: string;
    }) => createCourseEnrollment(userId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COURSES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_COURSES],
      });
    },
  });
};

export const useCreateSharedNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      content,
      courseId,
      creatorId,
      isPublic,
    }: {
      title: string;
      content: string;
      courseId: string;
      creatorId: string;
      isPublic?: boolean;
    }) => createSharedNote(title, content, courseId, creatorId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SHARED_NOTES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COURSE_SHARED_NOTES],
      });
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      description,
      resourceUrl,
      resourceType,
      creatorId,
    }: {
      title: string;
      description: string;
      resourceUrl: string;
      resourceType: string;
      creatorId: string;
    }) =>
      createResource(title, description, resourceUrl, resourceType, creatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESOURCES],
      });
    },
  });
};

export const useCreateQAQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      content,
      courseId,
      creatorId,
    }: {
      title: string;
      content: string;
      courseId: string;
      creatorId: string;
    }) => createQAQuestion(title, content, courseId, creatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_QA_QUESTIONS],
      });
    },
  });
};

export const useCreateQAAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      questionId,
      creatorId,
    }: {
      content: string;
      questionId: string;
      creatorId: string;
    }) => createQAAnswer(content, questionId, creatorId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_QUESTION_BY_ID, variables.questionId],
      });
    },
  });
};

export const useCreateProjectListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      description,
      skills,
      creatorId,
      status,
    }: {
      title: string;
      description: string;
      skills: string[];
      creatorId: string;
      status?: string;
    }) => createProjectListing(title, description, skills, creatorId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_LISTINGS],
      });
    },
  });
};

export const useCreateJobListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      description,
      requirements,
      companyName,
      location,
      salary,
      creatorId,
    }: {
      title: string;
      description: string;
      requirements: string;
      companyName: string;
      location: string;
      salary?: string;
      creatorId?: string;
    }) =>
      createJobListing(
        title,
        description,
        requirements,
        companyName,
        location,
        salary,
        creatorId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_JOB_LISTINGS],
      });
    },
  });
};

export const useCreateJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobListingId,
      userId,
      coverLetter,
    }: {
      jobListingId: string;
      userId: string;
      coverLetter?: string;
    }) => createJobApplication(jobListingId, userId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_JOB_APPLICATIONS],
      });
    },
  });
};

export const useCreateTutorSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tutorId,
      studentId,
      subject,
      scheduledTime,
      duration,
    }: {
      tutorId: string;
      studentId: string;
      subject: string;
      scheduledTime: string;
      duration: number;
    }) =>
      createTutorSession(tutorId, studentId, subject, scheduledTime, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TUTORING_SESSIONS],
      });
    },
  });
};

export const useCreatePollVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pollOptionId,
      userId,
    }: {
      pollOptionId: string;
      userId: string;
    }) => createPollVote(pollOptionId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CAMPUS_POLLS],
      });
    },
  });
};

export const useCreateLibraryReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      bookId,
      reservationDate,
    }: {
      userId: string;
      bookId: string;
      reservationDate: string;
    }) => createLibraryReservation(userId, bookId, reservationDate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_BOOKS],
      });
    },
  });
};

export const useCreateFacilityBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      facilityId,
      startTime,
      endTime,
      purpose,
    }: {
      userId: string;
      facilityId: string;
      startTime: string;
      endTime: string;
      purpose?: string;
    }) =>
      createFacilityBooking(userId, facilityId, startTime, endTime, purpose),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FACILITY_BOOKINGS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FACILITIES],
      });
    },
  });
};

export const useCreateChallengeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      challengeId,
      userId,
      submissionContent,
      submissionUrl,
    }: {
      challengeId: string;
      userId: string;
      submissionContent: string;
      submissionUrl?: string;
    }) =>
      createChallengeSubmission(
        challengeId,
        userId,
        submissionContent,
        submissionUrl
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHALLENGES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CHALLENGES],
      });
    },
  });
};

export const useCreatePhotoContestSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contestId,
      userId,
      photoUrl,
      caption,
    }: {
      contestId: string;
      userId: string;
      photoUrl: string;
      caption?: string;
    }) =>
      createPhotoContestSubmission(contestId, userId, photoUrl, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PHOTO_CONTESTS],
      });
    },
  });
};

export const useCreatePhotoContestVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      userId,
    }: {
      submissionId: string;
      userId: string;
    }) => createPhotoContestVote(submissionId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PHOTO_CONTESTS],
      });
    },
  });
};

export const useCreateWellnessEventRsvp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      status,
    }: {
      eventId: string;
      userId: string;
      status?: string;
    }) => createWellnessEventRsvp(eventId, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_WELLNESS_EVENTS],
      });
    },
  });
};

export const useJoinStudyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => joinStudyGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUP_MEMBERS, variables.groupId],
      });
    },
  });
};

export const useJoinInterestGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => joinInterestGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_MEMBERS, variables.groupId],
      });
    },
  });
};

export const useJoinOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orgId,
      userId,
    }: {
      orgId: string;
      userId: string;
    }) => joinOrganization(orgId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ORGANIZATION_BY_ID, variables.orgId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ORGANIZATION_MEMBERS, variables.orgId],
      });
    },
  });
};

export const useCreateUserConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => createUserConnection(followerId, followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS],
      });
    },
  });
};

export const useAddUserSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      skillId,
    }: {
      userId: string;
      skillId: string;
    }) => addUserSkill(userId, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_SKILLS, variables.userId],
      });
    },
  });
};

// ============================================================
// UPDATE MUTATIONS FOR ACADEMIC FEATURES
// ============================================================

export const useUpdateStudyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      updates,
    }: {
      groupId: string;
      updates: { name?: string; description?: string };
    }) => updateStudyGroup(groupId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUPS],
      });
    },
  });
};

export const useLeaveStudyGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => leaveStudyGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STUDY_GROUP_MEMBERS, variables.groupId],
      });
    },
  });
};

export const useSubmitAssignmentSolution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      userId,
      submissionContent,
      submissionUrl,
    }: {
      assignmentId: string;
      userId: string;
      submissionContent: string;
      submissionUrl?: string;
    }) =>
      submitAssignmentSolution(
        assignmentId,
        userId,
        submissionContent,
        submissionUrl
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSIGNMENT_BY_ID, variables.assignmentId],
      });
    },
  });
};

export const useMarkQAAnswerAsVerified = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answerId: string) => markQAAnswerAsVerified(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_QA_QUESTIONS],
      });
    },
  });
};

export const useUpdateProjectListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: {
        title?: string;
        description?: string;
        required_skills?: string[];
        status?: string;
      };
    }) => updateProjectListing(projectId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_LISTINGS],
      });
    },
  });
};

export const useUpdateChallengeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      updates,
    }: {
      submissionId: string;
      updates: {
        submission_content?: string;
        submission_url?: string;
        status?: string;
      };
    }) => updateChallengeSubmission(submissionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CHALLENGES],
      });
    },
  });
};

export const useUpdateBucketListItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      completed,
    }: {
      itemId: string;
      completed: boolean;
    }) => updateBucketListItem(itemId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_BUCKET_LIST],
      });
    },
  });
};

export const useUpdateTutoringProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      profileId,
      updates,
    }: {
      profileId: string;
      updates: {
        hourly_rate?: number;
        bio?: string;
        subjects?: string[];
        availability?: string;
      };
    }) => updateTutoringProfile(profileId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TUTORING_PROFILES],
      });
    },
  });
};

export const useCompleteTutorSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      rating,
      notes,
    }: {
      sessionId: string;
      rating?: number;
      notes?: string;
    }) => completeTutorSession(sessionId, rating, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TUTORING_SESSIONS],
      });
    },
  });
};

export const useUpdatePhotoContestSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      updates,
    }: {
      submissionId: string;
      updates: { caption?: string };
    }) => updatePhotoContestSubmission(submissionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PHOTO_CONTESTS],
      });
    },
  });
};

export const useUpdateInterestGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      updates,
    }: {
      groupId: string;
      updates: { name?: string; description?: string; icon_url?: string };
    }) => updateInterestGroup(groupId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUPS],
      });
    },
  });
};

export const useLeaveInterestGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => leaveInterestGroup(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_BY_ID, variables.groupId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INTEREST_GROUP_MEMBERS, variables.groupId],
      });
    },
  });
};

export const useUpdateAssignmentSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      status,
      feedback,
      grade,
    }: {
      submissionId: string;
      status: string;
      feedback?: string;
      grade?: number;
    }) => updateAssignmentSubmissionStatus(submissionId, status, feedback, grade),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSIGNMENTS],
      });
    },
  });
};

// ============================================================
// UPDATE MUTATIONS FOR GENERAL FEATURES
// ============================================================

export const useUpdateMemePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memeId,
      updates,
    }: {
      memeId: string;
      updates: { caption?: string; likes?: number };
    }) => updateMemePost(memeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEME_POSTS],
      });
    },
  });
};

export const useLikeMemePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memeId,
      likesArray,
    }: {
      memeId: string;
      likesArray: string[];
    }) => likeMemePost(memeId, likesArray),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEME_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useUpdateConfessionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      confessionId,
      status,
    }: {
      confessionId: string;
      status: string;
    }) => updateConfessionStatus(confessionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ANONYMOUS_CONFESSIONS],
      });
    },
  });
};

export const useUpdateJobApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      status,
      feedback,
    }: {
      applicationId: string;
      status: string;
      feedback?: string;
    }) => updateJobApplicationStatus(applicationId, status, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_JOB_APPLICATIONS],
      });
    },
  });
};

export const useUpdateLibraryReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reservationId,
      status,
    }: {
      reservationId: string;
      status: string;
    }) => updateLibraryReservationStatus(reservationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_BOOKS],
      });
    },
  });
};

export const useCancelLibraryReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationId: string) =>
      cancelLibraryReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIBRARY_BOOKS],
      });
    },
  });
};

export const useUpdateFacilityBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: string;
    }) => updateFacilityBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FACILITY_BOOKINGS],
      });
    },
  });
};

export const useCancelFacilityBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelFacilityBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FACILITY_BOOKINGS],
      });
    },
  });
};

export const useUpdateEventRsvpStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      status,
    }: {
      eventId: string;
      userId: string;
      status: string;
    }) => updateEventRsvpStatus(eventId, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_EVENT_RSVPS],
      });
    },
  });
};

export const useUpdateWellnessEventRsvpStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      status,
    }: {
      eventId: string;
      userId: string;
      status: string;
    }) => updateWellnessEventRsvpStatus(eventId, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_WELLNESS_EVENTS],
      });
    },
  });
};

export const useUpdateSharedNoteStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      noteId,
      isPublic,
    }: {
      noteId: string;
      isPublic: boolean;
    }) => updateSharedNoteStatus(noteId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SHARED_NOTES],
      });
    },
  });
};

export const useUpdateResourceVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      resourceId,
      isPublic,
    }: {
      resourceId: string;
      isPublic: boolean;
    }) => updateResourceVisibility(resourceId, isPublic),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RESOURCES],
      });
    },
  });
};
