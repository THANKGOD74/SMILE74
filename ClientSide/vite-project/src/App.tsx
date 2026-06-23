import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import { MyTaskPage } from './pages/MyTaskPage';
import { NewTaskPage } from './pages/NewTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';
import CoverPage from './pages/CoverPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerificationSent from './pages/VerificationSent';
import EmailVerified from './pages/EmailVerified';
import VerifyEmailHandler from './pages/VerifyEmailHandler';
import TrashPage from './pages/TrashPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email-sent" element={<VerificationSent />} />
          <Route path="/verify-email/:token" element={<VerifyEmailHandler />} />
          <Route path="/email-verified" element={<EmailVerified />} />

          {/* Protected routes inside MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/my-tasks" element={<ProtectedRoute><MyTaskPage /></ProtectedRoute>} />
            <Route path="/new-task" element={<ProtectedRoute><NewTaskPage /></ProtectedRoute>} />
            <Route path="/edit-task/:id" element={<ProtectedRoute><EditTaskPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/trash" element={<ProtectedRoute><TrashPage /></ProtectedRoute>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



