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
// ACADEMIC FEATURE QUERIES (MOCK DATA)
// ============================================================

import {
  mockCourses,
  mockCourseEnrollments,
  mockStudyGroups,
  mockAssignments,
  mockSharedNotes,
  mockSkills,
  mockUserSkills,
  mockProjectListings,
  mockTutoringProfiles,
  mockResources,
  mockQAQuestions,
  mockQAAnswers,
  mockUsers,
  mockUserConnections,
} from "@/lib/mockData/phase1MockData";

// COURSES
export const useGetCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSES],
    queryFn: () =>
      Promise.resolve({ documents: mockCourses, total: mockCourses.length }),
  });
};

export const useGetCourseById = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_BY_ID, courseId],
    queryFn: () => {
      const course = mockCourses.find((c) => c.id === courseId);
      return Promise.resolve(course);
    },
    enabled: !!courseId,
  });
};

export const useGetUserCourses = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_COURSES, userId],
    queryFn: () => {
      const enrollments = mockCourseEnrollments.filter(
        (e) => e.user_id === userId
      );
      const courses = enrollments
        .map((e) => mockCourses.find((c) => c.id === e.course_id))
        .filter(Boolean);
      return Promise.resolve({ documents: courses, total: courses.length });
    },
    enabled: !!userId,
  });
};

// STUDY GROUPS
export const useGetStudyGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDY_GROUPS],
    queryFn: () =>
      Promise.resolve({
        documents: mockStudyGroups,
        total: mockStudyGroups.length,
      }),
  });
};

export const useGetStudyGroupById = (groupId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STUDY_GROUP_BY_ID, groupId],
    queryFn: () => {
      const group = mockStudyGroups.find((g) => g.id === groupId);
      return Promise.resolve(group);
    },
    enabled: !!groupId,
  });
};

// ASSIGNMENTS
export const useGetAssignments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSIGNMENTS],
    queryFn: () =>
      Promise.resolve({
        documents: mockAssignments,
        total: mockAssignments.length,
      }),
  });
};

export const useGetAssignmentById = (assignmentId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSIGNMENT_BY_ID, assignmentId],
    queryFn: () => {
      const assignment = mockAssignments.find((a) => a.id === assignmentId);
      return Promise.resolve(assignment);
    },
    enabled: !!assignmentId,
  });
};

export const useGetCourseAssignments = (courseId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_ASSIGNMENTS, courseId],
    queryFn: () => {
      const assignments = mockAssignments.filter(
        (a) => a.course_id === courseId
      );
      return Promise.resolve({
        documents: assignments,
        total: assignments.length,
      });
    },
    enabled: !!courseId,
  });
};

// SHARED NOTES
export const useGetSharedNotes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SHARED_NOTES],
    queryFn: () =>
      Promise.resolve({
        documents: mockSharedNotes,
        total: mockSharedNotes.length,
      }),
  });
};

// SKILLS & PROJECT MATCHING
export const useGetSkills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SKILLS],
    queryFn: () =>
      Promise.resolve({ documents: mockSkills, total: mockSkills.length }),
  });
};

export const useGetUserSkills = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SKILLS, userId],
    queryFn: () => {
      const skills = mockUserSkills.filter((us) => us.user_id === userId);
      return Promise.resolve({ documents: skills, total: skills.length });
    },
    enabled: !!userId,
  });
};

export const useGetProjectListings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_LISTINGS],
    queryFn: () =>
      Promise.resolve({
        documents: mockProjectListings,
        total: mockProjectListings.length,
      }),
  });
};

// TUTORING
export const useGetTutoringProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TUTORING_PROFILES],
    queryFn: () =>
      Promise.resolve({
        documents: mockTutoringProfiles,
        total: mockTutoringProfiles.length,
      }),
  });
};

// RESOURCES
export const useGetResources = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RESOURCES],
    queryFn: () =>
      Promise.resolve({
        documents: mockResources,
        total: mockResources.length,
      }),
  });
};

// Q&A
export const useGetQAQuestions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_QA_QUESTIONS],
    queryFn: () =>
      Promise.resolve({
        documents: mockQAQuestions,
        total: mockQAQuestions.length,
      }),
  });
};

export const useGetQuestionById = (questionId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_QUESTION_BY_ID, questionId],
    queryFn: () => {
      const question = mockQAQuestions.find((q) => q.id === questionId);
      const answers = mockQAAnswers.filter((a) => a.question_id === questionId);
      return Promise.resolve({ question, answers });
    },
    enabled: !!questionId,
  });
};

// USER CONNECTIONS (FOLLOWERS)
export const useGetUserFollowing = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, userId],
    queryFn: () => {
      const connections = mockUserConnections.filter(
        (c) => c.follower_id === userId
      );
      const following = connections
        .map((c) => mockUsers.find((u) => u.id === c.following_id))
        .filter(Boolean);
      return Promise.resolve({ documents: following, total: following.length });
    },
    enabled: !!userId,
  });
};

export const useGetUserFollowers = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, userId],
    queryFn: () => {
      const connections = mockUserConnections.filter(
        (c) => c.following_id === userId
      );
      const followers = connections
        .map((c) => mockUsers.find((u) => u.id === c.follower_id))
        .filter(Boolean);
      return Promise.resolve({ documents: followers, total: followers.length });
    },
    enabled: !!userId,
  });
};
