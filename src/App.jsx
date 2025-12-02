import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import OauthSuccess from "./pages/OauthSuccess";
import { Properties } from "./pages/Properties";
import { Reservation } from "./pages/Reservation";
import { AboutUs } from "./pages/AboutUs";
import { SignUp } from "./pages/SignUp";
import { VerifyOTP } from "./pages/VerifyOTP";
import { DetailProperties } from "./pages/DetailProperties";
import { Block } from "./components/PropertiesPage/Block";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";

import AdminDashboard from "./pages/AdminDashboard";
import ManageHouse from "./pages/ManageHouse";
import Notification from "./pages/Notification";
import DataReport from "./pages/DataReport";
import ManageReservation from "./pages/ManageReservation";
import { AdminProtectedRoute, UserProtectedRoute } from "./lib/ProtectedRoute";

import { useEffect } from "react";

function App() {
  // ============================
  // 🚫 Auto-clear session admin
  // ============================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      console.log("Admin session cleared (prevent admin as user)");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.setItem("isLoggedIn", "false");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ===========================
                 PUBLIC ROUTES
        ============================ */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />

        {/* ===========================
                  OTHER PAGES
        ============================ */}
        <Route path="/block" element={<Block />} />
        <Route path="/detail-properties/:id_block" element={<DetailProperties />} />

        {/* ===========================
             USER PROTECTED ROUTES
        ============================ */}
        <Route
          path="/properties"
          element={
            <UserProtectedRoute>
              <Properties />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/reservation"
          element={
            <UserProtectedRoute>
              <Reservation />
            </UserProtectedRoute>
          }
        />

        {/* ===========================
             ADMIN PROTECTED ROUTES
        ============================ */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-house"
          element={
            <AdminProtectedRoute>
              <ManageHouse />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/data-report"
          element={
            <AdminProtectedRoute>
              <DataReport />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/notification"
          element={
            <AdminProtectedRoute>
              <Notification />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-reservation"
          element={
            <AdminProtectedRoute>
              <ManageReservation />
            </AdminProtectedRoute>
          }
        />

        {/* ===========================
            CATCH-ALL → NOT FOUND
        ============================ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
