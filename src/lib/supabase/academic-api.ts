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
