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
import CreateEntry from './components/ui/CreateEntry'
import CreateProject from './components/ui/CreteProject'
import EntryDeatiledView from './components/ui/EntryDeatiledView'
import TrendingPage from './pages/TrendingPage'
import DevsPage from './pages/DevsPage'


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
            <Route path='/project/create' element={<CreateProject />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/entry/create' element={<CreateEntry />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/entry/detailed/:id' element={<EntryDeatiledView />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/entry/:id' element={<PostCardEdit />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/entry/trending' element={<TrendingPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path='/devs' element={<DevsPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}