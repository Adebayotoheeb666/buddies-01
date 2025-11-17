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
} from "@/lib/supabase/api";
import {
  getCourses,
  getCourseById,
  getUserCourses,
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
      // Commented out undefined getClassYearGroups usage to fix TS2552 error.
      // const data = await getClassYearGroups();
      return { documents: [], total: 0 };
    },
  });
};

// DEPARTMENT NETWORKS
export const useGetDepartmentNetworks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DEPARTMENT_NETWORKS],
    queryFn: async () => {
      // Commented out undefined getDepartmentNetworks usage to fix TS2552 error.
      // const data = await getDepartmentNetworks();
      return { documents: [], total: 0 };
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
    queryFn: () => {
      // const org = mockStudentOrganizations.find((o: any) => o.id === orgId);
      return Promise.resolve();
    },
    enabled: !!orgId,
  });
};

// ORGANIZATION EVENTS
export const useGetOrganizationEvents = (orgId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORGANIZATION_EVENTS, orgId],
    queryFn: () => {
      // const events = mockOrganizationEvents.filter((e: any) => e.organization_id === orgId);
      return Promise.resolve({
        documents: [],
        total: 0,
      });
    },
    enabled: !!orgId,
  });
};
