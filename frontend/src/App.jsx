// main.jsx or App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthCallback from './pages/AuthCallback'
import Login from './pages/Login'
import NewsFeedPage from './pages/NewsFeedPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import RegisterPage from './pages/RegisterPage'
import PostCardEdit from './components/ui/PostCardEdit'
import UserLayout from './components/layout/UserLayout'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/feed' element={<NewsFeedPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/profile/:id' element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/entry/:id' element={<PostCardEdit />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}