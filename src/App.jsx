import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useEffect } from 'react'
import { supabase } from './lib/supabase'


import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<LoginPage />} />

          <Route path="/confirm" element={<ConfirmEmailPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        <Route path="/create-event" element={<CreateEventPage />} />
         <Route path="/create-community" element={<CreateCommunityPage />} />

       
        <Route path="/" element={<MainLayout />}>
       
          <Route index element={<EventsPage />} />
          
          <Route path="communities" element={<CommunitiesPage />} />
          <Route path="profile" element={<ProfilePage />} />
         
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;