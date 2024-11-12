import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import Employment from "./pages/employment";
import EventPosting from "./pages/eventposting";
import Homepage from "./pages/homepage";
import Maps from "./pages/maps";
import OrganizationPosting from "./pages/organization";
import { UserProvider } from './context/UserContext';


import Translation from "./pages/translation";




function App() {
  return (
    <UserProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/culture" element={<EventPosting />} />
          <Route path="/employment" element={<Employment />} />
          <Route path="/organization" element={<OrganizationPosting />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/maps" element={<Maps />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  // Render Navbar only on routes other than the homepage
  if (location.pathname === "/") return null;

  return <Navbar />;
}

export default App;