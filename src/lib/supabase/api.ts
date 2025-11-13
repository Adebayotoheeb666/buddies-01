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
