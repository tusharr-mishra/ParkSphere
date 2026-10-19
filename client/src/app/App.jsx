import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { RootLayout } from '../layouts/RootLayout.jsx';
import { CustomerLayout } from '../layouts/CustomerLayout.jsx';
import { OperatorLayout } from '../layouts/OperatorLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';

// Route Guards
import { ProtectedRoute } from '../components/common/ProtectedRoute.jsx';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage.jsx';
import { LoginPage } from '../pages/public/LoginPage.jsx';
import { RegisterPage } from '../pages/public/RegisterPage.jsx';
import { VerifyEmailPage } from '../pages/public/VerifyEmailPage.jsx';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage.jsx';
import { ParkingSearchPage } from '../pages/public/ParkingSearchPage.jsx';
import { FacilityDetailPage } from '../pages/public/FacilityDetailPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard.jsx';
import { CustomerBookingsPage } from '../pages/customer/CustomerBookingsPage.jsx';
import { CustomerBookingDetailPage } from '../pages/customer/CustomerBookingDetailPage.jsx';
import { CustomerVehiclesPage } from '../pages/customer/CustomerVehiclesPage.jsx';
import { CustomerPaymentsPage } from '../pages/customer/CustomerPaymentsPage.jsx';
import { CustomerNotificationsPage } from '../pages/customer/CustomerNotificationsPage.jsx';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage.jsx';

// Operator Pages
import { OperatorDashboard } from '../pages/operator/OperatorDashboard.jsx';
import { OperatorFacilitiesPage } from '../pages/operator/OperatorFacilitiesPage.jsx';
import { OperatorFacilityDetailPage } from '../pages/operator/OperatorFacilityDetailPage.jsx';
import { OperatorSlotsPage } from '../pages/operator/OperatorSlotsPage.jsx';
import { OperatorReservationsPage } from '../pages/operator/OperatorReservationsPage.jsx';
import { OperatorAnalyticsPage } from '../pages/operator/OperatorAnalyticsPage.jsx';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage.jsx';
import { AdminOperatorsPage } from '../pages/admin/AdminOperatorsPage.jsx';
import { AdminFacilitiesPage } from '../pages/admin/AdminFacilitiesPage.jsx';
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage.jsx';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage.jsx';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage.jsx';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage.jsx';

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="parking" element={<ParkingSearchPage />} />
        <Route path="parking/:id" element={<FacilityDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Customer Protected Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bookings" element={<CustomerBookingsPage />} />
        <Route path="bookings/:id" element={<CustomerBookingDetailPage />} />
        <Route path="vehicles" element={<CustomerVehiclesPage />} />
        <Route path="payments" element={<CustomerPaymentsPage />} />
        <Route path="notifications" element={<CustomerNotificationsPage />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Operator Protected Routes */}
      <Route
        path="/operator"
        element={
          <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
            <OperatorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<OperatorDashboard />} />
        <Route path="facilities" element={<OperatorFacilitiesPage />} />
        <Route path="facilities/:id" element={<OperatorFacilityDetailPage />} />
        <Route path="slots" element={<OperatorSlotsPage />} />
        <Route path="reservations" element={<OperatorReservationsPage />} />
        <Route path="analytics" element={<OperatorAnalyticsPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="operators" element={<AdminOperatorsPage />} />
        <Route path="facilities" element={<AdminFacilitiesPage />} />
        <Route path="reservations" element={<AdminReservationsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};
