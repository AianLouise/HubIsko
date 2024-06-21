import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import VerifyYourEmail from "./components/VerifyYourEmail";
import ScholarshipListing from "./pages/ScholarshipListing";
import ForgotPassword from "./components/ForgotPassword";
import CompleteProfile from "./pages/CompleteProfile";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/scholarship-listing" element={<ScholarshipListing />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-your-email" element={<VerifyYourEmail />} />
        <Route path="/resend-verification-email" element={<VerifyYourEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </BrowserRouter >
  )
}
