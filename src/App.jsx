import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import './App.css';
import Navigation from './components/Navigation.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider, useTheme } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { TechnologiesProvider } from './hooks/useTechnologies.jsx';
import Home from './pages/Home.jsx';
import TechnologyList from './pages/TechnologyList.jsx';
import TechnologyDetail from './pages/TechnologyDetail.jsx';
import AddTechnology from './pages/AddTechnology.jsx';
import Statistics from './pages/Statistics.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';

function AppContent() {
  const location = useLocation();
  const [reloadNoticePath, setReloadNoticePath] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const navEntries = performance.getEntriesByType?.('navigation') || [];
    const navigationEntry = navEntries[0];
    const isReload = navigationEntry
      ? navigationEntry.type === 'reload'
      : performance?.navigation?.type === performance?.navigation?.TYPE_RELOAD;

    if (isReload && window.location.pathname !== '/') {
      setReloadNoticePath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setReloadNoticePath(null);
    }
  }, [location.pathname]);

  // Применяем класс темы к документу
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('theme-switched');
    } else {
      html.classList.remove('theme-switched');
    }
  }, [isDarkMode]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <Navigation />
      
      {reloadNoticePath && (
        <div className="reload-notice">
          <p>
            Страница <strong>{reloadNoticePath}</strong> обновлена напрямую. Для корректной работы SPA
            перейдите на главную и используйте встроенную навигацию.
          </p>
          <Link to="/" className="btn btn-primary">
            ← На главную
          </Link>
        </div>
      )}

      <Box className="App" sx={{ maxWidth: 1200, mx: 'auto', p: 2.5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technologies" element={<TechnologyList />} />
          <Route path="/technology/:id" element={<TechnologyDetail />} />
          <Route path="/add-technology" element={<AddTechnology />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <NotificationProvider>
          <TechnologiesProvider>
            <AppContent />
          </TechnologiesProvider>
        </NotificationProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;