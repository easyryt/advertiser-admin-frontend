// AppRoutes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Pages
import LoginPage from "./pages/LoginWithOTP";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardHomePage from "./pages/DashboardHomePage";
import PlanList from "./pages/PlanList";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetails from "./pages/CampaignDetails";
import CampaignList from "./pages/CampaignList";
import AdvertisersDataGrid from "./pages/AdvertisersDataGrid";
import AdvertiserAnalyticsDashboard from "./pages/AdvertiserAnalyticsDashboard";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

        <Route path="/"
          element={isAuthenticated
            ? <DashboardLayout />
            : <Navigate to="/login" replace />}
        >
          <Route path="dashboard" element={<DashboardHomePage />} />
          <Route path="dashboard/plan-list" element={<PlanList />} />
          <Route path="dashboard/campaigns/:advertiserId" element={<CampaignsPage />} />
          <Route path="dashboard/campaigns-details" element={<CampaignDetails />} />
          <Route path="dashboard/campaign-list" element={<CampaignList/>} />
          <Route path="dashboard/advertisers" element={<AdvertisersDataGrid />} />
          <Route path="dashboard/advertiser-analytics-/:advertiserId" element={<AdvertiserAnalyticsDashboard />} />
          <Route path="dashboard/users" element={<UsersPage />} />
          <Route path="dashboard/products" element={<ProductsPage />} />
          <Route path="dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="dashboard/messages" element={<MessagesPage />} />
          <Route path="dashboard/settings" element={<SettingsPage />} />
          <Route path="profile-page" element={<ProfilePage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
