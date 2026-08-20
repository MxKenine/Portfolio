import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import Voircv from './components/Voircv'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/accueil' element={<Home />}/>
      <Route path='/contact' element={<Contact />}/>
      <Route path='/cv' element={<Voircv />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
    </Routes>
    <Footer />
    </BrowserRouter>
    </>
  )
}