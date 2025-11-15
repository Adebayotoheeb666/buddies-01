import { supabase } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";
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
  Skill,
  UserSkill,
} from "@/types/academic.types";
import {
  ClassYearGroup,
  ClassYearMember,
  DepartmentNetwork,
  DepartmentMember,
  InternationalStudentProfile,
  CommuterProfile,
  CampusPoll,
  PollOption,
  PollVote,
  InterestGroup,
  InterestGroupMember,
  MemePost,
  AnonymousConfession,
  StudentOrganization,
  OrganizationMember,
  OrganizationEvent,
  EventRSVP,
  EventCheckIn,
  RecruitmentPeriod,
  RecruitmentApplication,
} from "@/types/social.types";
import {
  CampusLocation,
  Classroom,
  BuildingRoute,
  DiningHall,
  Menu,
  MenuItem,
  DiningWaitTime,
  MealPlan,
  DiningReview,
  FoodReview,
  LibraryBook,
  BookCheckout,
  StudyRoomBooking,
  LibraryZone,
  BookHold,
  Facility,
  FacilityEquipment,
  FacilityBooking,
  FacilityReview,
} from "@/types/campus.types";
import {
  SafetyAlert,
  SafeWalkRequest,
  LocationShare,
  LocationUpdate,
  EmergencyResource,
  WellnessResource,
  CounselingAppointment,
  WellnessCheckIn,
  WellnessGoal,
  SupportForum,
  ForumThread,
  ForumReply,
  ContentReport,
  IntegrityFlag,
  ModerationAction,
  Appeal,
} from "@/types/safety.types";
import {
  Achievement,
  UserAchievement,
  UserPoints,
  PointTransaction,
  Leaderboard,
  LeaderboardEntry,
  SemesterRecap,
  Challenge,
  ChallengeParticipation,
  PhotoContest,
  PhotoSubmission,
  BucketList,
  BucketListItem,
  AttendanceStreak,
  UserAnalytics,
  FeatureUsage,
  CampusExploration,
  AdminMetrics,
  EngagementSummary,
  AtRiskStudent,
} from "@/types/gamification.types";
import {
  JobPosting,
  JobApplication,
  InternshipPosting,
  ApplicationTracking,
  CareerFair,
  CareerFairCompany,
  CareerFairMeeting,
  UserPortfolio,
  PortfolioProject,
  SkillEndorsement,
  AlumniProfile,
  MentorshipPair,
  MentorshipSession,
  MentorshipFeedback,
  CareerPath,
  AlumniEvent,
  AlumniNetwork,
  AlumniNetworkMember,
  ResearchOpportunity,
  ResearchApplication,
  ResearchProject,
  StartupOpportunity,
  StartupTeamMember,
  CoFounderProfile,
  PitchCompetition,
  PitchCompetitionRegistration,
} from "@/types/career.types";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Utility function to retry failed requests with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = (error as any).message || String(error);

      // Do NOT retry on "body stream already read" - this indicates the response
      // was already consumed and retrying won't help. Only retry on network errors.
      const isRetryableError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("ETIMEDOUT");

      if (!isRetryableError || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

// Utility function to safely serialize error objects for logging
function logErrorDetails(label: string, error: any): void {
  if (!error) {
    console.error(label, "Unknown error");
    return;
  }

  const serialized: Record<string, any> = {};

  try {
    // Handle Error objects
    if (error instanceof Error) {
      serialized.type = "Error";
      serialized.name = error.name;
      serialized.message = error.message;
      serialized.stack = error.stack;
    }

    // Extract own properties
    try {
      const ownProps = Object.getOwnPropertyNames(error);
      for (const key of ownProps) {
        try {
          const value = error[key];
          // Skip functions but include everything else
          if (typeof value !== "function") {
            serialized[key] = value;
          }
        } catch (e) {
          serialized[key] = "[Unable to access property]";
        }
      }
    } catch (e) {
      // Fallback: try enumerable properties
      for (const key in error) {
        try {
          const value = error[key];
          if (typeof value !== "function") {
            serialized[key] = value;
          }
        } catch (e) {
          serialized[key] = "[Unable to access property]";
        }
      }
    }

    // Ensure critical Supabase error properties
    if (error.message && !serialized.message) {
      serialized.message = error.message;
    }
    if (error.code && !serialized.code) {
      serialized.code = error.code;
    }
    if (error.status && !serialized.status) {
      serialized.status = error.status;
    }
    if ((error as any).details && !serialized.details) {
      serialized.details = (error as any).details;
    }
    if ((error as any).hint && !serialized.hint) {
      serialized.hint = (error as any).hint;
    }

    // Log as formatted JSON string to ensure proper display
    const errorLog = JSON.stringify(serialized, null, 2);
    console.error(label, "\n" + errorLog);
  } catch (e) {
    console.error(label, `Serialization failed: ${String(e)}`);
  }
}

// ============================================================
// AUTH
// ============================================================

export async function createUserAccount(user: INewUser) {
  let authUserId: string | null = null;

  try {
    // Create auth account directly without retry on body stream errors
    const authResult = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    const { data: authData, error: authError } = authResult;

    if (authError) {
      const errorMessage = authError.message || "Failed to create auth account";
      logErrorDetails("Auth signup error details:", authError);
      throw new Error(errorMessage);
    }

    if (!authData.user) {
      throw new Error("Failed to create auth account: No user returned");
    }

    authUserId = authData.user.id;

    // Wait a moment for the auth user to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create user profile in database using the authenticated session
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: "",
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      })
      .select()
      .single();

    if (dbError) {
      logErrorDetails("User profile insert error details:", dbError);
      throw new Error(dbError.message || "Failed to create user profile");
    }

    return userData;
  } catch (error) {
    logErrorDetails("createUserAccount error details:", error);

    // Note: We cannot clean up the auth account with just the anon key
    // The auth user will remain in the system but the profile creation failed
    // This should be handled by the user retrying signup or contacting support

    throw error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const { data, error } = await retryWithBackoff(
      () =>
        supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        }),
      3,
      200
    );

    if (error) {
      const errorMessage = error.message || "Sign in failed";
      logErrorDetails("signInAccount error details:", error);
      throw new Error(errorMessage);
    }

    if (!data.session) {
      throw new Error("Sign in failed: No session returned");
    }

    return data.session;
  } catch (error) {
    logErrorDetails("signInAccount try-catch error details:", error);
    throw error;
  }
}

export async function getAccount() {
  try {
    const { data, error } = await retryWithBackoff(
      () => supabase.auth.getUser(),
      3,
      200
    );
    const { user } = data;

    if (error) {
      logErrorDetails("getAccount - Auth error details:", error);
      throw error;
    }

    return user;
  } catch (error) {
    logErrorDetails("getAccount - Error details:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error: authError } = await retryWithBackoff(
      () => supabase.auth.getUser(),
      3,
      200
    );
    const { user: authUser } = data;

    if (authError) {
      logErrorDetails("getCurrentUser - Auth error details:", authError);
      return null;
    }

    if (!authUser) {
      console.warn("getCurrentUser - No authenticated user found");
      return null;
    }

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select()
      .eq("id", authUser.id)
      .single();

    if (dbError) {
      logErrorDetails("getCurrentUser - Database error details:", dbError);
      return null;
    }

    return userData;
  } catch (error) {
    logErrorDetails("getCurrentUser - Try-catch error details:", error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

export async function createPost(post: INewPost) {
  try {
    // Upload file to Supabase storage
    const fileName = `${Date.now()}_${post.file[0].name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("posts")
      .upload(`public/${fileName}`, post.file[0]);

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(`public/${fileName}`);

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        creator: post.userId,
        caption: post.caption,
        imageUrl: publicUrl,
        imageName: fileName,
        location: post.location || "",
        tags: tags,
        likes: [],
      })
      .select()
      .single();

    if (postError) {
      // Clean up storage if post creation fails
      await supabase.storage.from("posts").remove([`public/${fileName}`]);
      throw postError;
    }

    return postData;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("posts")
      .upload(`public/${fileName}`, file);

    if (error) throw error;

    return { name: fileName, ...data };
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileName: string) {
  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(`public/${fileName}`);

    if (!publicUrl) throw new Error("Failed to get file preview");

    return publicUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileName: string) {
  try {
    const { error } = await supabase.storage
      .from("posts")
      .remove([`public/${fileName}`]);

    if (error) throw error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("caption", `%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { documents: data || [], total: data?.length || 0 };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  try {
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(9);

    if (pageParam) {
      const { data: offset } = await supabase
        .from("posts")
        .select("id")
        .eq("id", pageParam)
        .single();

      if (offset) {
        query = query.range(1, 9);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    return { documents: data || [], total: data?.length || 0 };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw new Error("Post ID is required");

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let imageUrl = post.imageUrl;
    let imageName = post.imageId;

    if (hasFileToUpdate) {
      // Upload new file
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload file");

      // Get new file URL
      const fileUrl = getFilePreview(uploadedFile.name);
      if (!fileUrl) {
        await deleteFile(uploadedFile.name);
        throw new Error("Failed to get file preview");
      }

      imageUrl = fileUrl;
      imageName = uploadedFile.name;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post
    const { data, error } = await supabase
      .from("posts")
      .update({
        caption: post.caption,
        imageUrl: imageUrl,
        imageName: imageName,
        location: post.location || "",
        tags: tags,
      })
      .eq("id", post.postId)
      .select()
      .single();

    if (error) {
      if (hasFileToUpdate) {
        await deleteFile(imageName);
      }
      throw error;
    }

    // Delete old file after successful update
    if (hasFileToUpdate && post.imageId) {
      await deleteFile(post.imageId);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) throw error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likesArray })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(userId: string, postId: string) {
  try {
    const { data, error } = await supabase
      .from("saves")
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("id", savedRecordId);

    if (error) throw error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("creator", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { documents: data || [], total: data?.length || 0 };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return { documents: data || [], total: data?.length || 0 };
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

export async function getUsers(limit?: number) {
  try {
    let query = supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { documents: data || [], total: data?.length || 0 };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;

  try {
    let imageUrl = user.imageUrl;
    let imageName = user.imageId;

    if (hasFileToUpdate) {
      // Upload new file
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload file");

      // Get new file URL
      const fileUrl = getFilePreview(uploadedFile.name);
      if (!fileUrl) {
        await deleteFile(uploadedFile.name);
        throw new Error("Failed to get file preview");
      }

      imageUrl = fileUrl;
      imageName = uploadedFile.name;
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        name: user.name,
        bio: user.bio,
        imageUrl: imageUrl,
        imageId: imageName,
      })
      .eq("id", user.userId)
      .select()
      .single();

    if (error) {
      if (hasFileToUpdate) {
        await deleteFile(imageName);
      }
      throw error;
    }

    // Delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 4: SOCIAL NETWORKING & CLUB MANAGEMENT
// ============================================================

// ============================================================
// CLASS YEAR NETWORKS
// ============================================================

export async function getClassYearGroup(classYear: string) {
  try {
    const { data, error } = await supabase
      .from("class_year_groups")
      .select("*")
      .eq("class_year", classYear)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function joinClassYearGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("class_year_members")
      .insert({ group_id: groupId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function isUserInClassYearGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("class_year_members")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return !!data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// ============================================================
// DEPARTMENT NETWORKS
// ============================================================

export async function getDepartmentNetworks() {
  try {
    const { data, error } = await supabase
      .from("department_networks")
      .select("*")
      .order("department", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getDepartmentNetwork(networkId: string) {
  try {
    const { data, error } = await supabase
      .from("department_networks")
      .select("*")
      .eq("id", networkId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function joinDepartmentNetwork(networkId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("department_members")
      .insert({ network_id: networkId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function leaveDepartmentNetwork(
  networkId: string,
  userId: string
) {
  try {
    const { error } = await supabase
      .from("department_members")
      .delete()
      .eq("network_id", networkId)
      .eq("user_id", userId);

    if (error) throw error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function isUserInDepartmentNetwork(
  networkId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("department_members")
      .select("*")
      .eq("network_id", networkId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return !!data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// ============================================================
// CAMPUS POLLS
// ============================================================

export async function getPolls() {
  try {
    const { data, error } = await supabase
      .from("campus_polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPoll(pollId: string) {
  try {
    const { data: poll, error: pollError } = await supabase
      .from("campus_polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollError) throw pollError;

    const { data: options, error: optionsError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId);

    if (optionsError) throw optionsError;

    return { ...poll, options: options || [] };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createPoll(
  creatorId: string,
  title: string,
  description: string,
  pollType: string,
  expiresAt: string,
  options: string[]
) {
  try {
    const { data: poll, error: pollError } = await supabase
      .from("campus_polls")
      .insert({
        creator_id: creatorId,
        title,
        description,
        poll_type: pollType,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (pollError) throw pollError;

    const pollOptions = options.map((option) => ({
      poll_id: poll.id,
      option_text: option,
    }));

    const { data, error: optionsError } = await supabase
      .from("poll_options")
      .insert(pollOptions)
      .select();

    if (optionsError) throw optionsError;

    return { ...poll, options: data || [] };
  } catch (error) {
    console.log(error);
  }
}

export async function votePoll(
  pollId: string,
  optionId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("poll_votes")
      .insert({ poll_id: pollId, option_id: optionId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// INTEREST GROUPS
// ============================================================

export async function getInterestGroups() {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .eq("is_private", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getInterestGroup(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createInterestGroup(
  name: string,
  description: string,
  interests: string[],
  creatorId: string,
  isPrivate: boolean = false
) {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .insert({
        name,
        description,
        interests,
        creator_id: creatorId,
        is_private: isPrivate,
        member_count: 1,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("interest_group_members")
      .insert({ group_id: data.id, user_id: creatorId });

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function joinInterestGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_group_members")
      .insert({ group_id: groupId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function leaveInterestGroup(groupId: string, userId: string) {
  try {
    const { error } = await supabase
      .from("interest_group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) throw error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function isUserInInterestGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_group_members")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return !!data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// ============================================================
// MEME BOARD
// ============================================================

export async function getMemeBoard() {
  try {
    const { data, error } = await supabase
      .from("meme_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createMemePost(
  creatorId: string,
  imageUrl: string,
  caption: string
) {
  try {
    const { data, error } = await supabase
      .from("meme_posts")
      .insert({ creator_id: creatorId, image_url: imageUrl, caption })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function likeMemePost(postId: string) {
  try {
    const { data, error } = await supabase
      .from("meme_posts")
      .update({ likes: supabase.rpc("increment") })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// ANONYMOUS CONFESSIONS
// ============================================================

export async function getConfessions() {
  try {
    const { data, error } = await supabase
      .from("anonymous_confessions")
      .select("*")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createConfession(
  posterId: string,
  content: string,
  anonymityStatus: string
) {
  try {
    const { data, error } = await supabase
      .from("anonymous_confessions")
      .insert({
        poster_id: posterId,
        content,
        anonymity_status: anonymityStatus,
        moderation_status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// STUDENT ORGANIZATIONS
// ============================================================

export async function getOrganizations() {
  try {
    const { data, error } = await supabase
      .from("student_organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getOrganization(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from("student_organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createOrganization(
  name: string,
  acronym: string,
  description: string,
  category: string,
  presidentId: string,
  email: string,
  meetingSchedule: string
) {
  try {
    const { data, error } = await supabase
      .from("student_organizations")
      .insert({
        name,
        acronym,
        description,
        category,
        president_id: presidentId,
        email,
        meeting_schedule: meetingSchedule,
        total_members: 1,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("organization_members").insert({
      organization_id: data.id,
      user_id: presidentId,
      role: "president",
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function joinOrganization(organizationId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        role: "member",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function leaveOrganization(
  organizationId: string,
  userId: string
) {
  try {
    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) throw error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function isUserInOrganization(
  organizationId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return !!data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUserOrganizations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId);

    if (error) throw error;

    const orgIds = data?.map((m) => m.organization_id) || [];

    if (orgIds.length === 0) return [];

    const { data: orgs, error: orgsError } = await supabase
      .from("student_organizations")
      .select("*")
      .in("id", orgIds);

    if (orgsError) throw orgsError;

    return orgs || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// ORGANIZATION EVENTS
// ============================================================

export async function getOrganizationEvents(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_events")
      .select("*")
      .eq("organization_id", organizationId)
      .order("event_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getEvent(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createEvent(
  organizationId: string,
  title: string,
  description: string,
  eventDate: string,
  locationId: string | null,
  eventType: string,
  capacity: number,
  createdById: string
) {
  try {
    const { data, error } = await supabase
      .from("organization_events")
      .insert({
        organization_id: organizationId,
        title,
        description,
        event_date: eventDate,
        location_id: locationId,
        event_type: eventType,
        capacity,
        created_by_id: createdById,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// EVENT RSVP
// ============================================================

export async function rsvpEvent(
  eventId: string,
  userId: string,
  status: string
) {
  try {
    const { data, error } = await supabase
      .from("event_rsvps")
      .insert({ event_id: eventId, user_id: userId, status })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getEventRSVPs(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("*")
      .eq("event_id", eventId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserEventRSVP(eventId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================================================
// EVENT CHECK-IN
// ============================================================

export async function checkInEvent(eventId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("event_check_ins")
      .insert({ event_id: eventId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getEventCheckIns(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("event_check_ins")
      .select("*")
      .eq("event_id", eventId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// ORGANIZATION RECRUITMENT
// ============================================================

export async function createRecruitmentPeriod(
  organizationId: string,
  startDate: string,
  endDate: string
) {
  try {
    const { data, error } = await supabase
      .from("recruitment_periods")
      .insert({
        organization_id: organizationId,
        start_date: startDate,
        end_date: endDate,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecruitmentPeriods(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from("recruitment_periods")
      .select("*")
      .eq("organization_id", organizationId)
      .order("start_date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function applyToRecruitment(
  recruitmentPeriodId: string,
  applicantId: string
) {
  try {
    const { data, error } = await supabase
      .from("recruitment_applications")
      .insert({
        recruitment_period_id: recruitmentPeriodId,
        applicant_id: applicantId,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecruitmentApplications(recruitmentPeriodId: string) {
  try {
    const { data, error } = await supabase
      .from("recruitment_applications")
      .select("*")
      .eq("recruitment_period_id", recruitmentPeriodId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  try {
    const { data, error } = await supabase
      .from("recruitment_applications")
      .update({ status })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 3: CAMPUS MAP & NAVIGATION
// ============================================================

export async function getCampusLocations() {
  try {
    const { data, error } = await supabase
      .from("campus_locations")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCampusLocation(locationId: string) {
  try {
    const { data, error } = await supabase
      .from("campus_locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function searchCampusLocations(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from("campus_locations")
      .select("*")
      .ilike("name", `%${searchTerm}%`)
      .or(`description.ilike.%${searchTerm}%`)
      .order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getClassrooms() {
  try {
    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .order("building_name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function searchClassrooms(
  buildingName?: string,
  roomNumber?: string
) {
  try {
    let query = supabase.from("classrooms").select("*");

    if (buildingName) {
      query = query.ilike("building_name", `%${buildingName}%`);
    }

    if (roomNumber) {
      query = query.ilike("room_number", `%${roomNumber}%`);
    }

    const { data, error } = await query.order("building_name", {
      ascending: true,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getRoute(fromLocationId: string, toLocationId: string) {
  try {
    const { data, error } = await supabase
      .from("building_routes")
      .select("*")
      .eq("from_location_id", fromLocationId)
      .eq("to_location_id", toLocationId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllRoutes() {
  try {
    const { data, error } = await supabase.from("building_routes").select("*");

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// PHASE 3: DINING SERVICES
// ============================================================

export async function getDiningHalls() {
  try {
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getDiningHall(diningHallId: string) {
  try {
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .eq("id", diningHallId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMenus(diningHallId: string, menuDate?: string) {
  try {
    let query = supabase
      .from("menus")
      .select("*")
      .eq("dining_hall_id", diningHallId);

    if (menuDate) {
      query = query.eq("menu_date", menuDate);
    }

    const { data, error } = await query.order("meal_type", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getMenuItems(menuId: string) {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menuId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function reportWaitTime(
  diningHallId: string,
  userId: string,
  waitTimeMinutes: number
) {
  try {
    const { data, error } = await supabase
      .from("dining_wait_times")
      .insert({
        dining_hall_id: diningHallId,
        reported_by_id: userId,
        wait_time_minutes: waitTimeMinutes,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getLatestWaitTime(diningHallId: string) {
  try {
    const { data, error } = await supabase
      .from("dining_wait_times")
      .select("*")
      .eq("dining_hall_id", diningHallId)
      .order("reported_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserMealPlan(userId: string) {
  try {
    const { data, error } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createDiningReview(
  diningHallId: string,
  reviewerId: string,
  rating: number,
  reviewText?: string,
  foodQualityRating?: number,
  cleanlinessRating?: number,
  serviceRating?: number
) {
  try {
    const { data, error } = await supabase
      .from("dining_reviews")
      .insert({
        dining_hall_id: diningHallId,
        reviewer_id: reviewerId,
        rating,
        review_text: reviewText,
        food_quality_rating: foodQualityRating,
        cleanliness_rating: cleanlinessRating,
        service_rating: serviceRating,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDiningReviews(diningHallId: string) {
  try {
    const { data, error } = await supabase
      .from("dining_reviews")
      .select("*")
      .eq("dining_hall_id", diningHallId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// PHASE 3: LIBRARY SYSTEM
// ============================================================

export async function getLibraryBooks(filters?: {
  title?: string;
  author?: string;
  subject?: string;
}) {
  try {
    let query = supabase.from("library_books").select("*");

    if (filters?.title) {
      query = query.ilike("title", `%${filters.title}%`);
    }

    if (filters?.author) {
      query = query.ilike("author", `%${filters.author}%`);
    }

    if (filters?.subject) {
      query = query.ilike("subject", `%${filters.subject}%`);
    }

    const { data, error } = await query.order("title", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getLibraryBook(bookId: string) {
  try {
    const { data, error } = await supabase
      .from("library_books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function checkoutBook(
  userId: string,
  bookId: string,
  dueDate: string
) {
  try {
    const { data, error } = await supabase
      .from("book_checkouts")
      .insert({
        user_id: userId,
        book_id: bookId,
        checkout_date: new Date().toISOString(),
        due_date: dueDate,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserCheckouts(userId: string) {
  try {
    const { data, error } = await supabase
      .from("book_checkouts")
      .select("*")
      .eq("user_id", userId)
      .is("return_date", null)
      .order("due_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function returnBook(checkoutId: string) {
  try {
    const { data, error } = await supabase
      .from("book_checkouts")
      .update({ return_date: new Date().toISOString() })
      .eq("id", checkoutId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getStudyRooms() {
  try {
    const { data, error } = await supabase
      .from("study_room_bookings")
      .select("*")
      .order("room_name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function bookStudyRoom(
  userId: string,
  roomName: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
  capacity: number,
  amenities?: string[]
) {
  try {
    const { data, error } = await supabase
      .from("study_room_bookings")
      .insert({
        user_id: userId,
        room_name: roomName,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        capacity,
        amenities,
        status: "confirmed",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserStudyRoomBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("study_room_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("booking_date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getLibraryZones() {
  try {
    const { data, error } = await supabase
      .from("library_zones")
      .select("*")
      .order("zone_name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function placeBookHold(userId: string, bookId: string) {
  try {
    const existingHolds = await supabase
      .from("book_holds")
      .select("*")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });

    const position = (existingHolds.data?.length || 0) + 1;

    const { data, error } = await supabase
      .from("book_holds")
      .insert({
        user_id: userId,
        book_id: bookId,
        position_in_queue: position,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserBookHolds(userId: string) {
  try {
    const { data, error } = await supabase
      .from("book_holds")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// PHASE 3: FACILITIES BOOKING
// ============================================================

export async function getFacilities(filters?: {
  facilityType?: string;
  location?: string;
}) {
  try {
    let query = supabase.from("facilities").select("*");

    if (filters?.facilityType) {
      query = query.eq("facility_type", filters.facilityType);
    }

    const { data, error } = await query.order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getFacility(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("id", facilityId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getFacilityEquipment(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from("facility_equipment")
      .select("*")
      .eq("facility_id", facilityId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function bookFacility(
  userId: string,
  facilityId: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
  numberOfPeople: number,
  purpose?: string
) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .insert({
        user_id: userId,
        facility_id: facilityId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        number_of_people: numberOfPeople,
        purpose,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFacilityBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("booking_date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getFacilityBookings(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .select("*")
      .eq("facility_id", facilityId)
      .order("booking_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateFacilityBookingStatus(
  bookingId: string,
  status: string
) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .update({ status })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createFacilityReview(
  facilityId: string,
  reviewerId: string,
  rating: number,
  reviewText?: string
) {
  try {
    const { data, error } = await supabase
      .from("facility_reviews")
      .insert({
        facility_id: facilityId,
        reviewer_id: reviewerId,
        rating,
        review_text: reviewText,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getFacilityReviews(facilityId: string) {
  try {
    const { data, error } = await supabase
      .from("facility_reviews")
      .select("*")
      .eq("facility_id", facilityId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// ============================================================
// PHASE 5: CAREER SERVICES & JOB BOARD
// ============================================================

export async function getJobPostings(filters?: {
  jobType?: string;
  location?: string;
}) {
  try {
    let query = supabase.from("job_postings").select("*");

    if (filters?.jobType) {
      query = query.eq("job_type", filters.jobType);
    }

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getJobPosting(jobId: string) {
  try {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function applyToJob(
  userId: string,
  jobId: string,
  resumeUrl?: string,
  coverLetter?: string
) {
  try {
    const { data, error } = await supabase
      .from("job_applications")
      .insert({
        applicant_id: userId,
        job_posting_id: jobId,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        status: "applied",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserJobApplications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("applicant_id", userId)
      .order("applied_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getInternshipPostings() {
  try {
    const { data, error } = await supabase
      .from("internship_board")
      .select("*")
      .order("deadline", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getApplicationTracking(userId: string) {
  try {
    const { data, error } = await supabase
      .from("application_tracking")
      .select("*")
      .eq("user_id", userId)
      .order("status_date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createApplicationTracking(
  userId: string,
  companyName: string,
  positionTitle: string,
  status: string,
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from("application_tracking")
      .insert({
        user_id: userId,
        company_name: companyName,
        position_title: positionTitle,
        status,
        status_date: new Date().toISOString(),
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCareerFairs() {
  try {
    const { data, error } = await supabase
      .from("career_fairs")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCareerFairCompanies(fairId: string) {
  try {
    const { data, error } = await supabase
      .from("career_fair_companies")
      .select("*")
      .eq("career_fair_id", fairId)
      .order("booth_number", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function scheduleCareerFairMeeting(
  userId: string,
  fairId: string,
  companyId: string,
  meetingTime: string
) {
  try {
    const { data, error } = await supabase
      .from("career_fair_meetings")
      .insert({
        career_fair_id: fairId,
        student_id: userId,
        company_id: companyId,
        meeting_time: meetingTime,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPortfolio(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_portfolios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUserPortfolio(
  userId: string,
  resumeUrl?: string,
  portfolioUrl?: string,
  linkedinUrl?: string,
  githubUrl?: string,
  personalWebsite?: string,
  bio?: string
) {
  try {
    const existing = await getUserPortfolio(userId);

    if (existing) {
      const { data, error } = await supabase
        .from("user_portfolios")
        .update({
          resume_url: resumeUrl,
          portfolio_url: portfolioUrl,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          personal_website: personalWebsite,
          bio,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } else {
      const { data, error } = await supabase
        .from("user_portfolios")
        .insert({
          user_id: userId,
          resume_url: resumeUrl,
          portfolio_url: portfolioUrl,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          personal_website: personalWebsite,
          bio,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPortfolioProjects(portfolioId: string) {
  try {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addPortfolioProject(
  portfolioId: string,
  title: string,
  description?: string,
  technologies?: string[],
  projectUrl?: string,
  imageUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({
        portfolio_id: portfolioId,
        title,
        description,
        technologies,
        project_url: projectUrl,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 5: ALUMNI NETWORK & MENTORSHIP
// ============================================================

export async function getAlumniProfiles(filters?: {
  industry?: string;
  company?: string;
}) {
  try {
    let query = supabase.from("alumni_profiles").select("*");

    if (filters?.industry) {
      query = query.ilike("industry", `%${filters.industry}%`);
    }

    if (filters?.company) {
      query = query.ilike("current_company", `%${filters.company}%`);
    }

    const { data, error } = await query.order("graduation_year", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAlumniProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("alumni_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function requestMentorship(
  menteeId: string,
  mentorId: string,
  goal?: string
) {
  try {
    const { data, error } = await supabase
      .from("mentorship_pairs")
      .insert({
        mentor_id: mentorId,
        mentee_id: menteeId,
        goal,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserMentorships(
  userId: string,
  role: "mentor" | "mentee"
) {
  try {
    let query = supabase.from("mentorship_pairs").select("*");

    if (role === "mentor") {
      query = query.eq("mentor_id", userId);
    } else {
      query = query.eq("mentee_id", userId);
    }

    const { data, error } = await query.order("started_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function logMentorshipSession(
  pairId: string,
  topic?: string,
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from("mentorship_sessions")
      .insert({
        pair_id: pairId,
        session_date: new Date().toISOString(),
        topic,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getMentorshipSessions(pairId: string) {
  try {
    const { data, error } = await supabase
      .from("mentorship_sessions")
      .select("*")
      .eq("pair_id", pairId)
      .order("session_date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createMentorshipFeedback(
  pairId: string,
  rating: number,
  feedbackText?: string
) {
  try {
    const { data, error } = await supabase
      .from("mentorship_feedback")
      .insert({
        pair_id: pairId,
        rating,
        feedback_text: feedbackText,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCareerPaths() {
  try {
    const { data, error } = await supabase
      .from("career_paths")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAlumniEvents() {
  try {
    const { data, error } = await supabase
      .from("alumni_events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAlumniNetworks() {
  try {
    const { data, error } = await supabase
      .from("alumni_networks")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function joinAlumniNetwork(networkId: string, alumniId: string) {
  try {
    const { data, error } = await supabase
      .from("alumni_network_members")
      .insert({
        network_id: networkId,
        alumni_id: alumniId,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 5: RESEARCH & STARTUP OPPORTUNITIES
// ============================================================

export async function getResearchOpportunities() {
  try {
    const { data, error } = await supabase
      .from("research_opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getResearchOpportunity(opportunityId: string) {
  try {
    const { data, error } = await supabase
      .from("research_opportunities")
      .select("*")
      .eq("id", opportunityId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function applyToResearch(
  userId: string,
  opportunityId: string,
  cvUrl?: string,
  motivationStatement?: string
) {
  try {
    const { data, error } = await supabase
      .from("research_applications")
      .insert({
        opportunity_id: opportunityId,
        applicant_id: userId,
        cv_url: cvUrl,
        motivation_statement: motivationStatement,
        status: "applied",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserResearchApplications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("research_applications")
      .select("*")
      .eq("applicant_id", userId)
      .order("applied_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStartupOpportunities(stage?: string) {
  try {
    let query = supabase.from("startup_opportunities").select("*");

    if (stage) {
      query = query.eq("stage", stage);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getStartupOpportunity(startupId: string) {
  try {
    const { data, error } = await supabase
      .from("startup_opportunities")
      .select("*")
      .eq("id", startupId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createStartup(
  creatorId: string,
  startupName: string,
  description?: string,
  stage?: string,
  lookingFor?: string[],
  skillsNeeded?: string[],
  equityOffered?: number
) {
  try {
    const { data, error } = await supabase
      .from("startup_opportunities")
      .insert({
        creator_id: creatorId,
        startup_name: startupName,
        description,
        stage: stage || "idea",
        looking_for: lookingFor,
        skills_needed: skillsNeeded,
        equity_offered: equityOffered,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getStartupTeamMembers(startupId: string) {
  try {
    const { data, error } = await supabase
      .from("startup_team_members")
      .select("*")
      .eq("startup_id", startupId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addStartupTeamMember(
  startupId: string,
  userId: string,
  role: string,
  equityPercent?: number
) {
  try {
    const { data, error } = await supabase
      .from("startup_team_members")
      .insert({
        startup_id: startupId,
        user_id: userId,
        role,
        equity_percent: equityPercent,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCoFounderMatches(filters?: {
  industryInterest?: string;
}) {
  try {
    let query = supabase
      .from("cofounder_profiles")
      .select("*")
      .eq("looking_for_cofounders", true);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPitchCompetitions() {
  try {
    const { data, error } = await supabase
      .from("pitch_competitions")
      .select("*")
      .order("competition_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function registerPitchCompetition(
  competitionId: string,
  teamLeadId: string,
  pitchTitle?: string,
  pitchVideoUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from("pitch_competition_registrations")
      .insert({
        competition_id: competitionId,
        team_lead_id: teamLeadId,
        pitch_title: pitchTitle,
        pitch_video_url: pitchVideoUrl,
        status: "registered",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 6: SAFETY, WELLNESS & ADMINISTRATIVE FEATURES
// ============================================================

// SAFETY & EMERGENCY FEATURES

export async function getSafetyAlerts() {
  try {
    const { data, error } = await supabase
      .from("safety_alerts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createSafetyAlert(
  alertType: string,
  title: string,
  description?: string,
  locationId?: string,
  severity?: string,
  issuedById?: string
) {
  try {
    const { data, error } = await supabase
      .from("safety_alerts")
      .insert({
        alert_type: alertType,
        title,
        description,
        location_id: locationId,
        severity: severity || "medium",
        issued_by_id: issuedById,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSafeWalkRequests(userId: string) {
  try {
    const { data, error } = await supabase
      .from("safe_walk_requests")
      .select("*")
      .or(`requester_id.eq.${userId},escort_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function requestSafeWalk(
  requesterId: string,
  fromLocation: string,
  toLocation: string
) {
  try {
    const { data, error } = await supabase
      .from("safe_walk_requests")
      .insert({
        requester_id: requesterId,
        from_location: fromLocation,
        to_location: toLocation,
        request_time: new Date().toISOString(),
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function acceptSafeWalkRequest(
  requestId: string,
  escortId: string
) {
  try {
    const { data, error } = await supabase
      .from("safe_walk_requests")
      .update({
        escort_id: escortId,
        status: "in_progress",
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function completeSafeWalk(requestId: string) {
  try {
    const { data, error } = await supabase
      .from("safe_walk_requests")
      .update({
        status: "completed",
        completion_time: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function shareLocation(
  sharer_id: string,
  shared_with_id: string,
  expiresAt: string
) {
  try {
    const { data, error } = await supabase
      .from("location_shares")
      .insert({
        sharer_id,
        shared_with_id,
        expires_at: expiresAt,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateLocationUpdate(
  userId: string,
  latitude: number,
  longitude: number,
  safeWalkId?: string
) {
  try {
    const { data, error } = await supabase
      .from("location_updates")
      .insert({
        user_id: userId,
        latitude,
        longitude,
        safe_walk_id: safeWalkId,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getEmergencyResources() {
  try {
    const { data, error } = await supabase
      .from("emergency_resources")
      .select("*")
      .order("resource_type", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

// MENTAL HEALTH & WELLNESS

export async function getWellnessResources() {
  try {
    const { data, error } = await supabase
      .from("wellness_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCounselingAppointments(userId: string) {
  try {
    const { data, error } = await supabase
      .from("counseling_appointments")
      .select("*")
      .eq("user_id", userId)
      .order("appointment_date", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function scheduleCounselingAppointment(
  userId: string,
  counselorName: string,
  appointmentDate: string
) {
  try {
    const { data, error } = await supabase
      .from("counseling_appointments")
      .insert({
        user_id: userId,
        counselor_name: counselorName,
        appointment_date: appointmentDate,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createWellnessCheckIn(
  userId: string,
  moodScore: number,
  stressLevel: number,
  sleepHours: number,
  exerciseMinutes: number,
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from("wellness_checkins")
      .insert({
        user_id: userId,
        mood_score: moodScore,
        stress_level: stressLevel,
        sleep_hours: sleepHours,
        exercise_minutes: exerciseMinutes,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserWellnessCheckIns(userId: string) {
  try {
    const { data, error } = await supabase
      .from("wellness_checkins")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createWellnessGoal(
  userId: string,
  goalType: string,
  targetValue: string,
  frequency: string
) {
  try {
    const { data, error } = await supabase
      .from("wellness_goals")
      .insert({
        user_id: userId,
        goal_type: goalType,
        target_value: targetValue,
        frequency,
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserWellnessGoals(userId: string) {
  try {
    const { data, error } = await supabase
      .from("wellness_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSupportForums() {
  try {
    const { data, error } = await supabase
      .from("support_forums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getForumThreads(forumId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .select("*")
      .eq("forum_id", forumId)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createForumThread(
  forumId: string,
  creatorId: string,
  title: string,
  content: string,
  isAnonymous?: boolean
) {
  try {
    const { data, error } = await supabase
      .from("forum_threads")
      .insert({
        forum_id: forumId,
        creator_id: creatorId,
        title,
        content,
        is_anonymous: isAnonymous || true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getForumReplies(threadId: string) {
  try {
    const { data, error } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createForumReply(
  threadId: string,
  replierId: string,
  content: string,
  isAnonymous?: boolean
) {
  try {
    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        thread_id: threadId,
        replier_id: replierId,
        content,
        is_anonymous: isAnonymous || true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ACADEMIC INTEGRITY & MODERATION

export async function reportContent(
  reportedContentId: string,
  reportedContentType: string,
  reporterId: string,
  reason: string,
  description?: string
) {
  try {
    const { data, error } = await supabase
      .from("content_reports")
      .insert({
        reported_content_id: reportedContentId,
        reported_content_type: reportedContentType,
        reporter_id: reporterId,
        reason,
        description,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getContentReports() {
  try {
    const { data, error } = await supabase
      .from("content_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateContentReportStatus(
  reportId: string,
  status: string,
  reviewedById?: string
) {
  try {
    const { data, error } = await supabase
      .from("content_reports")
      .update({
        status,
        reviewed_by_id: reviewedById,
      })
      .eq("id", reportId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createIntegrityFlag(
  flaggedUserId: string,
  flagType: string,
  description?: string,
  evidenceLink?: string
) {
  try {
    const { data, error } = await supabase
      .from("integrity_flags")
      .insert({
        flagged_user_id: flaggedUserId,
        flag_type: flagType,
        description,
        evidence_link: evidenceLink,
        status: "reported",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getIntegrityFlags() {
  try {
    const { data, error } = await supabase
      .from("integrity_flags")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateIntegrityFlagStatus(
  flagId: string,
  status: string,
  resolvedById?: string
) {
  try {
    const { data, error } = await supabase
      .from("integrity_flags")
      .update({
        status,
        resolved_by_id: resolvedById,
      })
      .eq("id", flagId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function takeModerationAction(
  contentId: string,
  moderatorId: string,
  actionType: string,
  reason: string,
  appealAllowed?: boolean
) {
  try {
    const { data, error } = await supabase
      .from("moderation_actions")
      .insert({
        content_id: contentId,
        moderator_id: moderatorId,
        action_type: actionType,
        reason,
        appeal_allowed: appealAllowed !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getModerationActions() {
  try {
    const { data, error } = await supabase
      .from("moderation_actions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function submitAppeal(
  userId: string,
  moderationActionId: string,
  appealText: string
) {
  try {
    const { data, error } = await supabase
      .from("appeals")
      .insert({
        user_id: userId,
        moderation_action_id: moderationActionId,
        appeal_text: appealText,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserAppeals(userId: string) {
  try {
    const { data, error } = await supabase
      .from("appeals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAppeals() {
  try {
    const { data, error } = await supabase
      .from("appeals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function reviewAppeal(
  appealId: string,
  status: string,
  reviewedById: string,
  decisionText?: string
) {
  try {
    const { data, error } = await supabase
      .from("appeals")
      .update({
        status,
        reviewed_by_id: reviewedById,
        decision_text: decisionText,
      })
      .eq("id", appealId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PHASE 7: GAMIFICATION & ANALYTICS
// ============================================================

// 7.1 ENGAGEMENT & GAMIFICATION

export async function getAchievements() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("points_reward", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getUserPoints(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addPointTransaction(
  userId: string,
  points: number,
  transactionType: string,
  description?: string
) {
  try {
    const { data, error } = await supabase
      .from("point_transactions")
      .insert({
        user_id: userId,
        points,
        transaction_type: transactionType,
        description,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getLeaderboards() {
  try {
    const { data, error } = await supabase
      .from("leaderboards")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getLeaderboardEntries(leaderboardId: string) {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("leaderboard_id", leaderboardId)
      .order("rank", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSemesterRecap(userId: string, semester: string) {
  try {
    const { data, error } = await supabase
      .from("semester_recaps")
      .select("*")
      .eq("user_id", userId)
      .eq("semester", semester)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function participateInChallenge(
  challengeId: string,
  userId: string,
  submissionText?: string,
  submissionImageUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from("challenge_participations")
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        submission_text: submissionText,
        submission_image_url: submissionImageUrl,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserChallengeParticipations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("challenge_participations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPhotoContests() {
  try {
    const { data, error } = await supabase
      .from("photo_contests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function submitPhotoContestEntry(
  contestId: string,
  submitterId: string,
  photoUrl: string,
  caption?: string
) {
  try {
    const { data, error } = await supabase
      .from("photo_submissions")
      .insert({
        contest_id: contestId,
        submitter_id: submitterId,
        photo_url: photoUrl,
        caption,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPhotoContestSubmissions(contestId: string) {
  try {
    const { data, error } = await supabase
      .from("photo_submissions")
      .select("*")
      .eq("contest_id", contestId)
      .order("votes", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function voteForPhoto(submissionId: string) {
  try {
    const { data: current } = await supabase
      .from("photo_submissions")
      .select("votes")
      .eq("id", submissionId)
      .single();

    const newVotes = (current?.votes || 0) + 1;

    const { data, error } = await supabase
      .from("photo_submissions")
      .update({ votes: newVotes })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createBucketList(
  userId: string,
  name: string,
  description?: string,
  isPublic?: boolean
) {
  try {
    const { data, error } = await supabase
      .from("bucket_lists")
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic || false,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserBucketLists(userId: string) {
  try {
    const { data, error } = await supabase
      .from("bucket_lists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addBucketListItem(
  bucketListId: string,
  activity: string,
  locationId?: string
) {
  try {
    const { data, error } = await supabase
      .from("bucket_list_items")
      .insert({
        bucket_list_id: bucketListId,
        activity,
        location_id: locationId,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function completeBucketListItem(
  itemId: string,
  photoUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from("bucket_list_items")
      .update({
        completed: true,
        completed_date: new Date().toISOString(),
        photo_url: photoUrl,
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getBucketListItems(bucketListId: string) {
  try {
    const { data, error } = await supabase
      .from("bucket_list_items")
      .select("*")
      .eq("bucket_list_id", bucketListId)
      .order("completed", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAttendanceStreak(
  userId: string,
  activityType: string
) {
  try {
    const { data, error } = await supabase
      .from("attendance_streaks")
      .select("*")
      .eq("user_id", userId)
      .eq("activity_type", activityType)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// 7.2 ANALYTICS & INSIGHTS

export async function getUserAnalytics(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getFeatureUsage(userId: string) {
  try {
    const { data, error } = await supabase
      .from("feature_usage")
      .select("*")
      .eq("user_id", userId)
      .order("usage_count", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function logFeatureUsage(userId: string, featureName: string) {
  try {
    const { data: existing } = await supabase
      .from("feature_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("feature_name", featureName)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("feature_usage")
        .update({
          usage_count: existing.usage_count + 1,
          last_used: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("feature_usage")
        .insert({
          user_id: userId,
          feature_name: featureName,
          usage_count: 1,
          last_used: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getCampusExploration(userId: string) {
  try {
    const { data, error } = await supabase
      .from("campus_exploration")
      .select("*")
      .eq("user_id", userId)
      .order("visit_count", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function logCampusVisit(userId: string, locationId: string) {
  try {
    const { data: existing } = await supabase
      .from("campus_exploration")
      .select("*")
      .eq("user_id", userId)
      .eq("location_id", locationId)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("campus_exploration")
        .update({
          visit_count: existing.visit_count + 1,
          last_visit: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("campus_exploration")
        .insert({
          user_id: userId,
          location_id: locationId,
          visit_count: 1,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAdminMetrics(metricType?: string) {
  try {
    let query = supabase.from("admin_metrics").select("*");

    if (metricType) {
      query = query.eq("metric_type", metricType);
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function recordAdminMetric(
  metricType: string,
  value: number,
  date?: string
) {
  try {
    const { data, error } = await supabase
      .from("admin_metrics")
      .insert({
        metric_type: metricType,
        value,
        date: date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getEngagementSummary(userId: string, period: string) {
  try {
    const { data, error } = await supabase
      .from("engagement_summary")
      .select("*")
      .eq("user_id", userId)
      .eq("period", period)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAtRiskStudents() {
  try {
    const { data, error } = await supabase
      .from("at_risk_students")
      .select("*")
      .order("risk_score", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateAtRiskStudentIntervention(
  studentId: string,
  interventionSent: boolean
) {
  try {
    const { data, error } = await supabase
      .from("at_risk_students")
      .update({
        intervention_sent: interventionSent,
      })
      .eq("id", studentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}
