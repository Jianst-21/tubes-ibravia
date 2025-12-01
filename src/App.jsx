import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import OauthSuccess from "./pages/OauthSuccess";
import { Properties } from "./pages/Properties";
import { Reservation } from "./pages/Reservation";
import { AboutUs } from "./pages/AboutUs";
import { SignUp } from "./pages/SignUp";
import { VerifyOTP } from "./pages/VerifyOTP";
import { DetailProperties } from "./pages/detailProperties";
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
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/VerifyOTP" element={<VerifyOTP />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />

        {/* Other pages */}
        <Route path="/Block" element={<Block />} />
        <Route path="/Detail-Properties/:id_block" element={<DetailProperties />} />

        {/* User protected routes */}
        <Route
          path="/Properties"
          element={
            <UserProtectedRoute>
              <Properties />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/Reservation"
          element={
            <UserProtectedRoute>
              <Reservation />
            </UserProtectedRoute>
          }
        />

        {/* Admin protected routes */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
