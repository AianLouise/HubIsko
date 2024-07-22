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
import ProviderHeader from "./components/ProviderHeader";
import Forums from "./pages/Forums";
import ApplicationDetails from "./pages/ApplicationDetails";
import OthersProfile from "./pages/OthersProfile";
import ForumDetail from "./pages/Post";
import ApplyingStages from "./pages/ApplyingStages";
import ApplicationBox from "./pages/ApplicationBox";



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

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/complete-profile-confirmation" element={<CompleteProfileConfirmation />} />
          <Route path="/scholar-dashboard" element={<ScholarDashboard />} />
        </Route>

        <Route element={<ProviderPrivateRoute allowedRoles={['scholarship_provider']} />}>
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-Header" element={<ProviderHeader />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/password-and-security" element={<PasswordAndSecurity />} />
        <Route path="/change-password" element={<ChangePassword />} />


      </Routes>
    </BrowserRouter >
  )
}
