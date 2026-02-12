import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { SignInScreen } from "./components/SignInScreen";
import { SignUpScreen } from "./components/SignUpScreen";
import { ForgotPasswordScreen } from "./components/ForgotPasswordScreen";
import { GoogleOAuthTroubleshoot } from "./components/GoogleOAuthTroubleshoot";
import { TaskBackendSetup } from "./components/TaskBackendSetup";
import { TaskBackendTest } from "./components/TaskBackendTest";
import { ProfileBackendTest } from "./components/ProfileBackendTest";
import { ProfileSyncDebug } from "./components/ProfileSyncDebug";
import { TaskDeleteDiagnostics } from "./components/TaskDeleteDiagnostics";
import { DataCleanupUtility } from "./components/DataCleanupUtility";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { PremiumHomeDashboard } from "./components/PremiumHomeDashboard";
import { TasksScreen } from "./components/TasksScreen";
import { RemindersScreen } from "./components/RemindersScreen";
import { EnergyHubScreen } from "./components/EnergyHubScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { MeetingsScreen } from "./components/MeetingsScreen";
import { ShareScreen } from "./components/ShareScreen";
import { InboxScreen } from "./components/InboxScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { HelpScreen } from "./components/HelpScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { FocusSessionScreen } from "./components/FocusSessionScreen";
import { DailyCheckoutScreen } from "./components/DailyCheckoutScreen";
import { IntegrationsScreen } from "./components/IntegrationsScreen";
import { WorkspaceDirectoryScreen } from "./components/WorkspaceDirectoryScreen";
import { ProjectOverviewScreen } from "./components/WorkspaceActivityScreen";
import { WeeklyInsights } from "./components/WeeklyInsights";
import { SaveStatesScreen } from "./components/SaveStatesScreen";
import { BacklogScreen } from "./components/BacklogScreen";
import { TimelineScreen } from "./components/TimelineScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <SignInScreen />,
  },
  {
    path: "/signin",
    element: <SignInScreen />,
  },
  {
    path: "/signup",
    element: <SignUpScreen />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordScreen />,
  },
  {
    path: "/google-oauth-troubleshoot",
    element: <GoogleOAuthTroubleshoot />,
  },
  {
    path: "/task-backend-setup",
    element: <TaskBackendSetup />,
  },
  {
    path: "/task-backend-test",
    element: (
      <ProtectedRoute>
        <TaskBackendTest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile-backend-test",
    element: (
      <ProtectedRoute>
        <ProfileBackendTest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile-sync-debug",
    element: (
      <ProtectedRoute>
        <ProfileSyncDebug />
      </ProtectedRoute>
    ),
  },
  {
    path: "/task-delete-diagnostics",
    element: (
      <ProtectedRoute>
        <TaskDeleteDiagnostics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-cleanup",
    element: (
      <ProtectedRoute>
        <DataCleanupUtility />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PremiumHomeDashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TasksScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reminders",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <RemindersScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/energy",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <EnergyHubScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <AnalyticsScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <CalendarScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/meetings",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <MeetingsScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/share",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ShareScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inbox",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <InboxScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ProfileScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/help",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <HelpScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SettingsScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/focus",
    Component: FocusSessionScreen,
  },
  {
    path: "/daily-checkout",
    Component: DailyCheckoutScreen,
  },
  {
    path: "/integrations",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <IntegrationsScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <WorkspaceDirectoryScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspace/:projectId",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ProjectOverviewScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/insights",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <WeeklyInsights />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/save-states",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SaveStatesScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/backlog",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <BacklogScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/timeline",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TimelineScreen />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  // Redirect any other routes to landing page for non-auth, dashboard for auth
  {
    path: "*",
    element: <LandingPage />,
  },
]);