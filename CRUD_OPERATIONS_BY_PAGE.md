# Comprehensive CRUD Operations List by Page

## Overview
This document lists all CRUD operations (Create, Read, Update, Delete) for each of the 57 pages in the application.

**Legend:**
- 🟢 **READ** (R) - Fetch/Retrieve data
- 🟠 **CREATE** (C) - Add new data
- 🟡 **UPDATE** (U) - Modify existing data
- 🔴 **DELETE** (D) - Remove data

---

## 1. **Home** 
**Path:** `/src/_root/pages/Home.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Posts | 🟢 READ | Fetch recent posts (infinite pagination) |
| Users | 🟢 READ | Get top 10 creators/users |

**Query Functions Used:** `useGetRecentPosts()`, `useGetUsers(10)`

---

## 2. **Explore**
**Path:** `/src/_root/pages/Explore.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Posts | 🟢 READ | Get all posts with infinite pagination |
| Posts | 🟢 READ | Search posts by keyword |

**Query Functions Used:** `useGetPosts()`, `useSearchPosts(searchTerm)`

---

## 3. **Create Post**
**Path:** `/src/_root/pages/CreatePost.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Posts | 🟠 CREATE | Create new post with content and media |

**Query Functions Used:** `useCreatePost()`

---

## 4. **Edit Post**
**Path:** `/src/_root/pages/EditPost.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Posts | 🟢 READ | Fetch post by ID |
| Posts | 🟡 UPDATE | Update post content/media |

**Query Functions Used:** `useGetPostById(id)`, `useUpdatePost()`

---

## 5. **Post Details**
**Path:** `/src/_root/pages/PostDetails.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Posts | 🟢 READ | Get full post details |
| Users | 🟢 READ | Fetch post creator info |
| Posts | 🟡 UPDATE | Like/unlike post |
| Posts | 🔴 DELETE | Delete post |

**Query Functions Used:** `useGetPostById(id)`, `useDeletePost()`, `useLikePost()`

---

## 6. **Liked Posts**
**Path:** `/src/_root/pages/LikedPosts.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get current user |
| Posts | 🟢 READ | Display user's liked posts |

**Query Functions Used:** `useGetCurrentUser()`

---

## 7. **Saved Posts**
**Path:** `/src/_root/pages/Saved.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get current user |
| Posts | 🟢 READ | Display saved/bookmarked posts |
| Posts | 🔴 DELETE | Remove post from saved |

**Query Functions Used:** `useGetCurrentUser()`, `useDeleteSavedPost()`

---

## 8. **All Users**
**Path:** `/src/_root/pages/AllUsers.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Fetch all users (creators) |

**Query Functions Used:** `useGetUsers()`

---

## 9. **Profile**
**Path:** `/src/_root/pages/Profile.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get user by ID |
| Posts | 🟢 READ | Fetch user's posts |
| Followers | 🟢 READ | Get follower/following counts |

**Query Functions Used:** `useGetUserById(id)`, `useGetUserPosts(userId)`

---

## 10. **Update Profile**
**Path:** `/src/_root/pages/UpdateProfile.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Fetch current user data |
| Users | 🟡 UPDATE | Update name, bio, avatar, email |

**Query Functions Used:** `useGetUserById(id)`, `useUpdateUser()`

---

## 11. **Enhanced Profile**
**Path:** `/src/_root/pages/EnhancedProfile.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get user profile data |
| Courses | 🟢 READ | Fetch enrolled courses |
| Skills | 🟢 READ | Get user skills |

**Query Functions Used:** `useGetUserById(id)`, `useGetUserCourses(userId)`, `useGetUserSkills(userId)`

---

## 12. **Chats (Messages)**
**Path:** `/src/_root/pages/Chats.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Private Chats | 🟢 READ | Fetch all private chats |
| Group Chats | 🟢 READ | Fetch all group chats |
| Group Chats | 🟠 CREATE | Create new group chat |
| Messages | 🟢 READ | View chat/group messages |

**Query Functions Used:** `useGetPrivateChats()`, `useGetGroupChats()`

---

## 13. **Courses**
**Path:** `/src/_root/pages/Courses.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Courses | 🟢 READ | Fetch all available courses |
| Enrollments | 🟠 CREATE | Enroll in course |

**Query Functions Used:** `useGetCourses()`

---

## 14. **Course Detail**
**Path:** `/src/_root/pages/CourseDetail.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Courses | 🟢 READ | Get course by ID |
| Assignments | 🟢 READ | Fetch course assignments |
| Enrollments | 🟠 CREATE | Enroll in course |

**Query Functions Used:** `useGetCourseById(courseId)`, `useGetCourseAssignments(courseId)`

---

## 15. **Course Community**
**Path:** `/src/_root/pages/CourseCommunity.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Courses | 🟢 READ | Get course info |
| Assignments | 🟢 READ | Fetch course assignments |
| Notes | 🟢 READ | Get shared notes for course |
| Posts | 🟢 READ | Display course discussions |

**Query Functions Used:** `useGetCourseById(courseId)`, `useGetCourseAssignments(courseId)`

---

## 16. **Course Schedule View**
**Path:** `/src/_root/pages/CourseScheduleView.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Courses | 🟢 READ | Fetch user's enrolled courses |

**Query Functions Used:** `useGetUserCourses(userId)`

---

## 17. **Classmate Finder**
**Path:** `/src/_root/pages/ClassmateFinder.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Courses | 🟢 READ | Get user's courses |
| Enrollments | 🟢 READ | Find classmates in selected course |
| Users | 🟢 READ | Display classmate profiles |

**Query Functions Used:** `useGetUserCourses(userId)`

---

## 18. **Study Groups**
**Path:** `/src/_root/pages/StudyGroups.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Study Groups | 🟢 READ | Fetch all study groups |
| Study Groups | 🟠 CREATE | Create new study group |

**Query Functions Used:** `useGetStudyGroups()`

---

## 19. **Study Group Detail**
**Path:** `/src/_root/pages/StudyGroupDetail.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Study Groups | 🟢 READ | Get group by ID |
| Users | 🟢 READ | Get group members |
| Study Groups | 🟡 UPDATE | Join/leave group |

**Query Functions Used:** `useGetStudyGroupById(groupId)`

---

## 20. **Assignments**
**Path:** `/src/_root/pages/Assignments.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Assignments | 🟢 READ | Fetch all assignments |

**Query Functions Used:** `useGetAssignments()`

---

## 21. **Assignment Detail**
**Path:** `/src/_root/pages/AssignmentDetail.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Assignments | 🟢 READ | Get assignment by ID |
| Assignments | 🟡 UPDATE | Submit assignment solution |
| Reminders | 🟠 CREATE | Set assignment reminder |

**Query Functions Used:** `useGetAssignmentById(assignmentId)`

---

## 22. **Q&A Forum**
**Path:** `/src/_root/pages/QAForum.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Q&A Questions | 🟢 READ | Fetch all questions |
| Q&A Questions | 🟠 CREATE | Post new question |

**Query Functions Used:** `useGetQAQuestions()`

---

## 23. **Question Detail**
**Path:** `/src/_root/pages/QuestionDetail.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Q&A Questions | 🟢 READ | Get question by ID |
| Q&A Answers | 🟢 READ | Fetch answers to question |
| Q&A Answers | 🟠 CREATE | Post new answer |
| Q&A Answers | 🟡 UPDATE | Mark answer as verified |

**Query Functions Used:** `useGetQuestionById(questionId)`

---

## 24. **Note Library**
**Path:** `/src/_root/pages/NoteLibrary.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Notes | 🟢 READ | Fetch shared notes |
| Notes | 🟠 CREATE | Upload/create new note |

---

## 25. **Project Listings**
**Path:** `/src/_root/pages/ProjectListings.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Projects | 🟢 READ | Fetch all project listings |
| Projects | 🟠 CREATE | Create project listing |
| Projects | 🟡 UPDATE | Update project (recruiting/completed) |

**Query Functions Used:** `useGetProjectListings()`

---

## 26. **Tutoring Browser**
**Path:** `/src/_root/pages/TutoringBrowser.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Tutoring Profiles | 🟢 READ | Fetch tutor profiles |
| Bookings | 🟠 CREATE | Schedule tutoring session |

**Query Functions Used:** `useGetTutoringProfiles()`

---

## 27. **Resource Library**
**Path:** `/src/_root/pages/ResourceLibrary.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Resources | 🟢 READ | Fetch educational resources |
| Resources | 🟠 CREATE | Upload new resource |

**Query Functions Used:** `useGetResources()`

---

## 28. **Campus Polls**
**Path:** `/src/_root/pages/CampusPolls.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Campus Polls | 🟢 READ | Fetch all polls |
| Poll Options | 🟢 READ | Get poll choices |
| Poll Votes | 🟠 CREATE | Vote on poll option |

**Query Functions Used:** `useGetCampusPolls()`, `useGetPollById(pollId)`

---

## 29. **Interest Groups**
**Path:** `/src/_root/pages/InterestGroups.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Interest Groups | 🟢 READ | Fetch all interest groups |
| Interest Groups | 🟠 CREATE | Create new interest group |
| Group Membership | 🟠 CREATE | Join interest group |

**Query Functions Used:** `useGetInterestGroups()`

---

## 30. **Meme Board**
**Path:** `/src/_root/pages/MemeBoard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Meme Posts | 🟢 READ | Fetch memes |
| Meme Posts | 🟠 CREATE | Post meme |
| Meme Posts | 🟡 UPDATE | Like/react to meme |

**Query Functions Used:** `useGetMemePosts()`

---

## 31. **Club Directory**
**Path:** `/src/_root/pages/ClubDirectory.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Student Organizations | 🟢 READ | Fetch all clubs/organizations |

**Query Functions Used:** `useGetStudentOrganizations()`

---

## 32. **Club Detail**
**Path:** `/src/_root/pages/ClubDetail.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Organizations | 🟢 READ | Get organization details |
| Organization Events | 🟢 READ | Fetch org events |
| Membership | 🟠 CREATE | Join club |

**Query Functions Used:** `useGetOrganizationById(orgId)`, `useGetOrganizationEvents(orgId)`

---

## 33. **Group Project Board**
**Path:** `/src/_root/pages/GroupProjectBoard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Assignments | 🟢 READ | Fetch group projects |
| Tasks | 🟠 CREATE | Create project task |
| Tasks | 🟡 UPDATE | Update task status |
| Tasks | 🔴 DELETE | Remove task |

**Query Functions Used:** `useGetAssignments()`

---

## 34. **Achievements**
**Path:** `/src/_root/pages/Achievements.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| User Achievements | 🟢 READ | Fetch user badges/achievements |
| Achievements | 🟠 CREATE | Award achievement |

---

## 35. **Leaderboard**
**Path:** `/src/_root/pages/Leaderboard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get ranked users by points/activities |
| Rankings | 🟢 READ | Display leaderboard stats |

---

## 36. **Challenges**
**Path:** `/src/_root/pages/Challenges.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Challenges | 🟢 READ | Fetch available challenges |
| Challenge Submissions | 🟠 CREATE | Submit challenge solution |
| Challenge Submissions | 🟡 UPDATE | Update submission |

---

## 37. **Admin Metrics**
**Path:** `/src/_root/pages/AdminMetrics.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Get user statistics |
| Posts | 🟢 READ | Get post statistics |
| Courses | 🟢 READ | Get course enrollment stats |
| Reports | 🟢 READ | View system analytics |

---

## 38. **Moderation Dashboard**
**Path:** `/src/_root/pages/ModerationDashboard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Flagged Content | 🟢 READ | Get reported posts/comments |
| Flagged Content | 🟡 UPDATE | Review and approve/reject content |
| Content | 🔴 DELETE | Remove inappropriate content |
| Users | 🔴 DELETE | Ban users |

---

## 39. **Analytics Dashboard**
**Path:** `/src/_root/pages/AnalyticsDashboard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Analytics | 🟢 READ | Fetch usage statistics |
| Analytics | 🟢 READ | Get user engagement metrics |
| Analytics | 🟢 READ | Display trends and charts |

---

## 40. **Safety Page**
**Path:** `/src/_root/pages/Safety.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Safety Reports | 🟢 READ | Get safety guidelines |
| Incident Reports | 🟠 CREATE | Report safety concern |

---

## 41. **Wellness**
**Path:** `/src/_root/pages/Wellness.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Wellness Resources | 🟢 READ | Fetch mental health resources |
| Wellness Events | 🟢 READ | Get wellness activities |
| Event Attendance | 🟠 CREATE | RSVP to wellness event |

---

## 42. **Dining Services**
**Path:** `/src/_root/pages/DiningServices.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Dining Locations | 🟢 READ | Get dining hall info |
| Menus | 🟢 READ | View daily menus |
| Hours | 🟢 READ | Display operating hours |

---

## 43. **Library Services**
**Path:** `/src/_root/pages/LibraryServices.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Library Info | 🟢 READ | Get library details |
| Book Catalog | 🟢 READ | Search books |
| Reservations | 🟠 CREATE | Reserve library resources |
| Reservations | 🔴 DELETE | Cancel reservation |

---

## 44. **Facilities Booking**
**Path:** `/src/_root/pages/FacilitiesBooking.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Facilities | 🟢 READ | Get available facilities |
| Bookings | 🟠 CREATE | Book room/facility |
| Bookings | 🔴 DELETE | Cancel booking |

---

## 45. **Campus Map**
**Path:** `/src/_root/pages/CampusMap.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Map Data | 🟢 READ | Display campus map |
| Locations | 🟢 READ | Show building locations |

---

## 46. **Job Board**
**Path:** `/src/_root/pages/JobBoard.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Job Listings | 🟢 READ | Fetch job postings |
| Job Listings | 🟠 CREATE | Post job opening |
| Applications | 🟠 CREATE | Apply for job |

---

## 47. **Photo Contests**
**Path:** `/src/_root/pages/PhotoContests.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Contests | 🟢 READ | Fetch photo contests |
| Submissions | 🟠 CREATE | Submit photo entry |
| Votes | 🟠 CREATE | Vote on submissions |

---

## 48. **Alumni Network**
**Path:** `/src/_root/pages/AlumniNetwork.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Alumni Users | 🟢 READ | Get graduated users |
| Alumni Profiles | 🟢 READ | View alumni info |
| Alumni Events | ��� READ | Get alumni gatherings |

---

## 49. **Network Discovery**
**Path:** `/src/_root/pages/NetworkDiscovery.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Users | 🟢 READ | Discover people to connect with |
| Connections | 🟠 CREATE | Follow/connect with users |
| Connections | 🔴 DELETE | Unfollow users |

**Query Functions Used:** `useGetUserFollowing(userId)`, `useGetUserFollowers(userId)`

---

## 50. **Research Startups**
**Path:** `/src/_root/pages/ResearchStartups.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Startup Projects | 🟢 READ | Fetch startup listings |
| Startup Projects | 🟠 CREATE | Create startup project |
| Team Membership | 🟠 CREATE | Join startup |

---

## 51. **Bucket List**
**Path:** `/src/_root/pages/BucketList.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Bucket List Items | 🟢 READ | Get user's bucket list |
| Bucket List Items | 🟠 CREATE | Add item to bucket list |
| Bucket List Items | 🟡 UPDATE | Mark item as completed |
| Bucket List Items | 🔴 DELETE | Remove item |

---

## 52. **Semester Recap**
**Path:** `/src/_root/pages/SemesterRecap.tsx`

| Entity | Operations | Details |
|--------|-----------|---------|
| Semester Data | 🟢 READ | Get semester statistics |
| Achievements | 🟢 READ | View semester accomplishments |
| Reports | 🟢 READ | Generate semester summary |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Pages** | 57 |
| **Pages with CREATE** | ~40 |
| **Pages with READ** | ~55 |
| **Pages with UPDATE** | ~25 |
| **Pages with DELETE** | ~15 |

---

## Entity-Based CRUD Count

| Entity | CREATE | READ | UPDATE | DELETE |
|--------|--------|------|--------|--------|
| **Posts** | ✓ | ✓ | ✓ | ✓ |
| **Users** | ✓ | ✓ | ✓ | ✗ |
| **Courses** | ✗ | ✓ | ✗ | ✗ |
| **Study Groups** | ✓ | ✓ | ✓ | ✗ |
| **Assignments** | ✗ | ✓ | ✓ | ✗ |
| **Q&A Questions** | ✓ | ✓ | ✓ | ✗ |
| **Q&A Answers** | ✓ | ✓ | ✓ | ✗ |
| **Chats** | ✓ | ✓ | ✓ | ✗ |
| **Interest Groups** | ✓ | ✓ | ✓ | ✗ |
| **Projects** | ✓ | ✓ | ✓ | ✓ |
| **Tasks** | ✓ | ✓ | ✓ | ✓ |
| **Polls** | ✓ | ✓ | ✗ | ✗ |
| **Memes** | ✓ | ✓ | ✓ | ✓ |
| **Organizations** | ✗ | ✓ | ✓ | ✗ |
| **Bookings** | ✓ | ✓ | ✗ | ✓ |
| **Connections** | ✓ | ✓ | ✗ | ✓ |
| **Resources** | ✓ | ✓ | ✓ | ✗ |
| **Notes** | ✓ | ✓ | ✓ | ✗ |
| **Tutoring Profiles** | ✗ | ✓ | ✓ | ✗ |
| **Achievements** | ✓ | ✓ | ✗ | ✗ |

---

## Query Hook Dependency Map

### Core/Post Queries
- `useGetPosts()` - Home, Explore, LikedPosts, Saved
- `useGetPostById()` - PostDetails, EditPost
- `useGetRecentPosts()` - Home
- `useSearchPosts()` - Explore
- `useCreatePost()` - CreatePost
- `useUpdatePost()` - EditPost
- `useDeletePost()` - PostDetails
- `useLikePost()` - PostCard, PostDetails
- `useSavePost()` / `useDeleteSavedPost()` - Saved

### User Queries
- `useGetCurrentUser()` - Saved, LikedPosts, Chats
- `useGetUsers()` - AllUsers, Home
- `useGetUserById()` - Profile, UpdateProfile, EnhancedProfile
- `useUpdateUser()` - UpdateProfile
- `useGetUserFollowing()` / `useGetUserFollowers()` - Profile, NetworkDiscovery

### Academic Queries
- `useGetCourses()` - Courses
- `useGetCourseById()` - CourseDetail, CourseCommunity
- `useGetUserCourses()` - CourseScheduleView, ClassmateFinder, EnhancedProfile
- `useGetStudyGroups()` - StudyGroups
- `useGetStudyGroupById()` - StudyGroupDetail
- `useGetAssignments()` - Assignments, GroupProjectBoard
- `useGetAssignmentById()` - AssignmentDetail
- `useGetCourseAssignments()` - CourseCommunity, CourseDetail
- `useGetSharedNotes()` - NoteLibrary, CourseCommunity
- `useGetQAQuestions()` - QAForum
- `useGetQuestionById()` - QuestionDetail
- `useGetSkills()` / `useGetUserSkills()` - EnhancedProfile
- `useGetProjectListings()` - ProjectListings
- `useGetTutoringProfiles()` - TutoringBrowser
- `useGetResources()` - ResourceLibrary

### Social/Community Queries
- `useGetCampusPolls()` - CampusPolls
- `useGetPollById()` - CampusPolls
- `useGetMemePosts()` - MemeBoard
- `useGetInterestGroups()` - InterestGroups
- `useGetInterestGroupById()` - InterestGroups
- `useGetStudentOrganizations()` - ClubDirectory
- `useGetOrganizationById()` - ClubDetail
- `useGetOrganizationEvents()` - ClubDetail

### Chat Queries
- `useGetPrivateChats()` - Chats
- `useGetGroupChats()` - Chats

---

## Notes on Missing Implementations

Some queries show commented-out or unimplemented code:
- `useGetClassYearGroups()` - Returns empty (not implemented)
- `useGetDepartmentNetworks()` - Returns empty (not implemented)
- `useGetOrganizationById()` - Returns empty Promise (not implemented)
- `useGetOrganizationEvents()` - Returns empty documents (partially implemented)

These should be implemented in the API layer if full functionality is needed.
