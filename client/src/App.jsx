import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import VerifyYourEmail from "./components/VerifyYourEmail";
import Landing from "./pages/Landing";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-your-email" element={<VerifyYourEmail />} />
      </Routes>
    </BrowserRouter >
  )
}
