import { HashRouter, Routes, Route } from 'react-router-dom';
import { ParticipantRegistration } from './components/ParticipantRegistration';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { HistoryPage } from './components/HistoryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
