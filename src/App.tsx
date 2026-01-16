import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ParticipantRegistration } from './components/ParticipantRegistration';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { HistoryPage } from './components/HistoryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Basename cho GitHub Pages - thay 'lucky-draw' bằng tên repo của bạn
const basename = import.meta.env.DEV ? '/' : '/lucky-draw';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<ParticipantRegistration />} />
        <Route path="/history" element={<HistoryPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
