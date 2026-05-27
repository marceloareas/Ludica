import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Games from './pages/Games/Games'
import GameDetails from './pages/Games/GameDetails'
import Amigos from './pages/Amigos/Amigos'
import Avatar from './pages/Avatar/Avatar'
import Perfil from './pages/Perfil/perfil'

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/amigos" element={<Amigos />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}