import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Footer from './components/Footer'
import { useAuthStore } from './store/useAuthStore.js'
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore.js'
import VerifyEmail from './pages/verifyEmail.jsx'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? (authUser.isVerified ? <Home /> : <Navigate to="/verify-email" />) : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile'  element={authUser ? (authUser.isVerified ? <Profile /> : <Navigate to="/verify-email" />) : <Navigate to="/login" />} />
      </Routes>
      {/* <Footer /> */}
      <Toaster />
    </div>
  )
}

export default App
