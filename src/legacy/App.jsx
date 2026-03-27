// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./store/slices/authSlice.js";

// Website Pages
import HomePage from "./pages/HomePage.jsx";
import TrainingPage from "./pages/TrainingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Layout from "./components/Layout";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import CourseReplicaPage from "./courses/CourseReplicaPage";
import CountryRedirect from "./URlRouting/CountryRedirect";
import SearchResults from "./components/SearchResults.jsx";
import ScrollToTop from "./utils/ScrollToTop.js";

// Auth
import Login from "./componentsD/Login";
import Signup from "./componentsD/Signup";

// Student Dashboard
import StudentDash from "./componentsD/StudentDash";
import ProfileUpdate from "./componentsD/ProfileUpdate";
import EnrolledCourses from "./componentsD/EnrolledCourses";
import StudentResources from "./componentsD/StudentResources";
import StudentCertificates from "./componentsD/StudentCertificates";
import StudentPayments from "./componentsD/StudentPayments";
import StudentLiveSessions from "./componentsD/StudentLiveSessions";
import NotFound from "./components/NotFound";
import Notifications from "./componentsD/Notifications";
import ProtectedRoute from "./componentsD/ProtectedRoute.jsx";
import ForgotPassword from './componentsD/ForgotPassword.jsx';
import ResetPassword from "./componentsD/ResetPassword.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx"
import GlobalLocationSwitcher from "./URlRouting/GlobalLocationSwitcher.jsx"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ============================================
            ROOT REDIRECT - Detects user location
        ============================================ */}
        <Route path="/" element={<CountryRedirect />} />

        {/* ============================================
            STUDENT DASHBOARD (Independent Routes)
        ============================================ */}
        <Route path="/student"
          element={<ProtectedRoute>
            <StudentDash />
          </ProtectedRoute>
          }>
          {/* ✅ Redirect /student to /student/profile */}
          <Route index element={<Navigate to="profile" replace />} />

          {/* ✅ Nested Student Routes */}
          <Route path="profile" element={<ProfileUpdate />} />
          <Route path="courses" element={<EnrolledCourses />} />
          <Route path="resources" element={<StudentResources />} />
          {/* <Route path="certificates" element={<StudentCertificates />} /> */}
          <Route path="payments" element={<StudentPayments />} />
          <Route path="live-sessions" element={<StudentLiveSessions />} />
          <Route path="notifications" element={<Notifications />} />


          {/* ✅ 404 for unknown student routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>

        {/* ============================================
            AUTH ROUTES (Outside Location Structure)
        ============================================ */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="choose-country-region" element={<GlobalLocationSwitcher />} />

        {/* ============================================
            LOCATION-BASED ROUTES (Website)
        ============================================ */}
        <Route path=":country/:region/:city" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="training" element={<TrainingPage />} />

          <Route path="training/:mastercategoryid/:categoryCitySeo" element={<CategoryPage />} />

          <Route path="training/:mastercategoryid/:categoryCitySeo/:subcategoryid/:subcategoryCitySeo" element={<SubCategoryPage />} />

          <Route path="training/:mastercategoryid/:categoryCitySeo/:subcategoryid/:subcategoryCitySeo/:courseId/:courseCitySeo" element={<CourseReplicaPage />} />

          <Route path="search" element={<SearchResults />} />

          <Route path="privacy-policy" element={<PrivacyPolicy />} />

          {/* Auth links inside location context */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Route>

        {/* ============================================
            FALLBACK - Redirect unknown routes
        ============================================ */}
        {/* <Route path="*" element={<CountryRedirect />} /> */}
      </Routes>
    </Router>
  );
}

export default App;