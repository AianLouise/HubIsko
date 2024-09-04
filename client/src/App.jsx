import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CompleteOrReturnHome from "./pages/CompleteOrReturnHome";
import Register from "./pages/Register";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ProviderPrivateRoute from "./components/ProviderPrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import VerifyYourEmail from "./components/VerifyYourEmail";
import ScholarshipListing from "./pages/ScholarshipListing";
import ForgotPassword from "./components/ForgotPassword";
import CompleteProfile from "./pages/CompleteProfile";
import ResetPassword from "./components/ResetPassword";

import ProviderDashboard from "./pages/Scholarship-Provider/ProviderDashboard";
import ProviderForums from "./pages/Scholarship-Provider/ProviderForums";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ScholarDashboard from "./pages/ScholarDashboard";
import RegisterAsProvider from "./pages/RegisterAsProvider";
import CompleteProfileConfirmation from "./pages/CompleteProfileConfirmation";
import AccountManagement from "./pages/AccountManagement";
import PasswordAndSecurity from "./pages/PasswordAndSecurity";
import ChangePassword from "./components/ChangePassword";
import Forums from "./pages/Forums";
import ApplicationDetails from "./pages/ApplicationDetails";
// import OthersProfile from "./pages/Dump/OthersProfile";
import ForumPost from "./pages/ForumPost";
import ApplyingStages from "./pages/ApplyingStages";
import ApplicationBox from "./pages/ApplicationBox";
import InboxedApplicationDetail from "./pages/InboxedApplicationDetail";
import StudentInfo from "./pages/StudentInfo";
import Scholarships from "./pages/Scholarship-Provider/scholarships";
import ScholarApplications from "./pages/Scholarship-Provider/ScholarApplications";
import ProviderForumDetail from "./pages/Scholarship-Provider/ProviderForumDetail";
import PostScholarship from "./pages/Scholarship-Provider/PostScholarship2";
import ForumCreatePost from "./pages/ForumCreatePost";
import Accounts from "./pages/Admin/Accounts";
import Students from "./pages/Admin/StudentsAccount";
import ProviderAccounts from "./pages/Admin/ProviderAccounts";
import VerificationDetails from "./pages/Admin/VerificationDetails";
import StudentDetails from "./pages/Admin/StudentDetails";
import ProviderDetails from "./pages/Admin/ProviderDetails";
import ApplicationInbox from "./pages/Admin/ApplicationInbox";
import ViewScholarshipDetails from "./pages/Scholarship-Provider/ViewScholarshipDetails";
import InboxApplication from "./pages/Admin/InboxApplication";
import ViewApplicationDetails from "./pages/Scholarship-Provider/ViewApplicationDetails";
import EditProgramPage from "./pages/Scholarship-Provider/EditProgramPage";
import EditStudentInfo from "./pages/Admin/EditStudentInfo";
import ApplicationForm from "./pages/ApplicationForm";
import ResubmitApplication from "./pages/ResubmitApplication";
import Settings from "./pages/Scholarship-Provider/Settings";
import ProviderProfile from "./pages/Scholarship-Provider/Profile";
import ApplicantAllNotification from "./pages/ApplicantAllNotification";
import ApplicantDetailedNotification from "./pages/ApplicantDetailedNotification";
import ScholarshipProviderApplications from "./pages/Admin/ScholarshipProviderApplications";
import ScholarshipProgramApplications from "./pages/Admin/ScholarshipProgramApplications";
import ScholarshipProviderDetails from "./pages/Admin/ScholarshipProviderDetails";
import ProviderCreateForumPost from "./pages/Scholarship-Provider/ProviderCreateForumPost";
import AdminForums from "./pages/Admin/AdminForums";
import AdminForumDetail from "./pages/Admin/AdminForumDetail";
import AdminCreateForumPost from "./pages/Admin/AdminCreateForumPost";
import AdminSettings from "./pages/Admin/AdminSettings";
import ScholarshipDashboardDetails from "./pages/ScholarshipDashboardDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ScholarshipProgramDetails from "./pages/Admin/ScholarshipProgramApplicationDetails";
import ScholarshipPrograms from "./pages/Admin/ScholarshipPrograms";
import Profiles from "./pages/Profiles";
import PasswordAndSecurity2 from "./pages/PasswordAndSecurity2";
// import NotificationsPage from "./components/notification";
// import NotificationDetailPage from "./components/NotificationDetailPage";
// import PreviewProfile from "./pages/Scholarship-Provider/PreviewProfile";
// import ProfilePreview from "./pages/Dump/ProfilePreview";
// import PostDetails from "./pages/Dump/PostDetails";
import Layout from "./components/Layout";
import PublicRoute from "./components/PublicRoute";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/apply-as-provider" element={<PublicRoute><RegisterAsProvider /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        <Route path="/verify-your-email" element={<PublicRoute><VerifyYourEmail /></PublicRoute>} />
        <Route path="/resend-verification-email" element={<PublicRoute><VerifyYourEmail /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/scholarship-listing" element={<ScholarshipListing />} />

        <Route path="/forums" element={<Forums />} />
        <Route path="/forums/create-post" element={<ForumCreatePost />} />
        <Route path="/forums/post/:postId" element={<ForumPost />} />

        <Route path="/scholarship-details/:id" element={<ApplicationDetails />} />
        <Route path="/application-form" element={<ApplicationForm />} />

        <Route path="/scholarship-dashboard-details/:id" element={<ScholarshipDashboardDetails />} />

        <Route path="/profile/:id" element={<Profiles />} />

        {/* <Route path="/others-profile/:id" element={<OthersProfile />} /> */}
        {/* Admin Routes */}
        {/* <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notifications/:notificationId" element={<NotificationDetailPage />} /> */}

        <Route element={<ProviderPrivateRoute allowedRoles={['admin']} />}>
        <Route element={<Layout />} path="/">
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-settings" element={<AdminSettings />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="students" element={<Students />} />
          <Route path="scholarship-provider" element={<ProviderAccounts />} />
          <Route path="verification-details/:id" element={<VerificationDetails />} />
          <Route path="student-details/:id" element={<StudentDetails />} />
          <Route path="provider-details/:id" element={<ProviderDetails />} />
          <Route path="application-inbox" element={<ApplicationInbox />} />
          <Route path="scholarship-program-applications" element={<ScholarshipProgramApplications />} />
          <Route path="scholarship-provider-applications" element={<ScholarshipProviderApplications />} />
          <Route path="scholarship-provider-details/:id" element={<ScholarshipProviderDetails />} />
          <Route path="inbox-application" element={<InboxApplication />} />
          <Route path="edit-student-info/:id" element={<EditStudentInfo />} />

            <Route path="scholarship-program-applications/:id" element={<ScholarshipProgramDetails />} />
            <Route path="scholarship-programs" element={<ScholarshipPrograms />} />

            <Route path="admin-forums" element={<AdminForums />} />
            <Route path="admin-forums/post/:postId" element={<AdminForumDetail />} />
            <Route path="admin-create-forum-post" element={<AdminCreateForumPost />} />
          </Route>
          {/* Add other routes here */}
        </Route>

        {/* Provider Routes */}
        <Route element={<ProviderPrivateRoute allowedRoles={['scholarship_provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/post-scholarship" element={<PostScholarship />} />
          <Route path="/scholar-applications" element={<ScholarApplications />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/applications/:id" element={<ViewApplicationDetails />} />
          <Route path="/view-scholarships/:id" element={<ViewScholarshipDetails />} />
          <Route path="/edit-program/:id" element={<EditProgramPage />} />
          <Route path="/provider-settings" element={<Settings />} />
          <Route path="/provider-profile" element={<ProviderProfile />} />

          <Route path="/provider-forums" element={<ProviderForums />} />
          <Route path="/provider-forums/post/:postId" element={<ProviderForumDetail />} />
          <Route path="/provider-create-forum-post" element={<ProviderCreateForumPost />} />
        </Route>

        {/* Scholar Routes */}
        <Route element={<PrivateRoute allowedRoles={['applicant']} />}>
          <Route path='/profile' element={<Profile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/complete-profile-confirmation" element={<CompleteProfileConfirmation />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/password-and-security" element={<PasswordAndSecurity2 />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/CoRH" element={<CompleteOrReturnHome />} />

          <Route path="/applying-stages/:scholarshipId" element={<ApplyingStages />} />
          <Route path="/application-box" element={<ApplicationBox />} />
          <Route path="/application-detail/:id" element={<InboxedApplicationDetail />} />
          <Route path="/resubmit-application/:id" element={<ResubmitApplication />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/notifications" element={<ApplicantAllNotification />} />
          <Route path="/notifications/:notificationId" element={<ApplicantDetailedNotification />} />
          {/* <Route path="/profile-preview/:id" element={<ProfilePreview />} /> */}
          {/* <Route path="/post-details" element={<PostDetails />} /> */}
          {/* <Route path="/preview-profile" element={<PreviewProfile />} /> */}
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

      </Routes>
    </BrowserRouter >
  )
}
