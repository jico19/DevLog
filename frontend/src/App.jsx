// main.jsx or App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthCallback from './pages/AuthCallback'
import Login from './pages/Login'
import DashboardPage from './pages/Dashboard'
import ProtectedRoute from './components/layout/ProtectedRoute'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}