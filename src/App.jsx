import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importăm Layout-urile
import MainLayout from './layouts/MainLayout';

// Importăm Paginile
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTE PUBLICE --- */}
        {/* Pagina de Login este complet separată de restul aplicației */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- RUTE PROTEJATE (Dashboard) --- */}
        {/* Toate aceste pagini vor avea Sidebar-ul și Header-ul din MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Index route înseamnă pagina care se deschide default la "/" */}
          <Route index element={<EventsPage />} />
          
          <Route path="communities" element={<CommunitiesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Aici puteți adăuga rute noi pe viitor, de exemplu: */}
          {/* <Route path="event/:id" element={<EventDetailsPage />} /> */}
        </Route>

        {/* --- RUTE DE FALLBACK --- */}
        {/* Dacă userul scrie o adresă greșită, îl trimitem la Login sau Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;