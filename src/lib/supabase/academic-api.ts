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

export async function getCourseEnrollmentsByUserExcluding(
  courseId: string,
  excludeUserId: string
) {
  try {
    const { data, error } = await supabase
      .from("course_enrollments")
      .select("user_id")
      .eq("course_id", courseId)
      .neq("user_id", excludeUserId);

    if (error) throw error;

    const userIds = data?.map((e: any) => e.user_id) || [];
    if (userIds.length === 0) return [];

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .in("id", userIds);

    if (userError) throw userError;
    return users || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourseEnrollmentsByUserExcluding error:", errorMsg);
    return [];
  }
}

export async function getCourseSharedNotesByCourse(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("shared_notes")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCourseSharedNotesByCourse error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCampusPolls error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getPollById error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getMemePosts error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getStudentOrganizations error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getOrganizationById error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getOrganizationEvents error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getClassYearGroups error:", errorMsg);
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getDepartmentNetworks error:", errorMsg);
    return [];
  }
}

// ============================================================
// ACHIEVEMENTS & GAMIFICATION
// ============================================================

export async function getAchievements() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getAchievements error:", errorMsg);
    return [];
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("*, achievements(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserAchievements error:", errorMsg);
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
    return data || { user_id: userId, total_points: 0, current_level: 1 };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserPoints error:", errorMsg);
    return null;
  }
}

export async function getLeaderboard() {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*, users(id, name, imageUrl, username)")
      .order("rank", { ascending: true })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getLeaderboard error:", errorMsg);
    return [];
  }
}

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getChallenges error:", errorMsg);
    return [];
  }
}

export async function getUserChallengeParticipations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("challenge_participations")
      .select("*, challenges(*)")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserChallengeParticipations error:", errorMsg);
    return [];
  }
}

export async function getSemesterRecaps(userId: string) {
  try {
    const { data, error } = await supabase
      .from("semester_recaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getSemesterRecaps error:", errorMsg);
    return [];
  }
}

// ============================================================
// CAMPUS FEATURES
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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCampusLocations error:", errorMsg);
    return [];
  }
}

export async function getCampusLocationById(locationId: string) {
  try {
    const { data, error } = await supabase
      .from("campus_locations")
      .select("*")
      .eq("id", locationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getCampusLocationById error:", errorMsg);
    return null;
  }
}

export async function getLibraryBooks() {
  try {
    const { data, error } = await supabase
      .from("library_books")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getLibraryBooks error:", errorMsg);
    return [];
  }
}

export async function getDiningHalls() {
  try {
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getDiningHalls error:", errorMsg);
    return [];
  }
}

export async function getDiningMenus(diningHallId: string) {
  try {
    const { data, error } = await supabase
      .from("dining_menus")
      .select("*, dining_menu_items(*)")
      .eq("dining_hall_id", diningHallId)
      .order("menu_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getDiningMenus error:", errorMsg);
    return [];
  }
}

export async function getFacilities() {
  try {
    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getFacilities error:", errorMsg);
    return [];
  }
}

export async function getFacilityBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .select("*, facilities(*)")
      .eq("user_id", userId)
      .order("booking_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getFacilityBookings error:", errorMsg);
    return [];
  }
}

export async function getSafetyAlerts() {
  try {
    const { data, error } = await supabase
      .from("safety_alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getSafetyAlerts error:", errorMsg);
    return [];
  }
}

// ============================================================
// ANONYMOUS CONFESSIONS
// ============================================================

export async function getAnonymousConfessions() {
  try {
    const { data, error } = await supabase
      .from("anonymous_confessions")
      .select("*")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getAnonymousConfessions error:", errorMsg);
    return [];
  }
}

// ============================================================
// USER CONNECTIONS
// ============================================================

export async function getUserConnections(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .select("*")
      .or(`follower_id.eq.${userId},following_id.eq.${userId}`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getUserConnections error:", errorMsg);
    return [];
  }
}

// ============================================================
// STUDY GROUP MEMBERS
// ============================================================

export async function getStudyGroupMembers(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("study_group_members")
      .select("*, users(id, name, imageUrl, username)")
      .eq("group_id", groupId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getStudyGroupMembers error:", errorMsg);
    return [];
  }
}

export async function getStudyGroupMembersCount(groupId: string) {
  try {
    const { count, error } = await supabase
      .from("study_group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", groupId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getStudyGroupMembersCount error:", errorMsg);
    return 0;
  }
}

// ============================================================
// INTEREST GROUP MEMBERS
// ============================================================

export async function getInterestGroupMembers(groupId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_group_members")
      .select("*, users(id, name, imageUrl, username)")
      .eq("group_id", groupId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getInterestGroupMembers error:", errorMsg);
    return [];
  }
}

// ============================================================
// ORGANIZATION MEMBERS
// ============================================================

export async function getOrganizationMembers(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select("*, users(id, name, imageUrl, username)")
      .eq("organization_id", organizationId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getOrganizationMembers error:", errorMsg);
    return [];
  }
}

// ============================================================
// EVENT RSVPS
// ============================================================

export async function getEventRSVPs(eventId: string) {
  try {
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("*, users(id, name, imageUrl, username)")
      .eq("event_id", eventId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getEventRSVPs error:", errorMsg);
    return [];
  }
}

// ============================================================
// TEXTBOOKS
// ============================================================

export async function getTextbooksByCourse(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("textbooks")
      .select("*")
      .eq("course_id", courseId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getTextbooksByCourse error:", errorMsg);
    return [];
  }
}

export async function getTextbookListings(textbookId: string) {
  try {
    const { data, error } = await supabase
      .from("textbook_listings")
      .select("*, users(id, name, imageUrl, username)")
      .eq("textbook_id", textbookId)
      .eq("available", true)
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getTextbookListings error:", errorMsg);
    return [];
  }
}

// ============================================================
// PROFESSOR REVIEWS
// ============================================================

export async function getProfessorReviews(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("professor_reviews")
      .select("*, users(id, name, imageUrl)")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getProfessorReviews error:", errorMsg);
    return [];
  }
}

// ============================================================
// TUTORING SESSIONS
// ============================================================

export async function getTutoringSessions(userId: string) {
  try {
    const { data, error } = await supabase
      .from("tutoring_sessions")
      .select("*, tutors:tutor_id(id, name, imageUrl, username)")
      .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
      .order("session_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getTutoringSessions error:", errorMsg);
    return [];
  }
}

export async function getTutoringReviews(tutorId: string) {
  try {
    const { data, error } = await supabase
      .from("tutoring_reviews")
      .select("*, reviewers:reviewer_id(id, name, imageUrl)")
      .eq("tutor_id", tutorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("getTutoringReviews error:", errorMsg);
    return [];
  }
}

// ============================================================
// CREATE OPERATIONS FOR ACADEMIC FEATURES
// ============================================================

export async function createStudyGroup(
  name: string,
  description: string,
  courseId?: string,
  creatorId?: string
) {
  try {
    const { data, error } = await supabase
      .from("study_groups")
      .insert([
        {
          name,
          description,
          course_id: courseId || null,
          created_by: creatorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createStudyGroup error:", errorMsg);
    throw error;
  }
}

export async function createCourseEnrollment(
  userId: string,
  courseId: string
) {
  try {
    const { data, error } = await supabase
      .from("course_enrollments")
      .insert([{ user_id: userId, course_id: courseId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createCourseEnrollment error:", errorMsg);
    throw error;
  }
}

export async function createSharedNote(
  title: string,
  content: string,
  courseId: string,
  creatorId: string,
  isPublic: boolean = true
) {
  try {
    const { data, error } = await supabase
      .from("shared_notes")
      .insert([
        {
          title,
          content,
          course_id: courseId,
          created_by: creatorId,
          is_public: isPublic,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createSharedNote error:", errorMsg);
    throw error;
  }
}

export async function createResource(
  title: string,
  description: string,
  resourceUrl: string,
  resourceType: string,
  creatorId: string
) {
  try {
    const { data, error } = await supabase
      .from("resources")
      .insert([
        {
          title,
          description,
          resource_url: resourceUrl,
          resource_type: resourceType,
          created_by: creatorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createResource error:", errorMsg);
    throw error;
  }
}

export async function createQAQuestion(
  title: string,
  content: string,
  courseId: string,
  creatorId: string
) {
  try {
    const { data, error } = await supabase
      .from("qa_questions")
      .insert([
        {
          title,
          content,
          course_id: courseId,
          user_id: creatorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createQAQuestion error:", errorMsg);
    throw error;
  }
}

export async function createQAAnswer(
  content: string,
  questionId: string,
  creatorId: string
) {
  try {
    const { data, error } = await supabase
      .from("qa_answers")
      .insert([
        {
          content,
          question_id: questionId,
          user_id: creatorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createQAAnswer error:", errorMsg);
    throw error;
  }
}

export async function createProjectListing(
  title: string,
  description: string,
  skills: string[],
  creatorId: string,
  status: string = "recruiting"
) {
  try {
    const { data, error } = await supabase
      .from("project_listings")
      .insert([
        {
          title,
          description,
          required_skills: skills,
          created_by: creatorId,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createProjectListing error:", errorMsg);
    throw error;
  }
}

export async function createJobListing(
  title: string,
  description: string,
  requirements: string,
  companyName: string,
  location: string,
  salary?: string,
  creatorId?: string
) {
  try {
    const { data, error } = await supabase
      .from("job_listings")
      .insert([
        {
          title,
          description,
          requirements,
          company_name: companyName,
          location,
          salary: salary || null,
          posted_by: creatorId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createJobListing error:", errorMsg);
    throw error;
  }
}

export async function createJobApplication(
  jobListingId: string,
  userId: string,
  coverLetter?: string
) {
  try {
    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        {
          job_listing_id: jobListingId,
          applicant_id: userId,
          cover_letter: coverLetter || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createJobApplication error:", errorMsg);
    throw error;
  }
}

export async function createTutorSession(
  tutorId: string,
  studentId: string,
  subject: string,
  scheduledTime: string,
  duration: number
) {
  try {
    const { data, error } = await supabase
      .from("tutoring_sessions")
      .insert([
        {
          tutor_id: tutorId,
          student_id: studentId,
          subject,
          scheduled_time: scheduledTime,
          duration_minutes: duration,
          status: "scheduled",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createTutorSession error:", errorMsg);
    throw error;
  }
}

export async function createPollVote(
  pollOptionId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("poll_votes")
      .insert([
        {
          poll_option_id: pollOptionId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createPollVote error:", errorMsg);
    throw error;
  }
}

export async function createLibraryReservation(
  userId: string,
  bookId: string,
  reservationDate: string
) {
  try {
    const { data, error } = await supabase
      .from("library_reservations")
      .insert([
        {
          user_id: userId,
          book_id: bookId,
          reservation_date: reservationDate,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createLibraryReservation error:", errorMsg);
    throw error;
  }
}

export async function createFacilityBooking(
  userId: string,
  facilityId: string,
  startTime: string,
  endTime: string,
  purpose?: string
) {
  try {
    const { data, error } = await supabase
      .from("facility_bookings")
      .insert([
        {
          user_id: userId,
          facility_id: facilityId,
          start_time: startTime,
          end_time: endTime,
          purpose: purpose || null,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createFacilityBooking error:", errorMsg);
    throw error;
  }
}

export async function createChallengeSubmission(
  challengeId: string,
  userId: string,
  submissionContent: string,
  submissionUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from("challenge_submissions")
      .insert([
        {
          challenge_id: challengeId,
          user_id: userId,
          submission_content: submissionContent,
          submission_url: submissionUrl || null,
          status: "submitted",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createChallengeSubmission error:", errorMsg);
    throw error;
  }
}

export async function createPhotoContestSubmission(
  contestId: string,
  userId: string,
  photoUrl: string,
  caption?: string
) {
  try {
    const { data, error } = await supabase
      .from("photo_contest_submissions")
      .insert([
        {
          contest_id: contestId,
          user_id: userId,
          photo_url: photoUrl,
          caption: caption || null,
          votes: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createPhotoContestSubmission error:", errorMsg);
    throw error;
  }
}

export async function createPhotoContestVote(
  submissionId: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("photo_contest_votes")
      .insert([
        {
          submission_id: submissionId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createPhotoContestVote error:", errorMsg);
    throw error;
  }
}

export async function createWellnessEventRsvp(
  eventId: string,
  userId: string,
  status: string = "attending"
) {
  try {
    const { data, error } = await supabase
      .from("wellness_event_rsvps")
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createWellnessEventRsvp error:", errorMsg);
    throw error;
  }
}

export async function joinStudyGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("study_group_members")
      .insert([
        {
          group_id: groupId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("joinStudyGroup error:", errorMsg);
    throw error;
  }
}

export async function joinInterestGroup(groupId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("interest_group_members")
      .insert([
        {
          group_id: groupId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("joinInterestGroup error:", errorMsg);
    throw error;
  }
}

export async function joinOrganization(orgId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("organization_members")
      .insert([
        {
          organization_id: orgId,
          user_id: userId,
          role: "member",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("joinOrganization error:", errorMsg);
    throw error;
  }
}

export async function createUserConnection(
  followerId: string,
  followingId: string
) {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .insert([
        {
          follower_id: followerId,
          following_id: followingId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("createUserConnection error:", errorMsg);
    throw error;
  }
}

export async function addUserSkill(userId: string, skillId: string) {
  try {
    const { data, error } = await supabase
      .from("user_skills")
      .insert([
        {
          user_id: userId,
          skill_id: skillId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("addUserSkill error:", errorMsg);
    throw error;
  }
}
