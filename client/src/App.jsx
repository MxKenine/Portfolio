import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminSideNav from "./components/layout/Sidenav";

import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import VerifyEmail from "./pages/public/VerifyEmail";
import CV from "./pages/public/CV";
import Contact from "./pages/public/Contact";
import Projets from "./pages/public/Projets";
import ProjetDetail from "./pages/public/ProjetDetail";

import Admin from "./pages/admin/Admin";
import ProfilAdmin from "./pages/admin/ProfilAdmin";
import ExperiencesAdmin from "./pages/admin/ExperiencesAdmin";

export function UserNavbar() {
  return (
    <div className="flex flex-col h-dvh">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<UserNavbar />}>
            <Route path="" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/projets/:projetId" element={<ProjetDetail />} />
          </Route>

          <Route path="/admin" element={<AdminSideNav />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/profil" element={<ProfilAdmin />} />
            <Route path="/admin/experiences" element={<ExperiencesAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
