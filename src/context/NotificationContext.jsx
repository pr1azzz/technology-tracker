import { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createContext, useContext } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification должен использоваться внутри NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map((notif, index) => (
        <Snackbar
          key={notif.id}
          open={true}
          autoHideDuration={notif.duration}
          onClose={() => hideNotification(notif.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          style={{
            bottom: `${index * 70 + 20}px`,
          }}
        >
          <Alert
            onClose={() => hideNotification(notif.id)}
            severity={notif.type}
            variant="filled"
            sx={{
              width: '100%',
              minWidth: '300px',
              '@media (max-width:600px)': {
                minWidth: '90vw',
              },
            }}
          >
            {notif.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}
