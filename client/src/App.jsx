import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import ProviderPrivateRoute from "./components/ProviderPrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import VerifyYourEmail from "./components/VerifyYourEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Applicant Routes
import Home from "./pages/Home";
import CompleteOrReturnHome from "./pages/CompleteOrReturnHome";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ScholarshipListing from "./pages/ScholarshipListing";
import CompleteProfile from "./pages/CompleteProfile";
import ScholarDashboard from "./pages/ScholarDashboard";
import RegisterAsProvider from "./pages/ProviderRegistration";
import CompleteProfileConfirmation from "./pages/CompleteProfileConfirmation";
import AccountManagement from "./pages/AccountManagement";
// import PasswordAndSecurity from "./pages/PasswordAndSecurity";
import ChangePassword from "./components/ChangePassword";
import Forums from "./pages/Forums";
import ApplicationDetails from "./pages/ApplicationDetails";
import ForumPost from "./pages/ForumPost";
// import ApplyingStages from "./pages/ApplyingStages";
import ApplicationBox from "./pages/ApplicationBox";
import InboxedApplicationDetail from "./pages/InboxedApplicationDetail";
import StudentInfo from "./pages/StudentInfo";
import ForumCreatePost from "./pages/ForumCreatePost";
import ApplicationForm from "./pages/ApplicationForm";
import ResubmitApplication from "./pages/ResubmitApplication";
import ApplicantAllNotification from "./pages/ApplicantAllNotification";
import ApplicantDetailedNotification from "./pages/ApplicantDetailedNotification";
import ScholarshipDashboardDetails from "./pages/ScholarshipDashboardDetails";
import Profiles from "./pages/Profiles";
import PasswordAndSecurity2 from "./pages/PasswordAndSecurity2";
import ScholarshipApplication from "./pages/ScholarshipApplicationForm";
import AnnouncementDetails from "./components/ViewScholarshipDetails/AnnouncementDetails";
import AnnouncementView from "./pages/AnnouncementView";
import AccountSettings from "./pages/AccountSettings";
import ApplicantProfilePage from "./pages/ApplicantProfilePage";

// Admin Routes
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminForums from "./pages/Admin/AdminForums";
import AdminForumsNew from "./pages/Admin/AdminForumsNew";
import AdminForumDetail from "./pages/Admin/AdminForumDetail";
import AdminCreateForumPost from "./pages/Admin/AdminCreateForumPost";
import AdminSettings from "./pages/Admin/AdminSettings";
import Accounts from "./pages/Admin/Accounts";
import Students from "./pages/Admin/StudentsAccount";
import ProviderAccounts from "./pages/Admin/ProviderAccounts";
import VerificationDetails from "./pages/Admin/VerificationDetails";
import StudentDetails from "./pages/Admin/StudentDetails";
import ProviderDetails from "./pages/Admin/ProviderDetails";
import ApplicationInbox from "./pages/Admin/ApplicationInbox";
import InboxApplication from "./pages/Admin/InboxApplication";
import EditStudentInfo from "./pages/Admin/EditStudentInfo";
import ScholarshipApplications from "./pages/Admin/ScholarshipApplications";
import ScholarshipProgramApplications from "./pages/Admin/ScholarshipProgramApplications";
import ScholarshipProviderDetails from "./pages/Admin/ScholarshipProviderDetails";
import ScholarshipProgramApplicationDetails from "./pages/Admin/ScholarshipProgramApplicationDetails";
import ScholarshipPrograms from "./pages/Admin/ScholarshipPrograms";
import ScholarshipProgramDetails from "./pages/Admin/ScholarshipProgramDetails";
import ScholarshipProviderApplications from "./pages/Admin/ScholarshipProviderApplications";
import ScholarshipsProviderDetails from "./pages/Admin/ScholarshipProviderDetails";
import StudentApplications from "./pages/Admin/StudentApplications";
import Layout from "./components/Layout";
import StudentApplicationDetails from "./pages/Admin/StudentApplicationDetails";
import AddAccount from "./pages/Admin/AddAccount";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";

// Scholarship Provider Routes
import ProviderDashboard from "./pages/Scholarship-Provider/ProviderDashboard";
import ProviderForums from "./pages/Scholarship-Provider/ProviderForums";
import Scholarships from "./pages/Scholarship-Provider/scholarships";
import ScholarApplications from "./pages/Scholarship-Provider/ScholarApplications";
import ProviderForumDetail from "./pages/Scholarship-Provider/ProviderForumDetail";
import PostScholarship from "./pages/Scholarship-Provider/PostScholarship2";
import ViewScholarshipDetails from "./pages/Scholarship-Provider/ViewScholarshipDetails";
import ViewApplicationDetails from "./pages/Scholarship-Provider/ViewApplicationDetails";
import Settings from "./pages/Scholarship-Provider/Settings";
import ProviderProfile from "./pages/Scholarship-Provider/ProviderProfile";
import ProviderCreateForumPost from "./pages/Scholarship-Provider/ProviderCreateForumPost";
import ScholarView from "./pages/Scholarship-Provider/ScholarView";
import ValidationPage from "./pages/Scholarship-Provider/ValidationPage";
import EditScholarshipDetails from "./components/ViewScholarshipDetails/EditScholarshipDetails";
import EditScholarshipWebView from "./components/ViewScholarshipDetails/EditScholarshipWebView";
import VerifyEmailUpdate from "./components/ProviderSettings/VerifyEmailUpdate";
import ValidationResult from "./components/ViewScholarshipDetails/ValidationResult";
import ProviderNotificationDetailPage from "./components/ProviderNotificationDetailPage";
import ProviderAllNotification from "./components/ProviderAllNotifications";
import ScholarshipProviderProfilePage from "./pages/Scholarship-Provider/ScholarshipProviderProfilePage";


// import RegisterAsProvider from "./pages/RegisterAsProvider";
// import OthersProfile from "./pages/Dump/OthersProfile";
// import NotificationsPage from "./components/notification";
// import NotificationDetailPage from "./components/NotificationDetailPage";
// import ProfilePreview from "./pages/Dump/ProfilePreview";
// import PostDetails from "./pages/Dump/PostDetails";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply-as-provider" element={<RegisterAsProvider />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-your-email" element={<VerifyYourEmail />} />
        <Route path="/resend-verification-email" element={<VerifyYourEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/scholarship-listing" element={<ScholarshipListing />} />

        <Route path="/forums" element={<Forums />} />
        <Route path="/forums/create-post" element={<ForumCreatePost />} />
        <Route path="/forums/post/:postId" element={<ForumPost />} />

        <Route path="/scholarship-details/:id" element={<ApplicationDetails />} />
        <Route path="/application-form" element={<ApplicationForm />} />

        <Route path="/scholarship-dashboard-details/:id" element={<ScholarshipDashboardDetails />} />

        <Route path="/profile/:id" element={<Profiles />} />

        <Route path="/scholarship-application/:scholarshipId" element={<ScholarshipApplication />} />

        <Route path="/verify-email-update" element={<VerifyEmailUpdate />} />


        <Route path="/applicant-profile/:id" element={<ApplicantProfilePage />} />
        <Route path="/scholarship-provider-profile/:id" element={<ScholarshipProviderProfilePage />} />
        <Route path="/admin-profile/:id" element={<AdminProfilePage />} />

        <Route path="/view-scholarships/:id/edit-program-details" element={<EditScholarshipDetails />} />
        <Route path="/view-scholarships/:id/scholarship-web-view" element={<EditScholarshipWebView />} />

        <Route path="/scholar-view/:id" element={<ScholarView />} />

        <Route path="/about" element={<About />} />

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
            <Route path="scholarship-applications" element={<ScholarshipApplications />} />
            <Route path="scholarship-provider-details/:id" element={<ScholarshipProviderDetails />} />
            <Route path="inbox-application" element={<InboxApplication />} />
            <Route path="edit-student-info/:id" element={<EditStudentInfo />} />

            <Route path="scholarship-program-applications/:id" element={<ScholarshipProgramApplicationDetails />} />
            <Route path="scholarship-programs" element={<ScholarshipPrograms />} />
            <Route path="scholarship-program/:id" element={<ScholarshipProgramDetails />} />

            <Route path="scholarship-provider-applications" element={<ScholarshipProviderApplications />} />
            <Route path="scholarship-provider-applications/:id" element={<ScholarshipsProviderDetails />} />

            <Route path="student-applications" element={<StudentApplications />} />
            <Route path="student-applications/:id" element={<StudentApplicationDetails />} />

            <Route path="admin-forums" element={<AdminForums />} />
            <Route path="admin-forums/new" element={<AdminForumsNew />} />
            <Route path="admin-forums/post/:postId" element={<AdminForumDetail />} />
            <Route path="admin-create-forum-post" element={<AdminCreateForumPost />} />

            <Route path="add-account" element={<AddAccount />} />

          </Route>
        </Route>

        {/* Provider Routes */}
        <Route element={<ProviderPrivateRoute allowedRoles={['scholarship_provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/post-scholarship" element={<PostScholarship />} />
          <Route path="/scholar-applications" element={<ScholarApplications />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/applications/:id" element={<ViewApplicationDetails />} />
          <Route path="/view-scholarships/:id" element={<ViewScholarshipDetails />} />


          <Route path="/provider-settings" element={<Settings />} />
          <Route path="/provider-profile/:id" element={<ProviderProfile />} />

          <Route path="/provider-forums" element={<ProviderForums />} />
          <Route path="/provider-forums/post/:postId" element={<ProviderForumDetail />} />
          <Route path="/provider-create-forum-post" element={<ProviderCreateForumPost />} />


          <Route path="/announcement/details/:announcementId" element={<AnnouncementDetails />} />

          <Route path="/validation-page" element={<ValidationPage />} />
          <Route path="/validation/:id/scholars" element={<ValidationResult />} />

          <Route path="/provider-notification/:notificationId" element={<ProviderNotificationDetailPage />} />
          <Route path="/provider-notification" element={<ProviderAllNotification />} />
        </Route>

        {/* Scholar Routes */}
        <Route element={<PrivateRoute allowedRoles={['applicant']} />}>
          <Route path='/profile' element={<Profile />} />
          <Route path="/verify-profile" element={<CompleteProfile />} />
          <Route path="/complete-profile-confirmation" element={<CompleteProfileConfirmation />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/password-and-security" element={<PasswordAndSecurity2 />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/CoRH" element={<CompleteOrReturnHome />} />

          {/* <Route path="/applying-stages/:scholarshipId" element={<ApplyingStages />} /> */}
          <Route path="/application-box" element={<ApplicationBox />} />
          <Route path="/application-detail/:id" element={<InboxedApplicationDetail />} />
          <Route path="/resubmit-application/:id" element={<ResubmitApplication />} />
          <Route path="/student-info" element={<StudentInfo />} />

          {/* <Route path="/profile-preview/:id" element={<ProfilePreview />} /> */}
          {/* <Route path="/post-details" element={<PostDetails />} /> */}
          <Route path="/announcement/:announcementId" element={<AnnouncementView />} />

          <Route path="/notifications/:notificationId" element={<ApplicantDetailedNotification />} />
          <Route path="/notifications" element={<ApplicantAllNotification />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

      </Routes>
    </BrowserRouter >
  )
}
