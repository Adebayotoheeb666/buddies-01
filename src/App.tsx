import { Routes, Route } from "react-router-dom";

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
  EnhancedProfile,
  Courses,
  CourseDetail,
  CourseScheduleView,
  ClassmateFinder,
  CourseCommunity,
  StudyGroups,
  StudyGroupDetail,
  Assignments,
  AssignmentDetail,
  GroupProjectBoard,
  QAForum,
  NoteLibrary,
  ProjectListings,
  TutoringBrowser,
  ResourceLibrary,
  QuestionDetail,
  CampusMap,
  DiningServices,
  LibraryServices,
  FacilitiesBooking,
  ClubDirectory,
  ClubDetail,
  InterestGroups,
  CampusPolls,
  MemeBoard,
  AnonymousConfessions,
  NetworkDiscovery,
  JobBoard,
  AlumniNetwork,
  ResearchStartups,
  Safety,
  Wellness,
  ModerationDashboard,
  Achievements,
  Challenges,
  Leaderboard,
  AnalyticsDashboard,
  SemesterRecap,
  BucketList,
  PhotoContests,
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import EnhancedSignupForm from "@/_auth/forms/EnhancedSignupForm";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/sign-up-enhanced" element={<EnhancedSignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          {/* Social Features */}
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />

          {/* Phase 1 Academic Features - Profile */}
          <Route path="/my-profile" element={<EnhancedProfile />} />

          {/* Phase 1 Academic Features - Courses */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/course-schedule" element={<CourseScheduleView />} />
          <Route path="/classmates" element={<ClassmateFinder />} />
          <Route
            path="/course/:courseId/community"
            element={<CourseCommunity />}
          />

          {/* Phase 1 Academic Features - Study Groups */}
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/study-groups/:groupId" element={<StudyGroupDetail />} />

          {/* Phase 1 Academic Features - Assignments */}
          <Route path="/assignments" element={<Assignments />} />
          <Route
            path="/assignments/:assignmentId"
            element={<AssignmentDetail />}
          />
          <Route path="/group-projects" element={<GroupProjectBoard />} />

          {/* Phase 1 Academic Features - Q&A Forum */}
          <Route path="/qa-forum" element={<QAForum />} />
          <Route path="/qa-forum/:questionId" element={<QuestionDetail />} />

          {/* Phase 2 Academic Collaboration - Note Sharing */}
          <Route path="/notes" element={<NoteLibrary />} />

          {/* Phase 2 Academic Collaboration - Project Matching */}
          <Route path="/projects" element={<ProjectListings />} />

          {/* Phase 2 Academic Collaboration - Peer Tutoring */}
          <Route path="/tutoring" element={<TutoringBrowser />} />

          {/* Phase 2 Academic Collaboration - Resources */}
          <Route path="/resources" element={<ResourceLibrary />} />

          {/* Phase 3 Campus Life & Services */}
          <Route path="/campus-map" element={<CampusMap />} />
          <Route path="/dining" element={<DiningServices />} />
          <Route path="/library" element={<LibraryServices />} />
          <Route path="/facilities" element={<FacilitiesBooking />} />

          {/* Phase 4 Social Networking - Clubs & Organizations */}
          <Route path="/clubs" element={<ClubDirectory />} />
          <Route path="/clubs/:organizationId" element={<ClubDetail />} />

          {/* Phase 4 Social Networking - Interest Groups */}
          <Route path="/interest-groups" element={<InterestGroups />} />

          {/* Phase 4 Social Networking - Campus Polls */}
          <Route path="/polls" element={<CampusPolls />} />

          {/* Phase 4 Social Networking - Meme Board */}
          <Route path="/memes" element={<MemeBoard />} />

          {/* Phase 4 Social Networking - Anonymous Confessions */}
          <Route path="/confessions" element={<AnonymousConfessions />} />

          {/* Phase 4 Social Networking - Network Discovery */}
          <Route path="/network" element={<NetworkDiscovery />} />

          {/* Phase 5 Career Development & Professional Growth */}
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/alumni" element={<AlumniNetwork />} />
          <Route path="/research-startups" element={<ResearchStartups />} />

          {/* Phase 6 Safety, Wellness & Administrative Features */}
          <Route path="/safety" element={<Safety />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/moderation" element={<ModerationDashboard />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
