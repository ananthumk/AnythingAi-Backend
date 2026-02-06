import { useEffect, useState } from 'react'
import './App.css'
import AppContext from './context/AppContext'
import LoginForm from './pages/LoginForm'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'

function App() {
  const [token, setToken] = useState('')
  useEffect(() => {
    const t = localStorage.getItem('token')
    setToken(t)
  },[])

  const updateToken = (newToken) => {
    setToken(newToken)
    if(newToken){
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

 
  const url = 'http://localhost:5000/api/v1'
  return (
   <AppContext.Provider value={{
    token: token, url: url, updateToken: updateToken
   }}>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<ProtectedRoute element={<UserDashboard />} />} />
        <Route path='/admin' element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path='/not-found' element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
   </AppContext.Provider>
  )
}

export default App
