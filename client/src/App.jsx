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
import ProviderDashboard from "./pages/Scholarship-Provider/providerDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ScholarDashboard from "./pages/ScholarDashboard";
import RegisterAsProvider from "./pages/RegisterAsProvider";
import CompleteProfileConfirmation from "./pages/CompleteProfileConfirmation";
import AccountManagement from "./pages/AccountManagement";
import PasswordAndSecurity from "./pages/PasswordAndSecurity";
import ChangePassword from "./components/ChangePassword";
import Forums from "./pages/Forums";
import ApplicationDetails from "./pages/ApplicationDetails";
import OthersProfile from "./pages/OthersProfile";
import ForumDetail from "./pages/Post";
import ApplyingStages from "./pages/ApplyingStages";
import ApplicationBox from "./pages/ApplicationBox";
import InboxedApplicationDetail from "./pages/InboxedApplicationDetail";
import StudentInfo from "./pages/StudentInfo";
import ProfilePreview from "./pages/ProfilePreview";
import PostDetails from "./pages/PostDetails";
import Scholarships from "./pages/Scholarship-Provider/scholarships";
import ScholarApplications from "./pages/Scholarship-Provider/ScholarApplications";
import ProviderForums from "./pages/Scholarship-Provider/ProviderForums";
import ProviderForumDetail from "./pages/Scholarship-Provider/ProviderForumDetail";
import PreviewProfile from "./pages/Scholarship-Provider/PreviewProfile";
import PostScholarship from "./pages/Scholarship-Provider/PostScholarship";
import AdminHome from "./pages/Admin/AdminHome";
import CreateForumPost from "./pages/CreateForumPost";
import Accounts from "./pages/Admin/Accounts";
import Layout from "./components/Layout";
import Students from "./pages/Admin/Students";
import ProviderAccounts from "./pages/Admin/ProviderAccounts";
import VerificationDetails from "./pages/Admin/VerificationDetails";
import StudentDetails from "./pages/Admin/StudentDetails";
import ProviderDetails from "./pages/Admin/ProviderDetails";
import Inbox from "./pages/Admin/Inbox";
import ScholarshipsData from "./pages/Admin/ScholarshipsData";
import ScholarshipsDataDetails from "./pages/Admin/ScholarshipsDataDetails";
import ScholarshipsDataDisplay from "./pages/Admin/ScholarshipsDataDisplay";
import ViewScholarshipDetails from "./pages/Scholarship-Provider/ViewScholarshipDetails";
import ViewApplicationDetails from "./pages/Scholarship-Provider/ViewApplicationDetails";



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
        <Route path="/about" element={<About />} />
        <Route path="/CoRH" element={<CompleteOrReturnHome />} />

        <Route path="/forums" element={<Forums />} />
        <Route path="/others-profile" element={<OthersProfile />} />
        <Route path="/forums/post/:postId" element={<ForumDetail />} />
        <Route path="/forums/create-post" element={<CreateForumPost />} />



        <Route path="/scholarship-listing" element={<ScholarshipListing />} />
        <Route path="/scholarship-details/:id" element={<ApplicationDetails />} />
        <Route path="/applying-stages/:scholarshipId" element={<ApplyingStages />} />
        <Route path="/application-box" element={<ApplicationBox />} />
        <Route path="/application-detail/:id" element={<InboxedApplicationDetail />} />
        <Route path="/student-info" element={<StudentInfo />} />
        <Route path="/profile-preview" element={<ProfilePreview />} />
        <Route path="/post-details" element={<PostDetails />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/view-scholarships/:id" element={<ViewScholarshipDetails />} />

        <Route path="/scholar-applications" element={<ScholarApplications />} />
        <Route path="/provider-forums" element={<ProviderForums />} />
        <Route path="/provider-forums/post/:postId" element={<ProviderForumDetail />} />
        <Route path="/preview-profile" element={<PreviewProfile />} />
        <Route path="/post-scholarship" element={<PostScholarship />} />



        <Route path="/" element={<Layout />}>
          <Route path="admin-home" element={<AdminHome />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="students" element={<Students />} />
          <Route path="provider-accounts" element={<ProviderAccounts />} />
          <Route path="verification-details" element={<VerificationDetails />} />
          <Route path="student-details" element={<StudentDetails />} />
          <Route path="provider-details" element={<ProviderDetails />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="scholarships-data" element={<ScholarshipsData />} />
          <Route path="scholarships-data-details" element={<ScholarshipsDataDetails />} />
          <Route path="scholarships-data-display" element={<ScholarshipsDataDisplay />} />
          {/* Add other routes here */}
        </Route>






        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/complete-profile-confirmation" element={<CompleteProfileConfirmation />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
        </Route>

        <Route element={<ProviderPrivateRoute allowedRoles={['scholarship_provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        </Route>

        <Route path="/applications/:id" element={<ViewApplicationDetails />} />


        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/password-and-security" element={<PasswordAndSecurity />} />
        <Route path="/change-password" element={<ChangePassword />} />


      </Routes>
    </BrowserRouter >
  )
}
