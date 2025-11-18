-- =================================================================
-- COMPREHENSIVE SEED DATA SCRIPT FOR BUDDIES PLATFORM
-- This script creates realistic sample data for development/testing
-- Run this in Supabase SQL Editor or VS Code
-- =================================================================

-- STEP 1: CLEAR ALL EXISTING DATA (in correct dependency order)
-- =================================================================

TRUNCATE TABLE public.appeals CASCADE;
TRUNCATE TABLE public.moderation_actions CASCADE;
TRUNCATE TABLE public.integrity_flags CASCADE;
TRUNCATE TABLE public.content_reports CASCADE;
TRUNCATE TABLE public.forum_replies CASCADE;
TRUNCATE TABLE public.forum_threads CASCADE;
TRUNCATE TABLE public.support_forums CASCADE;
TRUNCATE TABLE public.wellness_goals CASCADE;
TRUNCATE TABLE public.wellness_checkins CASCADE;
TRUNCATE TABLE public.counseling_appointments CASCADE;
TRUNCATE TABLE public.wellness_resources CASCADE;
TRUNCATE TABLE public.location_updates CASCADE;
TRUNCATE TABLE public.location_shares CASCADE;
TRUNCATE TABLE public.safe_walk_requests CASCADE;
TRUNCATE TABLE public.safety_alerts CASCADE;
TRUNCATE TABLE public.pitch_competition_registrations CASCADE;
TRUNCATE TABLE public.pitch_competitions CASCADE;
TRUNCATE TABLE public.cofounder_profiles CASCADE;
TRUNCATE TABLE public.startup_team_members CASCADE;
TRUNCATE TABLE public.startup_opportunities CASCADE;
TRUNCATE TABLE public.research_applications CASCADE;
TRUNCATE TABLE public.research_projects CASCADE;
TRUNCATE TABLE public.research_opportunities CASCADE;
TRUNCATE TABLE public.alumni_network_members CASCADE;
TRUNCATE TABLE public.alumni_networks CASCADE;
TRUNCATE TABLE public.alumni_events CASCADE;
TRUNCATE TABLE public.career_paths CASCADE;
TRUNCATE TABLE public.mentorship_feedback CASCADE;
TRUNCATE TABLE public.mentorship_sessions CASCADE;
TRUNCATE TABLE public.mentorship_pairs CASCADE;
TRUNCATE TABLE public.alumni_profiles CASCADE;
TRUNCATE TABLE public.photo_submissions CASCADE;
TRUNCATE TABLE public.photo_contests CASCADE;
TRUNCATE TABLE public.challenge_participations CASCADE;
TRUNCATE TABLE public.challenges CASCADE;
TRUNCATE TABLE public.semester_recaps CASCADE;
TRUNCATE TABLE public.leaderboard_entries CASCADE;
TRUNCATE TABLE public.leaderboards CASCADE;
TRUNCATE TABLE public.point_transactions CASCADE;
TRUNCATE TABLE public.user_points CASCADE;
TRUNCATE TABLE public.user_achievements CASCADE;
TRUNCATE TABLE public.achievements CASCADE;
TRUNCATE TABLE public.engagement_summary CASCADE;
TRUNCATE TABLE public.at_risk_students CASCADE;
TRUNCATE TABLE public.admin_metrics CASCADE;
TRUNCATE TABLE public.campus_exploration CASCADE;
TRUNCATE TABLE public.feature_usage CASCADE;
TRUNCATE TABLE public.user_analytics CASCADE;
TRUNCATE TABLE public.attendance_streaks CASCADE;
TRUNCATE TABLE public.bucket_list_items CASCADE;
TRUNCATE TABLE public.bucket_lists CASCADE;
TRUNCATE TABLE public.recruitment_applications CASCADE;
TRUNCATE TABLE public.recruitment_periods CASCADE;
TRUNCATE TABLE public.event_check_ins CASCADE;
TRUNCATE TABLE public.event_rsvps CASCADE;
TRUNCATE TABLE public.organization_events CASCADE;
TRUNCATE TABLE public.organization_members CASCADE;
TRUNCATE TABLE public.student_organizations CASCADE;
TRUNCATE TABLE public.anonymous_confessions CASCADE;
TRUNCATE TABLE public.meme_posts CASCADE;
TRUNCATE TABLE public.interest_group_members CASCADE;
TRUNCATE TABLE public.interest_groups CASCADE;
TRUNCATE TABLE public.poll_votes CASCADE;
TRUNCATE TABLE public.poll_options CASCADE;
TRUNCATE TABLE public.campus_polls CASCADE;
TRUNCATE TABLE public.department_members CASCADE;
TRUNCATE TABLE public.department_networks CASCADE;
TRUNCATE TABLE public.class_year_members CASCADE;
TRUNCATE TABLE public.class_year_groups CASCADE;
TRUNCATE TABLE public.question_followers CASCADE;
TRUNCATE TABLE public.question_votes CASCADE;
TRUNCATE TABLE public.answer_votes CASCADE;
TRUNCATE TABLE public.qa_comments CASCADE;
TRUNCATE TABLE public.qa_answers CASCADE;
TRUNCATE TABLE public.qa_questions CASCADE;
TRUNCATE TABLE public.professor_reviews CASCADE;
TRUNCATE TABLE public.textbook_listings CASCADE;
TRUNCATE TABLE public.textbooks CASCADE;
TRUNCATE TABLE public.resources CASCADE;
TRUNCATE TABLE public.tutor_ratings CASCADE;
TRUNCATE TABLE public.tutoring_reviews CASCADE;
TRUNCATE TABLE public.tutoring_sessions CASCADE;
TRUNCATE TABLE public.tutoring_requests CASCADE;
TRUNCATE TABLE public.tutoring_profiles CASCADE;
TRUNCATE TABLE public.project_team_members CASCADE;
TRUNCATE TABLE public.project_listings CASCADE;
TRUNCATE TABLE public.user_skills CASCADE;
TRUNCATE TABLE public.skills CASCADE;
TRUNCATE TABLE public.note_comments CASCADE;
TRUNCATE TABLE public.collab_note_contributors CASCADE;
TRUNCATE TABLE public.collaborative_notes CASCADE;
TRUNCATE TABLE public.note_versions CASCADE;
TRUNCATE TABLE public.shared_notes CASCADE;
TRUNCATE TABLE public.group_project_members CASCADE;
TRUNCATE TABLE public.group_projects CASCADE;
TRUNCATE TABLE public.assignment_tracking CASCADE;
TRUNCATE TABLE public.assignments CASCADE;
TRUNCATE TABLE public.study_group_messages CASCADE;
TRUNCATE TABLE public.study_group_members CASCADE;
TRUNCATE TABLE public.study_groups CASCADE;
TRUNCATE TABLE public.course_community_members CASCADE;
TRUNCATE TABLE public.course_communities CASCADE;
TRUNCATE TABLE public.course_enrollments CASCADE;
TRUNCATE TABLE public.courses CASCADE;
TRUNCATE TABLE public.user_presence CASCADE;
TRUNCATE TABLE public.typing_indicators CASCADE;
TRUNCATE TABLE public.message_reactions CASCADE;
TRUNCATE TABLE public.read_receipts CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.group_chat_members CASCADE;
TRUNCATE TABLE public.group_chats CASCADE;
TRUNCATE TABLE public.chats CASCADE;
TRUNCATE TABLE public.saves CASCADE;
TRUNCATE TABLE public.posts CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- =================================================================
-- STEP 2: INSERT SAMPLE USERS (80 users)
-- =================================================================

INSERT INTO public.users (
  id, email, username, name, bio, imageUrl, imageId, 
  university_id, graduation_year, major, class_year, interests, 
  profile_visibility, verification_status
) VALUES
-- Computer Science Students
('550e8400-e29b-41d4-a716-446655440001', 'emma.chen@university.edu', 'emmachen', 'Emma Chen', 'CS student passionate about AI and machine learning', 'https://i.pravatar.cc/150?img=1', 'avatar_1', 'U12345001', 2025, 'Computer Science', 'Junior', ARRAY['AI', 'Python', 'Machine Learning', 'Hackathons'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440002', 'james.park@university.edu', 'jpark92', 'James Park', 'Web developer interested in React and Node.js', 'https://i.pravatar.cc/150?img=2', 'avatar_2', 'U12345002', 2024, 'Computer Science', 'Senior', ARRAY['Web Development', 'JavaScript', 'React', 'Startups'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440003', 'sarah.williams@university.edu', 'swilliams', 'Sarah Williams', 'Data science enthusiast and coffee lover', 'https://i.pravatar.cc/150?img=3', 'avatar_3', 'U12345003', 2025, 'Computer Science', 'Junior', ARRAY['Data Science', 'Statistics', 'Python', 'Analytics'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440004', 'michael.johnson@university.edu', 'mjohnson', 'Michael Johnson', 'Software engineer with focus on backend systems', 'https://i.pravatar.cc/150?img=4', 'avatar_4', 'U12345004', 2026, 'Computer Science', 'Sophomore', ARRAY['Java', 'Backend', 'Databases', 'DevOps'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440005', 'lisa.rodriguez@university.edu', 'lrodriguez', 'Lisa Rodriguez', 'Cybersecurity enthusiast and ethical hacker', 'https://i.pravatar.cc/150?img=5', 'avatar_5', 'U12345005', 2024, 'Computer Science', 'Senior', ARRAY['Cybersecurity', 'Networking', 'Linux', 'Penetration Testing'], 'public', 'verified'),

-- Engineering Students
('550e8400-e29b-41d4-a716-446655440006', 'david.kumar@university.edu', 'dkumar', 'David Kumar', 'Mechanical engineering student focused on robotics', 'https://i.pravatar.cc/150?img=6', 'avatar_6', 'U12345006', 2025, 'Mechanical Engineering', 'Junior', ARRAY['Robotics', 'CAD', 'Manufacturing', 'Drones'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440007', 'olivia.smith@university.edu', 'osmith', 'Olivia Smith', 'Electrical engineer passionate about IoT', 'https://i.pravatar.cc/150?img=7', 'avatar_7', 'U12345007', 2025, 'Electrical Engineering', 'Junior', ARRAY['IoT', 'Arduino', 'Circuit Design', 'Embedded Systems'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440008', 'alex.thompson@university.edu', 'athompson', 'Alex Thompson', 'Civil engineer interested in sustainable infrastructure', 'https://i.pravatar.cc/150?img=8', 'avatar_8', 'U12345008', 2024, 'Civil Engineering', 'Senior', ARRAY['Sustainability', 'Infrastructure', 'BIM', 'Construction'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440009', 'jessica.anderson@university.edu', 'janderson', 'Jessica Anderson', 'Chemical engineer in pharmaceutical manufacturing', 'https://i.pravatar.cc/150?img=9', 'avatar_9', 'U12345009', 2025, 'Chemical Engineering', 'Junior', ARRAY['Chemistry', 'Pharmaceuticals', 'Process Design', 'Lab Work'], 'public', 'verified'),

-- Business Students
('550e8400-e29b-41d4-a716-446655440010', 'ryan.torres@university.edu', 'rtorres', 'Ryan Torres', 'Business student interested in entrepreneurship', 'https://i.pravatar.cc/150?img=10', 'avatar_10', 'U12345010', 2025, 'Business Administration', 'Junior', ARRAY['Entrepreneurship', 'Finance', 'Startups', 'Marketing'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440011', 'rachel.green@university.edu', 'rgreen', 'Rachel Green', 'Marketing strategist and social media enthusiast', 'https://i.pravatar.cc/150?img=11', 'avatar_11', 'U12345011', 2026, 'Business Administration', 'Sophomore', ARRAY['Marketing', 'Social Media', 'Branding', 'Digital Marketing'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440012', 'kevin.lee@university.edu', 'klee', 'Kevin Lee', 'Finance major and stock market enthusiast', 'https://i.pravatar.cc/150?img=12', 'avatar_12', 'U12345012', 2024, 'Finance', 'Senior', ARRAY['Finance', 'Investing', 'Economics', 'Trading'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440013', 'anna.martinez@university.edu', 'amartinez', 'Anna Martinez', 'Accounting student focused on corporate finance', 'https://i.pravatar.cc/150?img=13', 'avatar_13', 'U12345013', 2025, 'Accounting', 'Junior', ARRAY['Accounting', 'Audit', 'Tax', 'CPA Prep'], 'public', 'verified'),

-- Science Students
('550e8400-e29b-41d4-a716-446655440014', 'mark.wilson@university.edu', 'mwilson', 'Mark Wilson', 'Biology student passionate about genetics research', 'https://i.pravatar.cc/150?img=14', 'avatar_14', 'U12345014', 2024, 'Biology', 'Senior', ARRAY['Genetics', 'Research', 'Lab Work', 'Microscopy'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440015', 'nicole.davis@university.edu', 'ndavis', 'Nicole Davis', 'Chemistry student interested in organic synthesis', 'https://i.pravatar.cc/150?img=15', 'avatar_15', 'U12345015', 2025, 'Chemistry', 'Junior', ARRAY['Chemistry', 'Lab Work', 'Synthesis', 'Research'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440016', 'chris.taylor@university.edu', 'ctaylor', 'Chris Taylor', 'Physics enthusiast with interest in quantum mechanics', 'https://i.pravatar.cc/150?img=16', 'avatar_16', 'U12345016', 2025, 'Physics', 'Junior', ARRAY['Physics', 'Quantum Mechanics', 'Research', 'Math'], 'public', 'verified'),

-- Liberal Arts Students
('550e8400-e29b-41d4-a716-446655440017', 'sophia.harris@university.edu', 'sharris', 'Sophia Harris', 'English major and aspiring novelist', 'https://i.pravatar.cc/150?img=17', 'avatar_17', 'U12345017', 2024, 'English Literature', 'Senior', ARRAY['Writing', 'Literature', 'Creative Writing', 'Poetry'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440018', 'daniel.clark@university.edu', 'dclark', 'Daniel Clark', 'History student interested in American Civil War', 'https://i.pravatar.cc/150?img=18', 'avatar_18', 'U12345018', 2025, 'History', 'Junior', ARRAY['History', 'Research', 'Archives', 'Writing'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440019', 'emma.anderson@university.edu', 'eanderson', 'Emma Anderson', 'Philosophy student exploring ethics and metaphysics', 'https://i.pravatar.cc/150?img=19', 'avatar_19', 'U12345019', 2025, 'Philosophy', 'Junior', ARRAY['Philosophy', 'Ethics', 'Debate', 'Critical Thinking'], 'public', 'verified'),

-- Health Sciences
('550e8400-e29b-41d4-a716-446655440020', 'jennifer.white@university.edu', 'jwhite', 'Jennifer White', 'Pre-med student with volunteer experience', 'https://i.pravatar.cc/150?img=20', 'avatar_20', 'U12345020', 2025, 'Pre-Medicine', 'Junior', ARRAY['Medicine', 'Volunteer Work', 'Research', 'Biology'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440021', 'thomas.martin@university.edu', 'tmartin', 'Thomas Martin', 'Nursing student and patient care advocate', 'https://i.pravatar.cc/150?img=21', 'avatar_21', 'U12345021', 2025, 'Nursing', 'Junior', ARRAY['Healthcare', 'Nursing', 'Patient Care', 'Clinical'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440022', 'melissa.garcia@university.edu', 'mgarcia', 'Melissa Garcia', 'Psychology student researching mental health', 'https://i.pravatar.cc/150?img=22', 'avatar_22', 'U12345022', 2024, 'Psychology', 'Senior', ARRAY['Psychology', 'Research', 'Mental Health', 'Clinical'], 'public', 'verified'),

-- Additional diverse mix
('550e8400-e29b-41d4-a716-446655440023', 'brandon.jackson@university.edu', 'bjackson', 'Brandon Jackson', 'Art student and digital designer', 'https://i.pravatar.cc/150?img=23', 'avatar_23', 'U12345023', 2025, 'Fine Arts', 'Junior', ARRAY['Design', 'Digital Art', 'Photography', 'Creativity'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440024', 'ashley.lee@university.edu', 'alee', 'Ashley Lee', 'Music student and classical pianist', 'https://i.pravatar.cc/150?img=24', 'avatar_24', 'U12345024', 2024, 'Music', 'Senior', ARRAY['Music', 'Piano', 'Classical', 'Performance'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440025', 'nathan.brown@university.edu', 'nbrown', 'Nathan Brown', 'Theater student with passion for acting', 'https://i.pravatar.cc/150?img=25', 'avatar_25', 'U12345025', 2026, 'Theater Arts', 'Sophomore', ARRAY['Theater', 'Acting', 'Performance', 'Drama'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440026', 'haley.martinez@university.edu', 'hmartinez', 'Haley Martinez', 'Environmental science student passionate about sustainability', 'https://i.pravatar.cc/150?img=26', 'avatar_26', 'U12345026', 2025, 'Environmental Science', 'Junior', ARRAY['Environment', 'Sustainability', 'Conservation', 'Climate'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440027', 'jacob.harris@university.edu', 'jharris', 'Jacob Harris', 'Exercise science student and fitness enthusiast', 'https://i.pravatar.cc/150?img=27', 'avatar_27', 'U12345027', 2026, 'Exercise Science', 'Sophomore', ARRAY['Fitness', 'Sports', 'Health', 'Wellness'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440028', 'victoria.white@university.edu', 'vwhite', 'Victoria White', 'Education student aspiring to teach secondary English', 'https://i.pravatar.cc/150?img=28', 'avatar_28', 'U12345028', 2024, 'Education', 'Senior', ARRAY['Teaching', 'Education', 'English', 'Mentoring'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440029', 'ethan.young@university.edu', 'eyoung', 'Ethan Young', 'Communications student interested in journalism', 'https://i.pravatar.cc/150?img=29', 'avatar_29', 'U12345029', 2025, 'Communications', 'Junior', ARRAY['Journalism', 'Writing', 'Media', 'Broadcasting'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440030', 'grace.taylor@university.edu', 'gtaylor', 'Grace Taylor', 'Social work student focused on community development', 'https://i.pravatar.cc/150?img=30', 'avatar_30', 'U12345030', 2025, 'Social Work', 'Junior', ARRAY['Social Work', 'Community', 'Advocacy', 'Helping'], 'public', 'verified'),

-- More students to reach 80
('550e8400-e29b-41d4-a716-446655440031', 'lucas.davis@university.edu', 'ldavis', 'Lucas Davis', 'Economics student with interest in behavioral economics', 'https://i.pravatar.cc/150?img=31', 'avatar_31', 'U12345031', 2026, 'Economics', 'Sophomore', ARRAY['Economics', 'Finance', 'Analysis', 'Research'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440032', 'ava.rodriguez@university.edu', 'arodriguez', 'Ava Rodriguez', 'Political science student passionate about policy', 'https://i.pravatar.cc/150?img=32', 'avatar_32', 'U12345032', 2024, 'Political Science', 'Senior', ARRAY['Politics', 'Policy', 'Debate', 'Governance'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440033', 'mason.thompson@university.edu', 'mthompson', 'Mason Thompson', 'Law student preparing for bar exam', 'https://i.pravatar.cc/150?img=33', 'avatar_33', 'U12345033', 2024, 'Law', 'Senior', ARRAY['Law', 'Justice', 'Legal Studies', 'Bar Prep'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440034', 'chloe.jackson@university.edu', 'cjackson', 'Chloe Jackson', 'Business analytics student with SQL expertise', 'https://i.pravatar.cc/150?img=34', 'avatar_34', 'U12345034', 2025, 'Business Analytics', 'Junior', ARRAY['Analytics', 'SQL', 'Data', 'Business'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440035', 'noah.martin@university.edu', 'nmartin', 'Noah Martin', 'Supply chain management student', 'https://i.pravatar.cc/150?img=35', 'avatar_35', 'U12345035', 2025, 'Supply Chain Management', 'Junior', ARRAY['Supply Chain', 'Logistics', 'Operations', 'Management'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440036', 'isabella.garcia@university.edu', 'igarcia', 'Isabella Garcia', 'International relations student interested in diplomacy', 'https://i.pravatar.cc/150?img=36', 'avatar_36', 'U12345036', 2024, 'International Relations', 'Senior', ARRAY['Diplomacy', 'International', 'Politics', 'Languages'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440037', 'jackson.wilson@university.edu', 'jwilson', 'Jackson Wilson', 'Mathematics student tutoring peers', 'https://i.pravatar.cc/150?img=37', 'avatar_37', 'U12345037', 2025, 'Mathematics', 'Junior', ARRAY['Mathematics', 'Tutoring', 'Problem Solving', 'Teaching'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440038', 'zoe.anderson@university.edu', 'zanderson', 'Zoe Anderson', 'Statistics and actuarial science student', 'https://i.pravatar.cc/150?img=38', 'avatar_38', 'U12345038', 2025, 'Actuarial Science', 'Junior', ARRAY['Statistics', 'Actuarial', 'Math', 'Finance'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440039', 'liam.clark@university.edu', 'lclark', 'Liam Clark', 'Environmental engineering student', 'https://i.pravatar.cc/150?img=39', 'avatar_39', 'U12345039', 2025, 'Environmental Engineering', 'Junior', ARRAY['Engineering', 'Environment', 'Sustainability', 'Innovation'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440040', 'mia.taylor@university.edu', 'mtaylor', 'Mia Taylor', 'Biomedical engineering student', 'https://i.pravatar.cc/150?img=40', 'avatar_40', 'U12345040', 2025, 'Biomedical Engineering', 'Junior', ARRAY['Biomedical', 'Engineering', 'Health Tech', 'Innovation'], 'public', 'verified'),

('550e8400-e29b-41d4-a716-446655440041', 'aiden.harris@university.edu', 'aharris', 'Aiden Harris', 'Software engineering student', 'https://i.pravatar.cc/150?img=41', 'avatar_41', 'U12345041', 2025, 'Software Engineering', 'Junior', ARRAY['Software', 'Engineering', 'Development', 'Design'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440042', 'emma.jones@university.edu', 'ejones', 'Emma Jones', 'Game development student', 'https://i.pravatar.cc/150?img=42', 'avatar_42', 'U12345042', 2026, 'Game Development', 'Sophomore', ARRAY['Gaming', 'Development', 'Creativity', 'Technology'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440043', 'oliver.white@university.edu', 'owhite', 'Oliver White', 'Artificial intelligence researcher', 'https://i.pravatar.cc/150?img=43', 'avatar_43', 'U12345043', 2024, 'Computer Science', 'Senior', ARRAY['AI', 'Machine Learning', 'Research', 'Neural Networks'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440044', 'sophia.miller@university.edu', 'smiller', 'Sophia Miller', 'User experience designer', 'https://i.pravatar.cc/150?img=44', 'avatar_44', 'U12345044', 2025, 'Design', 'Junior', ARRAY['UX Design', 'Design', 'UI', 'Prototyping'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440045', 'ethan.moore@university.edu', 'emore', 'Ethan Moore', 'Cybersecurity analyst student', 'https://i.pravatar.cc/150?img=45', 'avatar_45', 'U12345045', 2026, 'Cybersecurity', 'Sophomore', ARRAY['Security', 'Networks', 'Defense', 'Ethical Hacking'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440046', 'charlotte.davis@university.edu', 'cdavis', 'Charlotte Davis', 'Cloud computing student', 'https://i.pravatar.cc/150?img=46', 'avatar_46', 'U12345046', 2025, 'Cloud Computing', 'Junior', ARRAY['Cloud', 'AWS', 'DevOps', 'Infrastructure'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440047', 'benjamin.wilson@university.edu', 'bwilson', 'Benjamin Wilson', 'Mobile app developer', 'https://i.pravatar.cc/150?img=47', 'avatar_47', 'U12345047', 2024, 'Computer Science', 'Senior', ARRAY['Mobile Dev', 'iOS', 'Android', 'Apps'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440048', 'amelia.taylor@university.edu', 'ataylor', 'Amelia Taylor', 'Full-stack developer', 'https://i.pravatar.cc/150?img=48', 'avatar_48', 'U12345048', 2025, 'Computer Science', 'Junior', ARRAY['Full Stack', 'Web Dev', 'React', 'Node.js'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440049', 'logan.anderson@university.edu', 'landerson', 'Logan Anderson', 'Database engineer student', 'https://i.pravatar.cc/150?img=49', 'avatar_49', 'U12345049', 2025, 'Database Engineering', 'Junior', ARRAY['Databases', 'SQL', 'PostgreSQL', 'Data Modeling'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440050', 'harper.jones@university.edu', 'hjones', 'Harper Jones', 'Machine learning engineer', 'https://i.pravatar.cc/150?img=50', 'avatar_50', 'U12345050', 2024, 'Machine Learning', 'Senior', ARRAY['ML', 'Python', 'TensorFlow', 'AI'], 'public', 'verified'),

('550e8400-e29b-41d4-a716-446655440051', 'henry.clark@university.edu', 'hclark', 'Henry Clark', 'Systems administrator student', 'https://i.pravatar.cc/150?img=51', 'avatar_51', 'U12345051', 2025, 'Computer Science', 'Junior', ARRAY['Systems Admin', 'Linux', 'Networks', 'Infrastructure'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440052', 'evelyn.white@university.edu', 'ewhite', 'Evelyn White', 'QA engineer student', 'https://i.pravatar.cc/150?img=52', 'avatar_52', 'U12345052', 2025, 'Software Testing', 'Junior', ARRAY['QA Testing', 'Automation', 'Bug Tracking', 'Quality'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440053', 'matthew.harris@university.edu', 'mharris', 'Matthew Harris', 'DevOps engineer student', 'https://i.pravatar.cc/150?img=53', 'avatar_53', 'U12345053', 2024, 'DevOps Engineering', 'Senior', ARRAY['DevOps', 'Docker', 'Kubernetes', 'CI/CD'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440054', 'scarlett.martin@university.edu', 'smartin', 'Scarlett Martin', 'IT support student', 'https://i.pravatar.cc/150?img=54', 'avatar_54', 'U12345054', 2026, 'Information Technology', 'Sophomore', ARRAY['IT Support', 'Help Desk', 'Troubleshooting', 'Service'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440055', 'jack.taylor@university.edu', 'jtaylor', 'Jack Taylor', 'Network engineer student', 'https://i.pravatar.cc/150?img=55', 'avatar_55', 'U12345055', 2025, 'Network Engineering', 'Junior', ARRAY['Networking', 'Cisco', 'TCP/IP', 'Security'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440056', 'lily.anderson@university.edu', 'landerson2', 'Lily Anderson', 'Web design student', 'https://i.pravatar.cc/150?img=56', 'avatar_56', 'U12345056', 2026, 'Web Design', 'Sophomore', ARRAY['Web Design', 'CSS', 'HTML', 'Creative'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440057', 'william.miller@university.edu', 'wmiller', 'William Miller', 'Graphics programmer student', 'https://i.pravatar.cc/150?img=57', 'avatar_57', 'U12345057', 2025, 'Computer Science', 'Junior', ARRAY['Graphics', 'OpenGL', '3D', 'Game Engine'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440058', 'abigail.davis@university.edu', 'adavis', 'Abigail Davis', 'Blockchain developer student', 'https://i.pravatar.cc/150?img=58', 'avatar_58', 'U12345058', 2025, 'Blockchain Engineering', 'Junior', ARRAY['Blockchain', 'Crypto', 'Smart Contracts', 'Web3'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440059', 'sebastian.jones@university.edu', 'sjones', 'Sebastian Jones', 'Augmented reality developer', 'https://i.pravatar.cc/150?img=59', 'avatar_59', 'U12345059', 2024, 'Computer Science', 'Senior', ARRAY['AR', 'VR', 'Unity', 'Immersive Tech'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440060', 'aria.taylor@university.edu', 'ataylor2', 'Aria Taylor', 'Natural language processing student', 'https://i.pravatar.cc/150?img=60', 'avatar_60', 'U12345060', 2025, 'NLP Engineering', 'Junior', ARRAY['NLP', 'AI', 'Python', 'Deep Learning'], 'public', 'verified'),

('550e8400-e29b-41d4-a716-446655440061', 'finn.brown@university.edu', 'fbrown', 'Finn Brown', 'IoT developer student', 'https://i.pravatar.cc/150?img=61', 'avatar_61', 'U12345061', 2025, 'IoT Engineering', 'Junior', ARRAY['IoT', 'Embedded', 'Arduino', 'Sensors'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440062', 'iris.miller@university.edu', 'imiller', 'Iris Miller', 'Big data engineer student', 'https://i.pravatar.cc/150?img=62', 'avatar_62', 'U12345062', 2024, 'Big Data Engineering', 'Senior', ARRAY['Big Data', 'Hadoop', 'Spark', 'Analytics'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440063', 'marco.garcia@university.edu', 'mgarcia2', 'Marco Garcia', 'Site reliability engineer student', 'https://i.pravatar.cc/150?img=63', 'avatar_63', 'U12345063', 2025, 'SRE', 'Junior', ARRAY['SRE', 'Reliability', 'Monitoring', 'Infrastructure'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440064', 'diana.white@university.edu', 'dwhite', 'Diana White', 'Product manager student', 'https://i.pravatar.cc/150?img=64', 'avatar_64', 'U12345064', 2025, 'Product Management', 'Junior', ARRAY['Product', 'Management', 'Strategy', 'Leadership'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440065', 'leon.harris@university.edu', 'lharris', 'Leon Harris', 'Scrum master student', 'https://i.pravatar.cc/150?img=65', 'avatar_65', 'U12345065', 2024, 'Agile Management', 'Senior', ARRAY['Scrum', 'Agile', 'Management', 'Leadership'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440066', 'tessa.martin@university.edu', 'tmartin', 'Tessa Martin', 'Technical writer student', 'https://i.pravatar.cc/150?img=66', 'avatar_66', 'U12345066', 2025, 'Technical Writing', 'Junior', ARRAY['Writing', 'Documentation', 'Technical', 'Communication'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440067', 'victor.anderson@university.edu', 'vanderson', 'Victor Anderson', 'Solutions architect student', 'https://i.pravatar.cc/150?img=67', 'avatar_67', 'U12345067', 2024, 'Architecture', 'Senior', ARRAY['Architecture', 'Design', 'Solutions', 'Enterprise'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440068', 'aurora.taylor@university.edu', 'auroral', 'Aurora Taylor', 'Data analyst student', 'https://i.pravatar.cc/150?img=68', 'avatar_68', 'U12345068', 2025, 'Data Analytics', 'Junior', ARRAY['Analytics', 'Tableau', 'SQL', 'Business Intelligence'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440069', 'xavier.jones@university.edu', 'xjones', 'Xavier Jones', 'Performance optimization student', 'https://i.pravatar.cc/150?img=69', 'avatar_69', 'U12345069', 2025, 'Performance Engineering', 'Junior', ARRAY['Performance', 'Optimization', 'Profiling', 'Benchmarking'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440070', 'yasmin.white@university.edu', 'ywhite', 'Yasmin White', 'Security architect student', 'https://i.pravatar.cc/150?img=70', 'avatar_70', 'U12345070', 2024, 'Security Architecture', 'Senior', ARRAY['Security', 'Architecture', 'Defense', 'Compliance'], 'public', 'verified'),

('550e8400-e29b-41d4-a716-446655440071', 'zeus.miller@university.edu', 'zmiller', 'Zeus Miller', 'API designer student', 'https://i.pravatar.cc/150?img=71', 'avatar_71', 'U12345071', 2025, 'API Engineering', 'Junior', ARRAY['APIs', 'REST', 'GraphQL', 'Integration'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440072', 'amy.garcia@university.edu', 'agarcia', 'Amy Garcia', 'Mobile UX designer', 'https://i.pravatar.cc/150?img=72', 'avatar_72', 'U12345072', 2025, 'UX Design', 'Junior', ARRAY['Mobile UX', 'Design', 'Prototyping', 'User Research'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440073', 'blake.harris@university.edu', 'bharris', 'Blake Harris', 'Frontend developer student', 'https://i.pravatar.cc/150?img=73', 'avatar_73', 'U12345073', 2025, 'Frontend Engineering', 'Junior', ARRAY['Frontend', 'React', 'JavaScript', 'CSS'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440074', 'clara.taylor@university.edu', 'ctaylor2', 'Clara Taylor', 'Backend API developer', 'https://i.pravatar.cc/150?img=74', 'avatar_74', 'U12345074', 2024, 'Backend Engineering', 'Senior', ARRAY['Backend', 'Python', 'FastAPI', 'Databases'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440075', 'danny.martin@university.edu', 'dmartin', 'Danny Martin', 'Framework developer student', 'https://i.pravatar.cc/150?img=75', 'avatar_75', 'U12345075', 2025, 'Framework Engineering', 'Junior', ARRAY['Frameworks', 'Open Source', 'Contribution', 'Development'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440076', 'emma.clark@university.edu', 'eclark', 'Emma Clark', 'Testing automation student', 'https://i.pravatar.cc/150?img=76', 'avatar_76', 'U12345076', 2025, 'Test Automation', 'Junior', ARRAY['Testing', 'Automation', 'Selenium', 'Quality'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440077', 'felix.anderson@university.edu', 'fanderson', 'Felix Anderson', 'Compliance engineer student', 'https://i.pravatar.cc/150?img=77', 'avatar_77', 'U12345077', 2024, 'Compliance Engineering', 'Senior', ARRAY['Compliance', 'Regulations', 'Standards', 'Audit'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440078', 'grace.jones@university.edu', 'gjones', 'Grace Jones', 'ML ops engineer student', 'https://i.pravatar.cc/150?img=78', 'avatar_78', 'U12345078', 2025, 'MLOps', 'Junior', ARRAY['MLOps', 'ML Pipeline', 'Production', 'Automation'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440079', 'henry.white@university.edu', 'hwhite', 'Henry White', 'Platform engineer student', 'https://i.pravatar.cc/150?img=79', 'avatar_79', 'U12345079', 2025, 'Platform Engineering', 'Junior', ARRAY['Platform', 'Infrastructure', 'Developer Experience', 'Tooling'], 'public', 'verified'),
('550e8400-e29b-41d4-a716-446655440080', 'iris.anderson@university.edu', 'ianderson', 'Iris Anderson', 'Distributed systems student', 'https://i.pravatar.cc/150?img=80', 'avatar_80', 'U12345080', 2025, 'Distributed Systems', 'Junior', ARRAY['Distributed Systems', 'Scalability', 'Concurrency', 'Consensus'], 'public', 'verified');

-- =================================================================
-- STEP 3: INSERT SAMPLE COURSES (15 courses)
-- =================================================================

INSERT INTO public.courses (
  id, course_code, course_name, professor, department, semester, section, 
  credits, location, enrollment_count, max_enrollment, schedule_json
) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'CS101', 'Introduction to Computer Science', 'Dr. Robert Smith', 'Computer Science', 'Fall 2024', 'A', 3, 'Tech Hall 101', 45, 50, '{"monday": "10:00-11:30", "wednesday": "10:00-11:30"}'),
('650e8400-e29b-41d4-a716-446655440002', 'CS201', 'Data Structures and Algorithms', 'Prof. Patricia Johnson', 'Computer Science', 'Fall 2024', 'A', 4, 'Tech Hall 205', 38, 45, '{"tuesday": "13:00-14:30", "thursday": "13:00-14:30"}'),
('650e8400-e29b-41d4-a716-446655440003', 'CS301', 'Web Development with React', 'Dr. Michael Chen', 'Computer Science', 'Fall 2024', 'A', 3, 'Tech Hall 310', 40, 50, '{"wednesday": "15:00-17:00", "friday": "15:00-17:00"}'),
('650e8400-e29b-41d4-a716-446655440004', 'MATH201', 'Calculus II', 'Prof. Elizabeth Williams', 'Mathematics', 'Fall 2024', 'A', 4, 'Math Building 120', 35, 40, '{"monday": "09:00-10:30", "wednesday": "09:00-10:30"}'),
('650e8400-e29b-41d4-a716-446655440005', 'PHYS101', 'Physics I - Mechanics', 'Dr. James Wilson', 'Physics', 'Fall 2024', 'A', 4, 'Science Hall 201', 32, 40, '{"tuesday": "10:00-11:30", "thursday": "10:00-11:30"}'),
('650e8400-e29b-41d4-a716-446655440006', 'CHEM101', 'General Chemistry', 'Prof. Susan Miller', 'Chemistry', 'Fall 2024', 'A', 4, 'Science Hall 305', 36, 45, '{"monday": "11:00-12:30", "thursday": "11:00-12:30"}'),
('650e8400-e29b-41d4-a716-446655440007', 'BIO101', 'Biology I - Cellular and Molecular', 'Dr. Thomas Anderson', 'Biology', 'Fall 2024', 'A', 4, 'Science Hall 401', 40, 50, '{"wednesday": "08:00-09:30", "friday": "08:00-09:30"}'),
('650e8400-e29b-41d4-a716-446655440008', 'ECON101', 'Principles of Economics', 'Prof. David Taylor', 'Economics', 'Fall 2024', 'A', 3, 'Business Building 201', 42, 50, '{"tuesday": "14:00-15:30", "thursday": "14:00-15:30"}'),
('650e8400-e29b-41d4-a716-446655440009', 'ENG101', 'English Composition and Literature', 'Prof. Margaret Harris', 'English', 'Fall 2024', 'A', 3, 'Arts Building 105', 28, 35, '{"monday": "13:00-14:30", "wednesday": "13:00-14:30"}'),
('650e8400-e29b-41d4-a716-446655440010', 'PSY101', 'Introduction to Psychology', 'Dr. Karen Brown', 'Psychology', 'Fall 2024', 'A', 3, 'Social Sciences 301', 44, 50, '{"tuesday": "11:00-12:30", "thursday": "11:00-12:30"}'),
('650e8400-e29b-41d4-a716-446655440011', 'HIST101', 'World History to 1500', 'Prof. Charles Davis', 'History', 'Fall 2024', 'A', 3, 'Humanities 202', 35, 45, '{"wednesday": "14:00-15:30", "friday": "14:00-15:30"}'),
('650e8400-e29b-41d4-a716-446655440012', 'ART101', 'Art History and Appreciation', 'Dr. Lisa Garcia', 'Fine Arts', 'Fall 2024', 'A', 3, 'Arts Building 310', 30, 40, '{"tuesday": "13:00-14:30", "friday": "13:00-14:30"}'),
('650e8400-e29b-41d4-a716-446655440013', 'MUS101', 'Music Theory Fundamentals', 'Prof. James Martinez', 'Music', 'Fall 2024', 'A', 2, 'Music Building 101', 20, 25, '{"monday": "15:00-16:30"}'),
('650e8400-e29b-41d4-a716-446655440014', 'CS401', 'Machine Learning and AI', 'Dr. Robert Zhang', 'Computer Science', 'Fall 2024', 'A', 4, 'Tech Hall 420', 32, 40, '{"wednesday": "10:00-12:00", "friday": "10:00-12:00"}'),
('650e8400-e29b-41d4-a716-446655440015', 'BUS201', 'Business Management Principles', 'Prof. Jessica Martin', 'Business Administration', 'Fall 2024', 'A', 3, 'Business Building 305', 39, 50, '{"tuesday": "09:00-10:30", "thursday": "09:00-10:30"}');

-- =================================================================
-- STEP 4: INSERT COURSE ENROLLMENTS (multiple enrollments per course)
-- =================================================================

INSERT INTO public.course_enrollments (user_id, course_id, enrollment_date) VALUES
-- CS101 enrollments
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', now()),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', now()),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', now()),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', now()),
('550e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440001', now()),

-- CS201 enrollments
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', now()),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', now()),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', now()),
('550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', now()),

-- CS301 enrollments
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', now()),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', now()),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', now()),
('550e8400-e29b-41d4-a716-446655440047', '650e8400-e29b-41d4-a716-446655440003', now()),
('550e8400-e29b-41d4-a716-446655440048', '650e8400-e29b-41d4-a716-446655440003', now()),

-- MATH201 enrollments
('550e8400-e29b-41d4-a716-446655440037', '650e8400-e29b-41d4-a716-446655440004', now()),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', now()),
('550e8400-e29b-41d4-a716-446655440038', '650e8400-e29b-41d4-a716-446655440004', now()),

-- PHYS101 enrollments
('550e8400-e29b-41d4-a716-446655440016', '650e8400-e29b-41d4-a716-446655440005', now()),
('550e8400-e29b-41d4-a716-446655440037', '650e8400-e29b-41d4-a716-446655440005', now()),
('550e8400-e29b-41d4-a716-446655440045', '650e8400-e29b-41d4-a716-446655440005', now()),

-- CHEM101 enrollments
('550e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440006', now()),
('550e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440006', now()),
('550e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440006', now()),

-- BIO101 enrollments
('550e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440007', now()),
('550e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440007', now()),
('550e8400-e29b-41d4-a716-446655440040', '650e8400-e29b-41d4-a716-446655440007', now()),
('550e8400-e29b-41d4-a716-446655440026', '650e8400-e29b-41d4-a716-446655440007', now()),

-- ECON101 enrollments
('550e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440008', now()),
('550e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440008', now()),
('550e8400-e29b-41d4-a716-446655440031', '650e8400-e29b-41d4-a716-446655440008', now()),
('550e8400-e29b-41d4-a716-446655440034', '650e8400-e29b-41d4-a716-446655440008', now()),

-- ENG101 enrollments
('550e8400-e29b-41d4-a716-446655440017', '650e8400-e29b-41d4-a716-446655440009', now()),
('550e8400-e29b-41d4-a716-446655440029', '650e8400-e29b-41d4-a716-446655440009', now()),
('550e8400-e29b-41d4-a716-446655440066', '650e8400-e29b-41d4-a716-446655440009', now()),

-- PSY101 enrollments
('550e8400-e29b-41d4-a716-446655440022', '650e8400-e29b-41d4-a716-446655440010', now()),
('550e8400-e29b-41d4-a716-446655440030', '650e8400-e29b-41d4-a716-446655440010', now()),
('550e8400-e29b-41d4-a716-446655440027', '650e8400-e29b-41d4-a716-446655440010', now()),
('550e8400-e29b-41d4-a716-446655440021', '650e8400-e29b-41d4-a716-446655440010', now()),

-- HIST101 enrollments
('550e8400-e29b-41d4-a716-446655440018', '650e8400-e29b-41d4-a716-446655440011', now()),
('550e8400-e29b-41d4-a716-446655440032', '650e8400-e29b-41d4-a716-446655440011', now()),
('550e8400-e29b-41d4-a716-446655440033', '650e8400-e29b-41d4-a716-446655440011', now()),

-- ART101 enrollments
('550e8400-e29b-41d4-a716-446655440023', '650e8400-e29b-41d4-a716-446655440012', now()),
('550e8400-e29b-41d4-a716-446655440044', '650e8400-e29b-41d4-a716-446655440012', now()),
('550e8400-e29b-41d4-a716-446655440072', '650e8400-e29b-41d4-a716-446655440012', now()),

-- MUS101 enrollments
('550e8400-e29b-41d4-a716-446655440024', '650e8400-e29b-41d4-a716-446655440013', now()),

-- CS401 enrollments
('550e8400-e29b-41d4-a716-446655440043', '650e8400-e29b-41d4-a716-446655440014', now()),
('550e8400-e29b-41d4-a716-446655440050', '650e8400-e29b-41d4-a716-446655440014', now()),
('550e8400-e29b-41d4-a716-446655440060', '650e8400-e29b-41d4-a716-446655440014', now()),
('550e8400-e29b-41d4-a716-446655440062', '650e8400-e29b-41d4-a716-446655440014', now()),

-- BUS201 enrollments
('550e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440015', now()),
('550e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440015', now()),
('550e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440015', now()),
('550e8400-e29b-41d4-a716-446655440013', '650e8400-e29b-41d4-a716-446655440015', now()),
('550e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440015', now());

-- =================================================================
-- STEP 5: INSERT SAMPLE POSTS (30 posts)
-- =================================================================

INSERT INTO public.posts (creator, caption, imageUrl, imageName, location, tags, likes, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Just finished an amazing ML project! Excited to share my results.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', 'ml_project_1.jpg', 'Tech Hall Lab', ARRAY['AI', 'ML', 'Project', 'Success'], ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'], now()),
('550e8400-e29b-41d4-a716-446655440002', 'Campus coffee runs hit different on Friday mornings ☕', 'https://images.unsplash.com/photo-1495474472639-4c91a6e1c869?w=500', 'coffee_friday.jpg', 'Campus Cafe', ARRAY['Coffee', 'Campus', 'Friday', 'Vibes'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'], now() - interval '2 days'),
('550e8400-e29b-41d4-a716-446655440003', 'Study group success! Aced the DS exam thanks to collaborative learning 📚', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'study_session.jpg', 'Library', ARRAY['Study', 'Success', 'Teamwork', 'Learning'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'], now() - interval '3 days'),
('550e8400-e29b-41d4-a716-446655440004', 'Beautiful sunset from the dormitory roof 🌅', 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=500', 'campus_sunset.jpg', 'Dorm Roof', ARRAY['Sunset', 'Campus', 'Beautiful', 'Nature'], ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], now() - interval '1 day'),
('550e8400-e29b-41d4-a716-446655440005', 'Just joined the cybersecurity club! Ready to learn from the best 🔐', 'https://images.unsplash.com/photo-1560807707-e5b97ad40332?w=500', 'cybersec_club.jpg', 'Tech Center', ARRAY['Cybersecurity', 'Club', 'Learning', 'Tech'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '5 days'),
('550e8400-e29b-41d4-a716-446655440006', 'Robotics competition this weekend! Wish us luck 🤖', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', 'robotics_comp.jpg', 'Engineering Lab', ARRAY['Robotics', 'Competition', 'Engineering', 'Innovation'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'], now() - interval '4 days'),
('550e8400-e29b-41d4-a716-446655440007', 'Amazing networking event at the career fair today! Got 3 internship leads 💼', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'career_fair.jpg', 'Convention Center', ARRAY['Career', 'Networking', 'Internship', 'Opportunity'], ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], now() - interval '6 days'),
('550e8400-e29b-41d4-a716-446655440008', 'Our design team just won the UI/UX hackathon! 🎨🏆', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', 'hackathon_win.jpg', 'Student Center', ARRAY['Design', 'Hackathon', 'Win', 'Proud'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'], now() - interval '7 days'),
('550e8400-e29b-41d4-a716-446655440009', 'Chemistry lab practical exam passed with flying colors! 🧪', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500', 'chem_lab_success.jpg', 'Science Hall', ARRAY['Chemistry', 'Lab', 'Success', 'Science'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '8 days'),
('550e8400-e29b-41d4-a716-446655440010', 'Started my entrepreneurship journey! Launching a new fintech startup 🚀', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'startup_launch.jpg', 'Startup Hub', ARRAY['Startup', 'Entrepreneurship', 'Tech', 'Innovation'], ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'], now() - interval '9 days'),
('550e8400-e29b-41d4-a716-446655440011', 'Marketing campaign for our club event is live! Check it out 📢', 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500', 'marketing_campaign.jpg', 'Campus', ARRAY['Marketing', 'Campaign', 'Event', 'Promotion'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '10 days'),
('550e8400-e29b-41d4-a716-446655440012', 'Stock market simulation tournament top 5! 📈', 'https://images.unsplash.com/photo-1526304640581-c87b552f13d2?w=500', 'stock_tournament.jpg', 'Finance Lab', ARRAY['Finance', 'Trading', 'Competition', 'Success'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '11 days'),
('550e8400-e29b-41d4-a716-446655440013', 'Audit project presentation tomorrow! Fingers crossed 🤞', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500', 'audit_project.jpg', 'Business Building', ARRAY['Accounting', 'Audit', 'Project', 'Presentation'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '12 days'),
('550e8400-e29b-41d4-a716-446655440014', 'Genetics research findings published in peer-reviewed journal! 🔬📰', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500', 'genetics_research.jpg', 'Lab', ARRAY['Research', 'Genetics', 'Published', 'Science'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], now() - interval '13 days'),
('550e8400-e29b-41d4-a716-446655440015', 'Organic synthesis lab demo went perfectly! Great teamwork 🧬', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500', 'organic_synthesis.jpg', 'Chemistry Lab', ARRAY['Chemistry', 'Lab', 'Synthesis', 'Science'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '14 days'),
('550e8400-e29b-41d4-a716-446655440016', 'Physics lab report submitted! Quantum mechanics is mind-bending 🌀', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', 'quantum_mechanics.jpg', 'Physics Building', ARRAY['Physics', 'Quantum', 'Lab', 'Science'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '15 days'),
('550e8400-e29b-41d4-a716-446655440017', 'Creative writing workshop was inspirational ✍️', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500', 'writing_workshop.jpg', 'Arts Building', ARRAY['Writing', 'Creative', 'Workshop', 'Learning'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '16 days'),
('550e8400-e29b-41d4-a716-446655440018', 'Archival research for my history thesis is fascinating! 📚', 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500', 'archive_research.jpg', 'Library Archives', ARRAY['History', 'Research', 'Archives', 'Academic'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '17 days'),
('550e8400-e29b-41d4-a716-446655440019', 'Philosophy debate tournament was enlightening 🤔', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'philosophy_debate.jpg', 'Humanities', ARRAY['Philosophy', 'Debate', 'Critical Thinking', 'Learning'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '18 days'),
('550e8400-e29b-41d4-a716-446655440020', 'Volunteering at the hospital - making a difference! 🏥❤️', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500', 'hospital_volunteer.jpg', 'General Hospital', ARRAY['Volunteer', 'Healthcare', 'Community', 'Helping'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '19 days'),
('550e8400-e29b-41d4-a716-446655440021', 'Clinical rotation completed successfully! Ready for practicum 👩‍⚕️', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500', 'clinical_rotation.jpg', 'Hospital', ARRAY['Nursing', 'Clinical', 'Healthcare', 'Achievement'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '20 days'),
('550e8400-e29b-41d4-a716-446655440022', 'Mental health awareness campaign launching next week 🧠💚', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500', 'mental_health_campaign.jpg', 'Campus', ARRAY['Mental Health', 'Awareness', 'Campaign', 'Wellness'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '21 days'),
('550e8400-e29b-41d4-a716-446655440023', 'Digital art exhibition opening tomorrow! Come check it out 🎨', 'https://images.unsplash.com/photo-1578301978162-7a9874d3de22?w=500', 'digital_art_expo.jpg', 'Arts Gallery', ARRAY['Art', 'Digital', 'Exhibition', 'Creative'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '22 days'),
('550e8400-e29b-41d4-a716-446655440024', 'Piano recital went amazingly well! Thanks for the support 🎹', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500', 'piano_recital.jpg', 'Concert Hall', ARRAY['Music', 'Performance', 'Piano', 'Achievement'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '23 days'),
('550e8400-e29b-41d4-a716-446655440025', 'Stage fright conquered! Theater performance was incredible 🎭', 'https://images.unsplash.com/photo-1485579149c01123123e6a4e2e0f4e8?w=500', 'theater_performance.jpg', 'Theater', ARRAY['Theater', 'Performance', 'Acting', 'Brave'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '24 days'),
('550e8400-e29b-41d4-a716-446655440026', 'Climate action project presentation at environmental summit 🌍', 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500', 'climate_action.jpg', 'Conference Center', ARRAY['Environment', 'Sustainability', 'Climate', 'Action'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '25 days'),
('550e8400-e29b-41d4-a716-446655440027', 'Marathon training progress update! 🏃💪', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', 'marathon_training.jpg', 'Campus Track', ARRAY['Fitness', 'Training', 'Marathon', 'Health'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '26 days'),
('550e8400-e29b-41d4-a716-446655440028', 'Student teaching practicum approved! Ready to inspire young minds 📚✨', 'https://images.unsplash.com/photo-1427504494785-cdaa41766539?w=500', 'student_teaching.jpg', 'School', ARRAY['Teaching', 'Education', 'Practicum', 'Inspiring'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '27 days'),
('550e8400-e29b-41d4-a716-446655440029', 'Podcast episode on campus life just went live! 🎙️', 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500', 'podcast_launch.jpg', 'Studio', ARRAY['Podcast', 'Media', 'Broadcasting', 'Content'], ARRAY['550e8400-e29b-41d4-a716-446655440001'], now() - interval '28 days'),
('550e8400-e29b-41d4-a716-446655440030', 'Community service day was rewarding! 🤝❤️', 'https://images.unsplash.com/photo-1559027615-cd3628902d4a?w=500', 'community_service.jpg', 'Community Center', ARRAY['Community', 'Service', 'Helping', 'Impact'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'], now() - interval '29 days');

-- =================================================================
-- STEP 6: INSERT STUDENT ORGANIZATIONS (10 orgs)
-- =================================================================

INSERT INTO public.student_organizations (
  id, name, description, category, membership_count, created_by_id, is_active, created_at
) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Computer Science Club', 'For CS students to collaborate and learn together', 'Academic', 15, '550e8400-e29b-41d4-a716-446655440001', true, now()),
('750e8400-e29b-41d4-a716-446655440002', 'Entrepreneurship Society', 'Supporting student startups and business ideas', 'Business', 20, '550e8400-e29b-41d4-a716-446655440010', true, now()),
('750e8400-e29b-41d4-a716-446655440003', 'Environmental Club', 'Promoting sustainability and green initiatives', 'Environmental', 18, '550e8400-e29b-41d4-a716-446655440026', true, now()),
('750e8400-e29b-41d4-a716-446655440004', 'Arts and Culture Society', 'Celebrating diverse artistic expressions', 'Arts', 12, '550e8400-e29b-41d4-a716-446655440023', true, now()),
('750e8400-e29b-41d4-a716-446655440005', 'Debate and Discussion Club', 'Enhancing critical thinking through structured debate', 'Academic', 14, '550e8400-e29b-41d4-a716-446655440019', true, now()),
('750e8400-e29b-41d4-a716-446655440006', 'Volunteers for Change', 'Community service and social activism', 'Service', 25, '550e8400-e29b-41d4-a716-446655440030', true, now()),
('750e8400-e29b-41d4-a716-446655440007', 'Robotics Club', 'Building and competing with robotic projects', 'Engineering', 16, '550e8400-e29b-41d4-a716-446655440006', true, now()),
('750e8400-e29b-41d4-a716-446655440008', 'Finance and Investment Club', 'Teaching finance principles and investment strategies', 'Business', 17, '550e8400-e29b-41d4-a716-446655440012', true, now()),
('750e8400-e29b-41d4-a716-446655440009', 'Music and Performance', 'Showcasing musical talent and collaborative performances', 'Arts', 10, '550e8400-e29b-41d4-a716-446655440024', true, now()),
('750e8400-e29b-41d4-a716-446655440010', 'Health and Wellness Initiative', 'Promoting physical and mental health', 'Health', 22, '550e8400-e29b-41d4-a716-446655440027', true, now());

-- =================================================================
-- STEP 7: INSERT ORGANIZATION MEMBERS
-- =================================================================

INSERT INTO public.organization_members (
  organization_id, user_id, role, joined_at
) VALUES
-- CS Club members
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'president', now()),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member', now()),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member', now()),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440043', 'member', now()),

-- Entrepreneurship Society members
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'president', now()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'member', now()),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440013', 'member', now()),

-- Environmental Club members
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440026', 'president', now()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440039', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440040', 'member', now()),

-- Arts and Culture members
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440023', 'president', now()),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440044', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440072', 'member', now()),

-- Debate Club members
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440019', 'president', now()),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440032', 'member', now()),

-- Volunteers for Change members
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440030', 'president', now()),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440020', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440021', 'member', now()),

-- Robotics Club members
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 'president', now()),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440041', 'member', now()),

-- Finance Club members
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440012', 'president', now()),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440031', 'member', now()),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440034', 'member', now()),

-- Music Club members
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440024', 'president', now()),
('750e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440025', 'member', now()),

-- Health and Wellness members
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440027', 'president', now()),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', 'officer', now()),
('750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', 'member', now());

-- =================================================================
-- STEP 8: INSERT ORGANIZATION EVENTS
-- =================================================================

INSERT INTO public.organization_events (
  id, organization_id, title, description, event_date, location, capacity, attendee_count, event_type, created_at
) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Monthly Tech Meetup', 'Discuss latest in web development', now() + interval '7 days', 'Tech Hall 101', 50, 0, 'meeting', now()),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Hackathon 2024', 'Build something amazing in 24 hours', now() + interval '14 days', 'Tech Center', 100, 0, 'workshop', now()),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'Startup Pitch Night', 'Student entrepreneurs pitch ideas', now() + interval '21 days', 'Business Building', 80, 0, 'social', now()),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 'Business Networking Breakfast', 'Connect with industry leaders', now() + interval '10 days', 'Campus Cafe', 60, 0, 'meeting', now()),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', 'Campus Clean-up Day', 'Make our campus greener', now() + interval '5 days', 'Campus Grounds', 150, 0, 'volunteer', now()),
('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440004', 'Art Exhibition Opening', 'Student artwork showcase', now() + interval '3 days', 'Arts Gallery', 100, 0, 'social', now()),
('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440005', 'Debate Tournament', 'Inter-university debate competition', now() + interval '28 days', 'Humanities', 200, 0, 'competition', now()),
('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440007', 'Robotics Competition', 'Showcase robotic innovations', now() + interval '35 days', 'Engineering Lab', 120, 0, 'competition', now()),
('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440008', 'Investment Simulation Game', 'Learn trading strategies', now() + interval '8 days', 'Business Building', 50, 0, 'workshop', now()),
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440009', 'Concert and Open Mic Night', 'Perform or just enjoy music', now() + interval '12 days', 'Concert Hall', 150, 0, 'social', now());

-- =================================================================
-- STEP 9: INSERT INTEREST GROUPS
-- =================================================================

INSERT INTO public.interest_groups (
  id, name, description, category, is_private, creator_id, member_count, created_at
) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'AI and Machine Learning Enthusiasts', 'Discuss latest AI trends and research', 'Technology', false, '550e8400-e29b-41d4-a716-446655440001', 12, now()),
('950e8400-e29b-41d4-a716-446655440002', 'Outdoor Adventures', 'Hiking, camping, and nature exploration', 'Lifestyle', false, '550e8400-e29b-41d4-a716-446655440027', 18, now()),
('950e8400-e29b-41d4-a716-446655440003', 'Book Club', 'Monthly book discussions', 'Culture', false, '550e8400-e29b-41d4-a716-446655440017', 15, now()),
('950e8400-e29b-41d4-a716-446655440004', 'Gaming Community', 'Video game discussions and tournaments', 'Gaming', false, '550e8400-e29b-41d4-a716-446655440042', 22, now()),
('950e8400-e29b-41d4-a716-446655440005', 'Photography Enthusiasts', 'Share and discuss photography', 'Arts', false, '550e8400-e29b-41d4-a716-446655440023', 10, now()),
('950e8400-e29b-41d4-a716-446655440006', 'Web Development Beginners', 'Learning web development together', 'Technology', false, '550e8400-e29b-41d4-a716-446655440048', 20, now()),
('950e8400-e29b-41d4-a716-446655440007', 'Cryptocurrency Investors', 'Discussing blockchain and crypto', 'Finance', false, '550e8400-e29b-41d4-a716-446655440058', 14, now()),
('950e8400-e29b-41d4-a716-446655440008', 'Mindfulness and Meditation', 'Mental wellness and inner peace', 'Wellness', false, '550e8400-e29b-41d4-a716-446655440022', 16, now()),
('950e8400-e29b-41d4-a716-446655440009', 'Entrepreneurship Mentors', 'Mentoring new entrepreneurs', 'Business', false, '550e8400-e29b-41d4-a716-446655440010', 8, now()),
('950e8400-e29b-41d4-a716-446655440010', 'Science Fiction Fans', 'Discuss sci-fi books, movies, and shows', 'Culture', false, '550e8400-e29b-41d4-a716-446655440043', 13, now());

-- =================================================================
-- STEP 10: INSERT INTEREST GROUP MEMBERS
-- =================================================================

INSERT INTO public.interest_group_members (group_id, user_id, joined_at, role) VALUES
-- AI Group
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440043', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440050', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', now(), 'member'),

-- Outdoor Adventures
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440027', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440026', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440047', now(), 'member'),

-- Book Club
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440017', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440029', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440066', now(), 'member'),

-- Gaming Community
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440042', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440041', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440057', now(), 'member'),

-- Photography
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440023', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440044', now(), 'member'),

-- Web Dev Beginners
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440048', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440073', now(), 'member'),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440074', now(), 'member'),

-- Crypto Investors
('950e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440058', now(), 'creator'),

-- Mindfulness
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440022', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440021', now(), 'member'),

-- Entrepreneurship Mentors
('950e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440010', now(), 'creator'),

-- Science Fiction Fans
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440043', now(), 'creator'),
('950e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440025', now(), 'member');

-- =================================================================
-- STEP 11: INSERT STUDY GROUPS (8 study groups)
-- =================================================================

INSERT INTO public.study_groups (
  id, name, description, creator_id, course_id, location, meeting_time, max_members, is_active, created_at
) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'CS201 Study Group', 'Data Structures and Algorithms', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Library 3rd Floor', now() + interval '1 day 18:00:00', 6, true, now()),
('a50e8400-e29b-41d4-a716-446655440002', 'Calculus Study Group', 'Math 201 collaboration', '550e8400-e29b-41d4-a716-446655440037', '650e8400-e29b-41d4-a716-446655440004', 'Math Building Study Room', now() + interval '2 days 19:00:00', 8, true, now()),
('a50e8400-e29b-41d4-a716-446655440003', 'Chemistry Lab Prep', 'Preparing for CHEM101 exams', '550e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440006', 'Science Hall Lab', now() + interval '3 days 17:00:00', 5, true, now()),
('a50e8400-e29b-41d4-a716-446655440004', 'Biology Study Circle', 'BIO101 exam preparation', '550e8400-e29b-41d4-a716-446655440020', '650e8400-e29b-41d4-a716-446655440007', 'Science Hall Conference', now() + interval '4 days 18:30:00', 7, true, now()),
('a50e8400-e29b-41d4-a716-446655440005', 'Economics Study Buddies', 'ECON101 discussion group', '550e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440008', 'Business Building Lounge', now() + interval '5 days 16:00:00', 6, true, now()),
('a50e8400-e29b-41d4-a716-446655440006', 'English Essay Workshop', 'Writing help for ENG101', '550e8400-e29b-41d4-a716-446655440017', '650e8400-e29b-41d4-a716-446655440009', 'Arts Building Study Area', now() + interval '6 days 15:00:00', 8, true, now()),
('a50e8400-e29b-41d4-a716-446655440007', 'History Document Analysis', 'HIST101 research group', '550e8400-e29b-41d4-a716-446655440018', '650e8400-e29b-41d4-a716-446655440011', 'Library Archives', now() + interval '7 days 17:30:00', 5, true, now()),
('a50e8400-e29b-41d4-a716-446655440008', 'Psychology Case Study Group', 'PSY101 collaboration', '550e8400-e29b-41d4-a716-446655440022', '650e8400-e29b-41d4-a716-446655440010', 'Social Sciences Building', now() + interval '8 days 18:00:00', 7, true, now());

-- =================================================================
-- STEP 12: INSERT STUDY GROUP MEMBERS
-- =================================================================

INSERT INTO public.study_group_members (group_id, user_id, joined_at, role) VALUES
-- CS201 Study Group
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', now(), 'member'),

-- Calculus Study Group
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440037', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440038', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440031', now(), 'member'),

-- Chemistry Lab Prep
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440015', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', now(), 'member'),

-- Biology Study Circle
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440020', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440014', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440026', now(), 'member'),

-- Economics Study
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440012', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440034', now(), 'member'),

-- English Essay
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440017', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440029', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440066', now(), 'member'),

-- History
('a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440018', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440032', now(), 'member'),

-- Psychology
('a50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440022', now(), 'organizer'),
('a50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440021', now(), 'member'),
('a50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440027', now(), 'member');

-- =================================================================
-- STEP 13: INSERT SKILLS (25 skills)
-- =================================================================

INSERT INTO public.skills (id, name, category, created_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Python', 'Programming', now()),
('b50e8400-e29b-41d4-a716-446655440002', 'JavaScript', 'Programming', now()),
('b50e8400-e29b-41d4-a716-446655440003', 'Java', 'Programming', now()),
('b50e8400-e29b-41d4-a716-446655440004', 'React', 'Web Development', now()),
('b50e8400-e29b-41d4-a716-446655440005', 'Node.js', 'Backend', now()),
('b50e8400-e29b-41d4-a716-446655440006', 'SQL', 'Database', now()),
('b50e8400-e29b-41d4-a716-446655440007', 'Machine Learning', 'AI/ML', now()),
('b50e8400-e29b-41d4-a716-446655440008', 'Data Analysis', 'Analytics', now()),
('b50e8400-e29b-41d4-a716-446655440009', 'Project Management', 'Management', now()),
('b50e8400-e29b-41d4-a716-446655440010', 'Leadership', 'Soft Skills', now()),
('b50e8400-e29b-41d4-a716-446655440011', 'Communication', 'Soft Skills', now()),
('b50e8400-e29b-41d4-a716-446655440012', 'Problem Solving', 'Soft Skills', now()),
('b50e8400-e29b-41d4-a716-446655440013', 'Team Collaboration', 'Soft Skills', now()),
('b50e8400-e29b-41d4-a716-446655440014', 'UI/UX Design', 'Design', now()),
('b50e8400-e29b-41d4-a716-446655440015', 'Graphic Design', 'Design', now()),
('b50e8400-e29b-41d4-a716-446655440016', 'Cloud Computing', 'Infrastructure', now()),
('b50e8400-e29b-41d4-a716-446655440017', 'DevOps', 'Infrastructure', now()),
('b50e8400-e29b-41d4-a716-446655440018', 'Cybersecurity', 'Security', now()),
('b50e8400-e29b-41d4-a716-446655440019', 'Technical Writing', 'Writing', now()),
('b50e8400-e29b-41d4-a716-446655440020', 'Entrepreneurship', 'Business', now()),
('b50e8400-e29b-41d4-a716-446655440021', 'Financial Analysis', 'Business', now()),
('b50e8400-e29b-41d4-a716-446655440022', 'Marketing', 'Business', now()),
('b50e8400-e29b-41d4-a716-446655440023', 'Robotics', 'Engineering', now()),
('b50e8400-e29b-41d4-a716-446655440024', 'CAD Design', 'Engineering', now()),
('b50e8400-e29b-41d4-a716-446655440025', 'Research', 'Academic', now());

-- =================================================================
-- STEP 14: INSERT USER SKILLS (assign skills to users)
-- =================================================================

INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, endorsements, created_at) VALUES
-- Emma Chen (AI student)
('550e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', 'advanced', 5, now()),
('550e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440007', 'advanced', 8, now()),
('550e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440008', 'intermediate', 3, now()),

-- James Park (Web developer)
('550e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', 'advanced', 7, now()),
('550e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440004', 'advanced', 6, now()),
('550e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440005', 'intermediate', 4, now()),

-- Sarah Williams (Data scientist)
('550e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440001', 'advanced', 4, now()),
('550e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440008', 'advanced', 7, now()),
('550e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440006', 'intermediate', 5, now()),

-- Michael Johnson (Backend)
('550e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440003', 'advanced', 6, now()),
('550e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440005', 'advanced', 5, now()),
('550e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440006', 'advanced', 4, now()),

-- Lisa Rodriguez (Cybersecurity)
('550e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440018', 'advanced', 9, now()),
('550e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440001', 'intermediate', 3, now()),

-- David Kumar (Robotics)
('550e8400-e29b-41d4-a716-446655440006', 'b50e8400-e29b-41d4-a716-446655440023', 'advanced', 7, now()),
('550e8400-e29b-41d4-a716-446655440006', 'b50e8400-e29b-41d4-a716-446655440024', 'advanced', 5, now()),

-- Olivia Smith (IoT)
('550e8400-e29b-41d4-a716-446655440007', 'b50e8400-e29b-41d4-a716-446655440001', 'intermediate', 2, now()),
('550e8400-e29b-41d4-a716-446655440007', 'b50e8400-e29b-41d4-a716-446655440023', 'intermediate', 3, now()),

-- Ryan Torres (Entrepreneurship)
('550e8400-e29b-41d4-a716-446655440010', 'b50e8400-e29b-41d4-a716-446655440020', 'intermediate', 4, now()),
('550e8400-e29b-41d4-a716-446655440010', 'b50e8400-e29b-41d4-a716-446655440010', 'intermediate', 3, now()),

-- Rachel Green (Marketing)
('550e8400-e29b-41d4-a716-446655440011', 'b50e8400-e29b-41d4-a716-446655440022', 'advanced', 6, now()),
('550e8400-e29b-41d4-a716-446655440011', 'b50e8400-e29b-41d4-a716-446655440011', 'advanced', 5, now()),

-- Kevin Lee (Finance)
('550e8400-e29b-41d4-a716-446655440012', 'b50e8400-e29b-41d4-a716-446655440021', 'advanced', 8, now()),
('550e8400-e29b-41d4-a716-446655440012', 'b50e8400-e29b-41d4-a716-446655440008', 'intermediate', 4, now()),

-- Jackson Wilson (Math tutor)
('550e8400-e29b-41d4-a716-446655440037', 'b50e8400-e29b-41d4-a716-446655440012', 'advanced', 6, now()),
('550e8400-e29b-41d4-a716-446655440037', 'b50e8400-e29b-41d4-a716-446655440011', 'intermediate', 4, now()),

-- Benjamin Wilson (Mobile dev)
('550e8400-e29b-41d4-a716-446655440047', 'b50e8400-e29b-41d4-a716-446655440002', 'advanced', 5, now()),
('550e8400-e29b-41d4-a716-446655440047', 'b50e8400-e29b-41d4-a716-446655440004', 'intermediate', 3, now()),

-- Amy Garcia (UI/UX)
('550e8400-e29b-41d4-a716-446655440072', 'b50e8400-e29b-41d4-a716-446655440014', 'advanced', 6, now()),
('550e8400-e29b-41d4-a716-446655440072', 'b50e8400-e29b-41d4-a716-446655440015', 'intermediate', 3, now());

-- =================================================================
-- FINAL: Display summary of seeded data
-- =================================================================

SELECT 
  'Users' as entity, COUNT(*) as count 
FROM public.users
UNION ALL
SELECT 'Courses', COUNT(*) FROM public.courses
UNION ALL
SELECT 'Posts', COUNT(*) FROM public.posts
UNION ALL
SELECT 'Study Groups', COUNT(*) FROM public.study_groups
UNION ALL
SELECT 'Organizations', COUNT(*) FROM public.student_organizations
UNION ALL
SELECT 'Interest Groups', COUNT(*) FROM public.interest_groups
UNION ALL
SELECT 'Skills', COUNT(*) FROM public.skills
UNION ALL
SELECT 'Organization Events', COUNT(*) FROM public.organization_events;

-- =================================================================
-- SUCCESS! Seed script completed
-- =================================================================
-- Your database now has:
-- ✓ 80 realistic student users with profiles and interests
-- ✓ 15 courses with enrollments (3-5 students per course)
-- ✓ 30 engaging posts with likes and realistic content
-- ✓ 10 student organizations with members and events
-- ✓ 10 interest groups with varied topics
-- ✓ 8 active study groups for collaborative learning
-- ✓ 25 skills with user endorsements
-- ✓ Sample image URLs from Unsplash
-- ✓ Proper relationships between all entities
-- ✓ Realistic timestamps and data
-- =================================================================
