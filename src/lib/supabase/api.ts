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

// ============================================================
// AUTH
// ============================================================

export async function createUserAccount(user: INewUser) {
  try {
    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (authError || !authData.user) {
      throw authError || new Error("Failed to create auth account");
    }

    // Create user profile in database
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
      // Clean up auth account if user creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }

    return userData;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) throw error;

    return data.session;
  } catch (error) {
    console.log(error);
  }
}

export async function getAccount() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select()
      .eq("id", authUser.id)
      .single();

    if (dbError) return null;

    return userData;
  } catch (error) {
    console.log(error);
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

export async function leaveDepartmentNetwork(networkId: string, userId: string) {
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

export async function isUserInDepartmentNetwork(networkId: string, userId: string) {
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

export async function votePoll(pollId: string, optionId: string, userId: string) {
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

export async function createMemePost(creatorId: string, imageUrl: string, caption: string) {
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
      .insert({ organization_id: organizationId, user_id: userId, role: "member" })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function leaveOrganization(organizationId: string, userId: string) {
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

export async function isUserInOrganization(organizationId: string, userId: string) {
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

export async function rsvpEvent(eventId: string, userId: string, status: string) {
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
      .insert({ organization_id: organizationId, start_date: startDate, end_date: endDate })
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

export async function applyToRecruitment(recruitmentPeriodId: string, applicantId: string) {
  try {
    const { data, error } = await supabase
      .from("recruitment_applications")
      .insert({ recruitment_period_id: recruitmentPeriodId, applicant_id: applicantId })
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

export async function updateApplicationStatus(applicationId: string, status: string) {
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

export async function searchClassrooms(buildingName?: string, roomNumber?: string) {
  try {
    let query = supabase.from("classrooms").select("*");

    if (buildingName) {
      query = query.ilike("building_name", `%${buildingName}%`);
    }

    if (roomNumber) {
      query = query.ilike("room_number", `%${roomNumber}%`);
    }

    const { data, error } = await query.order("building_name", { ascending: true });

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
    const { data, error } = await supabase
      .from("building_routes")
      .select("*");

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

export async function reportWaitTime(diningHallId: string, userId: string, waitTimeMinutes: number) {
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

export async function getLibraryBooks(filters?: { title?: string; author?: string; subject?: string }) {
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

export async function checkoutBook(userId: string, bookId: string, dueDate: string) {
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

export async function getFacilities(filters?: { facilityType?: string; location?: string }) {
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

export async function updateFacilityBookingStatus(bookingId: string, status: string) {
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
