import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminSideNav from './components/Sidenav'
import VerifyEmail from './pages/VerifyEmail'
import EditProfil from './pages/Editprofil'
import Hotpot from './pages/Hotpot'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Projets from './pages/Projets'
import ProjetDetail from './pages/ProjetDetail'


export function UserNavbar() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<UserNavbar />}>
          <Route path='' element={<Home />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/verify-email' element={<VerifyEmail />}/>
          <Route path='/hotpot' element={<Hotpot />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/projets' element={<Projets />}/>
          <Route path="/projets/:projetId" element={<ProjetDetail />} />
        </Route>

        <Route path="/admin" element={<AdminSideNav />}>
          <Route path='/admin' element={<Admin />}/>
          <Route path='/admin/edit-profil' element={<EditProfil />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}