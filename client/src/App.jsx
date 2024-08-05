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
import ProviderHeader from "./components/ProviderHeader";
import Scholarships from "./pages/Scholarship-Provider/scholarships";
import ScholarApplications from "./pages/Scholarship-Provider/ScholarApplications";
import ProviderForums from "./pages/Scholarship-Provider/ProviderForums";
import ProviderForumDetail from "./pages/Scholarship-Provider/ProviderForumDetail";
import PreviewProfile from "./pages/Scholarship-Provider/PreviewProfile";
import PostScholarship from "./pages/Scholarship-Provider/PostScholarship";
import AdminHome from "./pages/Admin/AdminHome";


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
        <Route path="/about" element={<About />} />
        <Route path="/CoRH" element={<CompleteOrReturnHome />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/application-details" element={<ApplicationDetails />} />
        <Route path="/others-profile" element={<OthersProfile />} />
        <Route path="/forums/post/:postId" element={<ForumDetail />} />
        <Route path="/applying-stages" element={<ApplyingStages />} />
        <Route path="/application-box" element={<ApplicationBox />} />
        <Route path="/inboxed-application-detail" element={<InboxedApplicationDetail />} />
        <Route path="/student-info" element={<StudentInfo />} />
        <Route path="/profile-preview" element={<ProfilePreview />} />
        <Route path="/post-details" element={<PostDetails />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/scholar-applications" element={<ScholarApplications />} />
        <Route path="/provider-forums" element={<ProviderForums />} />
        <Route path="/provider-forums/post/:postId" element={<ProviderForumDetail />} />
        <Route path="/preview-profile" element={<PreviewProfile />} />
        <Route path="/post-scholarship" element={<PostScholarship />} />

        <Route path="/admin-home" element={<AdminHome />} />
  


        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/complete-profile-confirmation" element={<CompleteProfileConfirmation />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
        </Route>

        <Route element={<ProviderPrivateRoute allowedRoles={['scholarship_provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-header" element={<ProviderHeader />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/password-and-security" element={<PasswordAndSecurity />} />
        <Route path="/change-password" element={<ChangePassword />} />


      </Routes>
    </BrowserRouter >
  )
}
