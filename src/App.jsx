import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./component/Layout";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RequireAuth from "./auth/RequireAuth";
import RequireGuest from "./auth/RequireGuest";

const KPIManagement = lazy(() => import("./pages/KPIManagement"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="users/:userId" element={<UserProfile />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="KPIManagement" element={<KPIManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>

          <Route
            path="/login"
            element={
              <RequireGuest>
                <Login />
              </RequireGuest>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
