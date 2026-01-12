import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

// Import Layouts
import MainLayout from './layouts/MainLayout';

// Import Pages
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

// --- GUARD COMPONENTS ---

// 1. ProtectedRoute: Checks if user is logged in.
// If NO session -> Redirects to /login
// If YES session -> Renders the app
const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes (e.g. sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-purple-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. AuthRoute: Checks if user is ALREADY logged in.
// If YES session -> Redirects to / (Dashboard)
// If NO session -> Renders the Login page
const AuthRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    // We don't necessarily need a listener here, but it's safe to have
  }, []);

  if (loading) return null; // Minimal loading state

  return session ? <Navigate to="/" replace /> : <Outlet />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- PUBLIC / AUTH ROUTES --- */}
        {/* If you are logged in, you cannot visit /login again */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Public Utility Routes */}
        <Route path="/confirm" element={<ConfirmEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />


        {/* --- PROTECTED ROUTES (Dashboard) --- */}
        {/* You must be logged in to see ANY of these */}
        <Route element={<ProtectedRoute />}>
          
          {/* Create Pages */}
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/create-community" element={<CreateCommunityPage />} />

          {/* Main Layout (Sidebar + Content) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<EventsPage />} />
            <Route path="communities" element={<CommunitiesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
        </Route>

        {/* --- FALLBACK --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;