import { supabase } from "./config";

// ============================================================
// ACADEMIC FEATURES
// ============================================================

export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourses error:", errorMsg);
    return [];
  }
}

export async function getCourseById(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourseById error:", errorMsg);
    return null;
  }
}

export async function getUserCourses(userId: string) {
  try {
    const { data, error } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .eq("user_id", userId);

    if (error) throw error;

    const courseIds = data?.map((e: any) => e.course_id) || [];
    if (courseIds.length === 0) return [];

    const { data: courses, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);

    if (courseError) throw courseError;
    return courses || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserCourses error:", errorMsg);
    return [];
  }
}

export async function getStudyGroups() {
  try {
    const { data, error } = await supabase
      .from("study_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getStudyGroups error:", errorMsg);
    return [];
  }
}

export async function getStudyGroupById(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("study_groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getStudyGroupById error:", errorMsg);
    return null;
  }
}

export async function getAssignments() {
  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getAssignments error:", errorMsg);
    return [];
  }
}

export async function getAssignmentById(assignmentId: string) {
  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("id", assignmentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getAssignmentById error:", errorMsg);
    return null;
  }
}

export async function getCourseAssignments(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", courseId)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourseAssignments error:", errorMsg);
    return [];
  }
}

export async function getSharedNotes() {
  try {
    const { data, error } = await supabase
      .from("shared_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getSharedNotes error:", errorMsg);
    return [];
  }
}

export async function getCourseSharedNotes(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("shared_notes")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourseSharedNotes error:", errorMsg);
    return [];
  }
}

export async function getSkills() {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getSkills error:", errorMsg);
    return [];
  }
}

export async function getUserSkills(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_skills")
      .select("*, skills(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserSkills error:", errorMsg);
    return [];
  }
}

export async function getProjectListings() {
  try {
    const { data, error } = await supabase
      .from("project_listings")
      .select("*, users(id, name, imageUrl, username)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getProjectListings error:", errorMsg);
    return [];
  }
}

export async function getTutoringProfiles() {
  try {
    const { data, error } = await supabase
      .from("tutoring_profiles")
      .select("*, users(id, name, imageUrl, username)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getTutoringProfiles error:", errorMsg);
    return [];
  }
}

export async function getResources() {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getResources error:", errorMsg);
    return [];
  }
}

export async function getQAQuestions() {
  try {
    const { data, error } = await supabase
      .from("qa_questions")
      .select("*, users(id, name, imageUrl, username)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getQAQuestions error:", errorMsg);
    return [];
  }
}

export async function getQuestionById(questionId: string) {
  try {
    const { data: question, error: qError } = await supabase
      .from("qa_questions")
      .select("*, users(id, name, imageUrl, username)")
      .eq("id", questionId)
      .single();

    if (qError) throw qError;

    const { data: answers, error: aError } = await supabase
      .from("qa_answers")
      .select("*, users(id, name, imageUrl, username)")
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    if (aError) throw aError;

    return { question, answers: answers || [] };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getQuestionById error:", errorMsg);
    return { question: null, answers: [] };
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .select("following_id")
      .eq("follower_id", userId);

    if (error) throw error;

    const followingIds = data?.map((c: any) => c.following_id) || [];
    if (followingIds.length === 0) return [];

    const { data: following, error: userError } = await supabase
      .from("users")
      .select("*")
      .in("id", followingIds);

    if (userError) throw userError;
    return following || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserFollowing error:", errorMsg);
    return [];
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .select("follower_id")
      .eq("following_id", userId);

    if (error) throw error;

    const followerIds = data?.map((c: any) => c.follower_id) || [];
    if (followerIds.length === 0) return [];

    const { data: followers, error: userError } = await supabase
      .from("users")
      .select("*")
      .in("id", followerIds);

    if (userError) throw userError;
    return followers || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserFollowers error:", errorMsg);
    return [];
  }
}

// ============================================================
// SOCIAL NETWORKING FEATURES
// ============================================================

export async function getInterestGroups() {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getInterestGroups error:", errorMsg);
    return [];
  }
}

export async function getInterestGroupById(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getInterestGroupById error:", errorMsg);
    return null;
  }
}

export async function getCampusPolls() {
  try {
    const { data, error } = await supabase
      .from("campus_polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getCampusPolls error:", error);
    return [];
  }
}

export async function getPollById(pollId: string) {
  try {
    const { data: poll, error: pError } = await supabase
      .from("campus_polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pError) throw pError;

    const { data: options, error: oError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId);

    if (oError) throw oError;

    return { poll, options: options || [] };
  } catch (error) {
    logErrorDetails("getPollById error:", error);
    return { poll: null, options: [] };
  }
}

export async function getMemePosts() {
  try {
    const { data, error } = await supabase
      .from("meme_posts")
      .select("*, users(id, name, imageUrl, username)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getMemePosts error:", error);
    return [];
  }
}

export async function getStudentOrganizations() {
  try {
    const { data, error } = await supabase
      .from("student_organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getStudentOrganizations error:", error);
    return [];
  }
}

export async function getOrganizationById(orgId: string) {
  try {
    const { data, error } = await supabase
      .from("student_organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logErrorDetails("getOrganizationById error:", error);
    return null;
  }
}

export async function getOrganizationEvents(orgId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_events")
      .select("*")
      .eq("organization_id", orgId)
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getOrganizationEvents error:", error);
    return [];
  }
}

export async function getClassYearGroups() {
  try {
    const { data, error } = await supabase
      .from("class_year_groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getClassYearGroups error:", error);
    return [];
  }
}

export async function getDepartmentNetworks() {
  try {
    const { data, error } = await supabase
      .from("department_networks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logErrorDetails("getDepartmentNetworks error:", error);
    return [];
  }
}
