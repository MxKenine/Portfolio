import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminSideNav from './components/Sidenav'
import Editprofil from './components/Editprofil'

export function UserNavbar() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<UserNavbar />}>
          <Route path='/accueil' element={<Home />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
        </Route>

        <Route path="/admin" element={<AdminSideNav />}>
          <Route path='/admin' element={<Admin />}/>
          <Route path='/admin/edit-profil' element={<Editprofil />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}