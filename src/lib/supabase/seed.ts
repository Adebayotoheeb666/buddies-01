import { supabase } from "./config";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // ============================================================
    // STEP 1: SEED USERS
    // ============================================================
    console.log("📝 Seeding users...");

    const users = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "alice@university.edu",
        username: "alice_j",
        name: "Alice Johnson",
        bio: "Computer Science major | Love coding and helping others",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        university_id: "A123456",
        graduation_year: 2025,
        major: "Computer Science",
        class_year: "Senior",
        pronouns: "She/Her",
        interests: ["Coding", "Web Development", "AI/ML"],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        email: "bob@university.edu",
        username: "bob_smith",
        name: "Bob Smith",
        bio: "Mathematics student | Passionate about tutoring",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        university_id: "B123456",
        graduation_year: 2026,
        major: "Mathematics",
        class_year: "Junior",
        pronouns: "He/Him",
        interests: ["Mathematics", "Tutoring", "Problem Solving"],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        email: "carol@university.edu",
        username: "carol_d",
        name: "Carol Davis",
        bio: "Physics enthusiast | Lab researcher",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
        university_id: "C123456",
        graduation_year: 2024,
        major: "Physics",
        class_year: "Senior",
        pronouns: "She/Her",
        interests: ["Physics", "Research", "Science"],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        email: "david@university.edu",
        username: "david_lee",
        name: "David Lee",
        bio: "Engineering student | Build cool projects",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        university_id: "D123456",
        graduation_year: 2026,
        major: "Engineering",
        class_year: "Junior",
        pronouns: "He/Him",
        interests: ["Engineering", "Robotics", "IoT"],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        email: "emma@university.edu",
        username: "emma_w",
        name: "Emma Wilson",
        bio: "Biology major | Interested in research",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        university_id: "E123456",
        graduation_year: 2027,
        major: "Biology",
        class_year: "Sophomore",
        pronouns: "She/Her",
        interests: ["Biology", "Research", "Medicine"],
      },
    ];

    for (const user of users) {
      await supabase.from("users").upsert([user], { onConflict: "id" });
    }
    console.log("✅ Users seeded");

    // ============================================================
    // STEP 2: SEED COURSES
    // ============================================================
    console.log("📚 Seeding courses...");

    const courses = [
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        course_code: "CS101",
        course_name: "Introduction to Computer Science",
        professor: "Dr. Sarah Anderson",
        department: "Computer Science",
        semester: "Fall 2024",
        section: "A",
        credits: 3,
        schedule_json: {
          days: ["Monday", "Wednesday", "Friday"],
          startTime: "09:00",
          endTime: "10:30",
        },
        location: "Science Building 101",
        enrollment_count: 45,
        max_enrollment: 50,
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440002",
        course_code: "MATH201",
        course_name: "Calculus II",
        professor: "Prof. Michael Brown",
        department: "Mathematics",
        semester: "Fall 2024",
        section: "B",
        credits: 4,
        schedule_json: {
          days: ["Tuesday", "Thursday"],
          startTime: "11:00",
          endTime: "12:30",
        },
        location: "Math Building 205",
        enrollment_count: 38,
        max_enrollment: 40,
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440003",
        course_code: "PHYS301",
        course_name: "Modern Physics",
        professor: "Dr. James White",
        department: "Physics",
        semester: "Fall 2024",
        section: "A",
        credits: 4,
        schedule_json: {
          days: ["Monday", "Wednesday"],
          startTime: "14:00",
          endTime: "15:30",
        },
        location: "Physics Lab Building 310",
        enrollment_count: 28,
        max_enrollment: 35,
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440004",
        course_code: "ENG102",
        course_name: "English Composition II",
        professor: "Prof. Rachel Green",
        department: "English",
        semester: "Fall 2024",
        section: "C",
        credits: 3,
        schedule_json: {
          days: ["Tuesday", "Thursday"],
          startTime: "13:00",
          endTime: "14:30",
        },
        location: "Liberal Arts 215",
        enrollment_count: 32,
        max_enrollment: 35,
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440005",
        course_code: "BIO201",
        course_name: "Organic Chemistry",
        professor: "Dr. Patricia Chen",
        department: "Biology",
        semester: "Fall 2024",
        section: "A",
        credits: 4,
        schedule_json: {
          days: ["Monday", "Wednesday", "Friday"],
          startTime: "10:00",
          endTime: "11:30",
        },
        location: "Science Building 205",
        enrollment_count: 42,
        max_enrollment: 45,
      },
    ];

    for (const course of courses) {
      await supabase.from("courses").upsert([course], { onConflict: "id" });
    }
    console.log("✅ Courses seeded");

    // ============================================================
    // STEP 3: SEED COURSE ENROLLMENTS
    // ============================================================
    console.log("📝 Seeding course enrollments...");

    const enrollments = [
      {
        id: "770e8400-e29b-41d4-a716-446655440001",
        user_id: users[0].id,
        course_id: courses[0].id,
        enrollment_date: new Date("2024-08-15").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440002",
        user_id: users[0].id,
        course_id: courses[1].id,
        enrollment_date: new Date("2024-08-15").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440003",
        user_id: users[1].id,
        course_id: courses[1].id,
        enrollment_date: new Date("2024-08-16").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440004",
        user_id: users[1].id,
        course_id: courses[2].id,
        enrollment_date: new Date("2024-08-16").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440005",
        user_id: users[2].id,
        course_id: courses[2].id,
        enrollment_date: new Date("2024-08-17").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440006",
        user_id: users[2].id,
        course_id: courses[4].id,
        enrollment_date: new Date("2024-08-17").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440007",
        user_id: users[3].id,
        course_id: courses[0].id,
        enrollment_date: new Date("2024-08-18").toISOString(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440008",
        user_id: users[4].id,
        course_id: courses[4].id,
        enrollment_date: new Date("2024-08-18").toISOString(),
      },
    ];

    for (const enrollment of enrollments) {
      await supabase
        .from("course_enrollments")
        .upsert([enrollment], { onConflict: "id" });
    }
    console.log("✅ Course enrollments seeded");

    // ============================================================
    // STEP 4: SEED STUDY GROUPS
    // ============================================================
    console.log("📖 Seeding study groups...");

    const studyGroups = [
      {
        id: "880e8400-e29b-41d4-a716-446655440001",
        name: "CS101 Study Squad",
        description: "Meet up for CS101 exam prep and homework help",
        creator_id: users[0].id,
        course_id: courses[0].id,
        location: "Library Room 210",
        meeting_time: new Date("2024-09-25T18:00:00").toISOString(),
        max_members: 8,
        is_active: true,
      },
      {
        id: "880e8400-e29b-41d4-a716-446655440002",
        name: "Calculus Warriors",
        description: "MATH201 collaborative learning group",
        creator_id: users[1].id,
        course_id: courses[1].id,
        location: "Coffee Shop Near Campus",
        meeting_time: new Date("2024-09-26T17:00:00").toISOString(),
        max_members: 6,
        is_active: true,
      },
      {
        id: "880e8400-e29b-41d4-a716-446655440003",
        name: "Physics Lab Prep",
        description: "Prepare for physics lab practicals together",
        creator_id: users[2].id,
        course_id: courses[2].id,
        location: "Physics Building Lounge",
        meeting_time: new Date("2024-09-24T16:00:00").toISOString(),
        max_members: 5,
        is_active: true,
      },
    ];

    for (const group of studyGroups) {
      await supabase
        .from("study_groups")
        .upsert([group], { onConflict: "id" });
    }
    console.log("✅ Study groups seeded");

    // ============================================================
    // STEP 5: SEED ASSIGNMENTS
    // ============================================================
    console.log("📋 Seeding assignments...");

    const assignments = [
      {
        id: "990e8400-e29b-41d4-a716-446655440001",
        course_id: courses[0].id,
        title: "Introduction to Python Programming",
        description: "Write a Python program to solve basic problems",
        due_date: new Date("2024-09-20T23:59:59").toISOString(),
        assignment_type: "homework",
        total_points: 50,
        is_group_project: false,
        created_by_id: users[0].id,
      },
      {
        id: "990e8400-e29b-41d4-a716-446655440002",
        course_id: courses[1].id,
        title: "Calculus Problem Set 3",
        description: "Complete problems 1-30 from Chapter 5",
        due_date: new Date("2024-09-22T23:59:59").toISOString(),
        assignment_type: "homework",
        total_points: 40,
        is_group_project: false,
        created_by_id: users[1].id,
      },
      {
        id: "990e8400-e29b-41d4-a716-446655440003",
        course_id: courses[2].id,
        title: "Physics Midterm Exam",
        description: "Comprehensive exam covering chapters 1-7",
        due_date: new Date("2024-10-15T14:00:00").toISOString(),
        assignment_type: "exam",
        total_points: 100,
        is_group_project: false,
        created_by_id: users[2].id,
      },
    ];

    for (const assignment of assignments) {
      await supabase
        .from("assignments")
        .upsert([assignment], { onConflict: "id" });
    }
    console.log("✅ Assignments seeded");

    // ============================================================
    // STEP 6: SEED SHARED NOTES
    // ============================================================
    console.log("📄 Seeding shared notes...");

    const notes = [
      {
        id: "aa0e8400-e29b-41d4-a716-446655440001",
        creator_id: users[0].id,
        course_id: courses[0].id,
        title: "CS101 Lecture Notes - Week 1",
        content:
          "Introduction to programming concepts, variables, data types, and basic operations...",
        tags: ["lecture", "introduction", "fundamentals"],
        is_public: true,
      },
      {
        id: "aa0e8400-e29b-41d4-a716-446655440002",
        creator_id: users[1].id,
        course_id: courses[1].id,
        title: "Calculus Integration Techniques Summary",
        content:
          "Quick reference guide for integration techniques including substitution, by parts...",
        tags: ["integration", "techniques", "review"],
        is_public: true,
      },
      {
        id: "aa0e8400-e29b-41d4-a716-446655440003",
        creator_id: users[2].id,
        course_id: courses[2].id,
        title: "Modern Physics Equations Sheet",
        content: "All important equations for the physics course with derivations...",
        tags: ["physics", "equations", "reference"],
        is_public: true,
      },
    ];

    for (const note of notes) {
      await supabase.from("shared_notes").upsert([note], { onConflict: "id" });
    }
    console.log("✅ Shared notes seeded");

    // ============================================================
    // STEP 7: SEED SKILLS
    // ============================================================
    console.log("🎯 Seeding skills...");

    const skills = [
      {
        id: "bb0e8400-e29b-41d4-a716-446655440001",
        name: "Python",
        category: "technical",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440002",
        name: "JavaScript",
        category: "technical",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440003",
        name: "Data Analysis",
        category: "technical",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440004",
        name: "Communication",
        category: "soft",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440005",
        name: "Leadership",
        category: "soft",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440006",
        name: "Problem Solving",
        category: "soft",
      },
    ];

    for (const skill of skills) {
      await supabase.from("skills").upsert([skill], { onConflict: "id" });
    }
    console.log("✅ Skills seeded");

    // ============================================================
    // STEP 8: SEED USER SKILLS
    // ============================================================
    console.log("🏆 Seeding user skills...");

    const userSkills = [
      {
        id: "cc0e8400-e29b-41d4-a716-446655440001",
        user_id: users[0].id,
        skill_id: skills[0].id,
        proficiency_level: "advanced",
        endorsements: 5,
      },
      {
        id: "cc0e8400-e29b-41d4-a716-446655440002",
        user_id: users[0].id,
        skill_id: skills[1].id,
        proficiency_level: "intermediate",
        endorsements: 3,
      },
      {
        id: "cc0e8400-e29b-41d4-a716-446655440003",
        user_id: users[1].id,
        skill_id: skills[2].id,
        proficiency_level: "expert",
        endorsements: 8,
      },
      {
        id: "cc0e8400-e29b-41d4-a716-446655440004",
        user_id: users[1].id,
        skill_id: skills[5].id,
        proficiency_level: "advanced",
        endorsements: 6,
      },
    ];

    for (const userSkill of userSkills) {
      await supabase.from("user_skills").upsert([userSkill], { onConflict: "id" });
    }
    console.log("✅ User skills seeded");

    // ============================================================
    // STEP 9: SEED TUTORING PROFILES
    // ============================================================
    console.log("👨‍🏫 Seeding tutoring profiles...");

    const tutoringProfiles = [
      {
        id: "ee0e8400-e29b-41d4-a716-446655440001",
        user_id: users[1].id,
        bio: "Expert in mathematics with 3+ years of tutoring experience",
        subjects_tutored: ["Calculus", "Algebra", "Geometry"],
        hourly_rate: 25,
        availability_json: {
          monday: ["16:00-20:00"],
          wednesday: ["16:00-20:00"],
          saturday: ["10:00-18:00"],
        },
        location_preference: "both",
        is_active: true,
      },
      {
        id: "ee0e8400-e29b-41d4-a716-446655440002",
        user_id: users[0].id,
        bio: "Computer Science student offering programming tutoring",
        subjects_tutored: ["Python", "JavaScript", "Data Structures"],
        hourly_rate: 20,
        availability_json: {
          tuesday: ["17:00-21:00"],
          thursday: ["17:00-21:00"],
          sunday: ["14:00-18:00"],
        },
        location_preference: "virtual",
        is_active: true,
      },
    ];

    for (const profile of tutoringProfiles) {
      await supabase
        .from("tutoring_profiles")
        .upsert([profile], { onConflict: "id" });
    }
    console.log("✅ Tutoring profiles seeded");

    // ============================================================
    // STEP 10: SEED RESOURCES
    // ============================================================
    console.log("📚 Seeding resources...");

    const resources = [
      {
        id: "ff0e8400-e29b-41d4-a716-446655440001",
        title: "Python Programming Guide",
        description: "Comprehensive guide to Python programming basics",
        resource_type: "guide",
        course_id: courses[0].id,
        uploaded_by_id: users[0].id,
        file_url: "https://example.com/python-guide.pdf",
        tags: ["python", "programming", "tutorial"],
        is_public: true,
        views: 156,
        downloads: 42,
      },
      {
        id: "ff0e8400-e29b-41d4-a716-446655440002",
        title: "Calculus Formula Reference",
        description: "Quick reference for common calculus formulas",
        resource_type: "guide",
        course_id: courses[1].id,
        uploaded_by_id: users[1].id,
        file_url: "https://example.com/calculus-reference.pdf",
        tags: ["calculus", "mathematics", "formulas"],
        is_public: true,
        views: 203,
        downloads: 87,
      },
    ];

    for (const resource of resources) {
      await supabase.from("resources").upsert([resource], { onConflict: "id" });
    }
    console.log("✅ Resources seeded");

    // ============================================================
    // STEP 11: SEED Q&A QUESTIONS
    // ============================================================
    console.log("❓ Seeding Q&A questions...");

    const qaQuestions = [
      {
        id: "gg0e8400-e29b-41d4-a716-446655440001",
        asker_id: users[3].id,
        course_id: courses[0].id,
        title: "How do I implement a loop in Python?",
        content:
          "I am having trouble understanding how for loops work in Python. Can someone explain with an example?",
        tags: ["python", "loops", "beginner"],
        upvotes: 8,
        views: 142,
        is_answered: true,
      },
      {
        id: "gg0e8400-e29b-41d4-a716-446655440002",
        asker_id: users[4].id,
        course_id: courses[1].id,
        title: "Understanding the derivative of inverse functions",
        content:
          "I do not understand how to find the derivative of inverse functions. The notes are confusing.",
        tags: ["calculus", "derivatives", "inverse-functions"],
        upvotes: 5,
        views: 89,
        is_answered: true,
      },
    ];

    for (const question of qaQuestions) {
      await supabase
        .from("qa_questions")
        .upsert([question], { onConflict: "id" });
    }
    console.log("✅ Q&A questions seeded");

    // ============================================================
    // STEP 12: SEED Q&A ANSWERS
    // ============================================================
    console.log("💬 Seeding Q&A answers...");

    const qaAnswers = [
      {
        id: "hh0e8400-e29b-41d4-a716-446655440001",
        question_id: qaQuestions[0].id,
        answerer_id: users[0].id,
        content:
          "A for loop in Python iterates over a sequence. Here is an example: for i in range(10): print(i)",
        upvotes: 12,
        is_verified: true,
        verification_by_id: users[0].id,
      },
      {
        id: "hh0e8400-e29b-41d4-a716-446655440002",
        question_id: qaQuestions[1].id,
        answerer_id: users[1].id,
        content:
          "The derivative of an inverse function uses the formula: (f^-1)' = 1 / f'(f^-1(x)). Let me provide more details...",
        upvotes: 9,
        is_verified: true,
        verification_by_id: users[1].id,
      },
    ];

    for (const answer of qaAnswers) {
      await supabase.from("qa_answers").upsert([answer], { onConflict: "id" });
    }
    console.log("✅ Q&A answers seeded");

    // ============================================================
    // STEP 13: SEED PROJECT LISTINGS
    // ============================================================
    console.log("🚀 Seeding project listings...");

    const projects = [
      {
        id: "dd0e8400-e29b-41d4-a716-446655440001",
        creator_id: users[3].id,
        title: "Campus Event Management App",
        description: "Build a web app to manage and discover campus events",
        required_skills: ["JavaScript", "React", "Database Design"],
        team_size: 4,
        current_members: 2,
        status: "recruiting",
        due_date: new Date("2024-12-15").toISOString(),
      },
      {
        id: "dd0e8400-e29b-41d4-a716-446655440002",
        creator_id: users[2].id,
        title: "Research Data Visualization",
        description:
          "Visualize experimental results using Python and matplotlib",
        required_skills: ["Python", "Data Analysis", "Visualization"],
        team_size: 3,
        current_members: 1,
        status: "recruiting",
        due_date: new Date("2024-11-30").toISOString(),
      },
    ];

    for (const project of projects) {
      await supabase
        .from("project_listings")
        .upsert([project], { onConflict: "id" });
    }
    console.log("✅ Project listings seeded");

    // ============================================================
    // STEP 14: SEED INTEREST GROUPS
    // ============================================================
    console.log("🎮 Seeding interest groups...");

    const interestGroups = [
      {
        id: "kk0e8400-e29b-41d4-a716-446655440001",
        name: "Gaming Community",
        description: "For students who love video games and esports",
        category: "gaming",
        is_private: false,
        creator_id: users[0].id,
        member_count: 87,
      },
      {
        id: "kk0e8400-e29b-41d4-a716-446655440002",
        name: "Fitness Enthusiasts",
        description:
          "Health and fitness focused group for gym buddies and fitness challenges",
        category: "fitness",
        is_private: false,
        creator_id: users[1].id,
        member_count: 124,
      },
      {
        id: "kk0e8400-e29b-41d4-a716-446655440003",
        name: "Photography Club",
        description:
          "Passionate photographers sharing tips, hosting photo walks, and contests",
        category: "photography",
        is_private: false,
        creator_id: users[2].id,
        member_count: 56,
      },
    ];

    for (const group of interestGroups) {
      await supabase
        .from("interest_groups")
        .upsert([group], { onConflict: "id" });
    }
    console.log("✅ Interest groups seeded");

    // ============================================================
    // STEP 15: SEED CAMPUS POLLS
    // ============================================================
    console.log("🗳️ Seeding campus polls...");

    const polls = [
      {
        id: "ll0e8400-e29b-41d4-a716-446655440001",
        created_by_id: users[0].id,
        title: "What should be the campus event for this semester?",
        description: "Help us decide on the biggest campus gathering",
        poll_type: "event_preference",
        expires_at: new Date("2024-09-30").toISOString(),
      },
      {
        id: "ll0e8400-e29b-41d4-a716-446655440002",
        created_by_id: users[1].id,
        title: "Should we extend library hours?",
        description: "Vote on extending library hours during exam season",
        poll_type: "campus_issue",
        expires_at: new Date("2024-09-25").toISOString(),
      },
      {
        id: "ll0e8400-e29b-41d4-a716-446655440003",
        created_by_id: users[2].id,
        title: "Best dining hall option?",
        description: "Rate your favorite campus dining location",
        poll_type: "general",
        expires_at: new Date("2024-09-22").toISOString(),
      },
    ];

    for (const poll of polls) {
      await supabase.from("campus_polls").upsert([poll], { onConflict: "id" });
    }
    console.log("✅ Campus polls seeded");

    // ============================================================
    // STEP 16: SEED POLL OPTIONS
    // ============================================================
    console.log("🎯 Seeding poll options...");

    const pollOptions = [
      {
        id: "mm0e8400-e29b-41d4-a716-446655440001",
        poll_id: polls[0].id,
        option_text: "Fall Music Festival",
        vote_count: 234,
      },
      {
        id: "mm0e8400-e29b-41d4-a716-446655440002",
        poll_id: polls[0].id,
        option_text: "Sports Tournament",
        vote_count: 178,
      },
      {
        id: "mm0e8400-e29b-41d4-a716-446655440003",
        poll_id: polls[0].id,
        option_text: "Carnival & Fair",
        vote_count: 130,
      },
      {
        id: "mm0e8400-e29b-41d4-a716-446655440004",
        poll_id: polls[1].id,
        option_text: "Yes, extend to 2am",
        vote_count: 512,
      },
      {
        id: "mm0e8400-e29b-41d4-a716-446655440005",
        poll_id: polls[1].id,
        option_text: "No, keep current hours",
        vote_count: 364,
      },
    ];

    for (const option of pollOptions) {
      await supabase.from("poll_options").upsert([option], { onConflict: "id" });
    }
    console.log("✅ Poll options seeded");

    // ============================================================
    // STEP 17: SEED MEME POSTS
    // ============================================================
    console.log("😂 Seeding meme posts...");

    const memes = [
      {
        id: "nn0e8400-e29b-41d4-a716-446655440001",
        creator_id: users[3].id,
        title: "Me after finishing one assignment",
        image_url:
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme1&size=400",
        likes: 342,
      },
      {
        id: "nn0e8400-e29b-41d4-a716-446655440002",
        creator_id: users[4].id,
        title: "Waiting for the professor to finish class early",
        image_url:
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme2&size=400",
        likes: 521,
      },
      {
        id: "nn0e8400-e29b-41d4-a716-446655440003",
        creator_id: users[0].id,
        title: "When you realize an assignment is due tomorrow",
        image_url:
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=meme3&size=400",
        likes: 687,
      },
    ];

    for (const meme of memes) {
      await supabase.from("meme_posts").upsert([meme], { onConflict: "id" });
    }
    console.log("✅ Meme posts seeded");

    // ============================================================
    // STEP 18: SEED STUDENT ORGANIZATIONS
    // ============================================================
    console.log("🏛️ Seeding student organizations...");

    const orgs = [
      {
        id: "oo0e8400-e29b-41d4-a716-446655440001",
        name: "Robotics Club",
        description: "Building and competing with robots in national competitions",
        founder_id: users[0].id,
        member_count: 45,
        is_active: true,
      },
      {
        id: "oo0e8400-e29b-41d4-a716-446655440002",
        name: "Basketball Team",
        description: "Competitive basketball team with games and tournaments",
        founder_id: users[1].id,
        member_count: 32,
        is_active: true,
      },
      {
        id: "oo0e8400-e29b-41d4-a716-446655440003",
        name: "Cultural Exchange Club",
        description: "Celebrating diverse cultures and international traditions",
        founder_id: users[2].id,
        member_count: 67,
        is_active: true,
      },
    ];

    for (const org of orgs) {
      await supabase
        .from("student_organizations")
        .upsert([org], { onConflict: "id" });
    }
    console.log("✅ Student organizations seeded");

    // ============================================================
    // STEP 19: SEED ORGANIZATION EVENTS
    // ============================================================
    console.log("📅 Seeding organization events...");

    const events = [
      {
        id: "pp0e8400-e29b-41d4-a716-446655440001",
        organization_id: orgs[0].id,
        title: "Robotics Competition - Regional Finals",
        description: "Our team competes in the regional robotics championship",
        event_date: new Date("2024-10-15").toISOString(),
        location: "Engineering Building, Room 201",
        capacity: 150,
        attendee_count: 78,
      },
      {
        id: "pp0e8400-e29b-41d4-a716-446655440002",
        organization_id: orgs[1].id,
        title: "Basketball Game vs State University",
        description: "Home game - support our team!",
        event_date: new Date("2024-10-20").toISOString(),
        location: "Sports Arena",
        capacity: 500,
        attendee_count: 234,
      },
      {
        id: "pp0e8400-e29b-41d4-a716-446655440003",
        organization_id: orgs[2].id,
        title: "International Food Festival",
        description:
          "Try cuisines from around the world and celebrate global cultures",
        event_date: new Date("2024-10-25").toISOString(),
        location: "Student Center Courtyard",
        capacity: 300,
        attendee_count: 145,
      },
    ];

    for (const event of events) {
      await supabase
        .from("organization_events")
        .upsert([event], { onConflict: "id" });
    }
    console.log("✅ Organization events seeded");

    // ============================================================
    // STEP 20: SEED ACHIEVEMENTS
    // ============================================================
    console.log("🏅 Seeding achievements...");

    const achievements = [
      {
        id: "achievement-001",
        name: "First Post",
        description: "Create your first post on Campus Connect",
        icon_url: "https://api.dicebear.com/7.x/icons/svg?seed=achievement1",
        criteria: "created_post",
      },
      {
        id: "achievement-002",
        name: "Scholar",
        description: "Enroll in 5 courses",
        icon_url: "https://api.dicebear.com/7.x/icons/svg?seed=achievement2",
        criteria: "5_courses",
      },
      {
        id: "achievement-003",
        name: "Team Player",
        description: "Join a study group",
        icon_url: "https://api.dicebear.com/7.x/icons/svg?seed=achievement3",
        criteria: "joined_study_group",
      },
    ];

    for (const achievement of achievements) {
      await supabase
        .from("achievements")
        .upsert([achievement], { onConflict: "id" });
    }
    console.log("✅ Achievements seeded");

    // ============================================================
    // STEP 21: SEED CLASS YEAR GROUPS
    // ============================================================
    console.log("👥 Seeding class year groups...");

    const classYearGroups = [
      {
        id: "ii0e8400-e29b-41d4-a716-446655440001",
        class_year: "Senior",
        description: "Senior year students",
        member_count: 245,
      },
      {
        id: "ii0e8400-e29b-41d4-a716-446655440002",
        class_year: "Junior",
        description: "Junior year students",
        member_count: 198,
      },
      {
        id: "ii0e8400-e29b-41d4-a716-446655440003",
        class_year: "Sophomore",
        description: "Sophomore year students",
        member_count: 212,
      },
      {
        id: "ii0e8400-e29b-41d4-a716-446655440004",
        class_year: "Freshman",
        description: "Freshman year students",
        member_count: 267,
      },
    ];

    for (const group of classYearGroups) {
      await supabase
        .from("class_year_groups")
        .upsert([group], { onConflict: "id" });
    }
    console.log("✅ Class year groups seeded");

    // ============================================================
    // STEP 22: SEED DEPARTMENT NETWORKS
    // ============================================================
    console.log("🏢 Seeding department networks...");

    const departments = [
      {
        id: "jj0e8400-e29b-41d4-a716-446655440001",
        department: "Computer Science",
        description:
          "Connect with fellow CS students, share coding projects, and collaborate on tech initiatives",
        member_count: 156,
      },
      {
        id: "jj0e8400-e29b-41d4-a716-446655440002",
        department: "Business Administration",
        description:
          "Network with business majors, share entrepreneurship ideas, and discuss career opportunities",
        member_count: 142,
      },
      {
        id: "jj0e8400-e29b-41d4-a716-446655440003",
        department: "Biology",
        description:
          "Biology students discussing research, lab work, and pre-medical requirements",
        member_count: 98,
      },
      {
        id: "jj0e8400-e29b-41d4-a716-446655440004",
        department: "Engineering",
        description:
          "Engineering students collaborating on design projects and technical challenges",
        member_count: 167,
      },
    ];

    for (const dept of departments) {
      await supabase
        .from("department_networks")
        .upsert([dept], { onConflict: "id" });
    }
    console.log("✅ Department networks seeded");

    console.log("\n✅ ✅ ✅ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✅ ✅ ✅\n");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  }
};

export default seedDatabase;
