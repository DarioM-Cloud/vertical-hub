'use client';

import { useState } from 'react';
import { Drawer as MuiDrawer } from '@mui/material';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import MainStep from './steps/MainStep';
import NotificationsStep from './steps/NotificationsStep';
import PrivacyStep from './steps/PrivacyStep';
import styles from './drawer.module.scss';

export default function SettingsDrawer({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState('main');
  const [isPrivate, setIsPrivate] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const resetAndClose = () => {
    setActiveView('main');
    onClose();
  };

  return (
    <MuiDrawer
      anchor="right"
      open={isOpen}
      onClose={resetAndClose}
      PaperProps={{
        sx: { width: '100%', maxWidth: 320, padding: 0 }
      }}
    >
      <div className={styles.drawerContainer}>
        {activeView === 'main' && (
          <header className={styles.drawerHeader}>
            <h3>Configuración</h3>
            <button className={styles.closeBtn} onClick={resetAndClose} aria-label="Cerrar">
              <X size={24} strokeWidth={2} />
            </button>
          </header>
        )}

        <div className={styles.drawerContent}>
          {activeView === 'main' && (
            <MainStep
              onNavigate={setActiveView}
              onClose={resetAndClose}
              onLogout={handleLogout}
            />
          )}

          {activeView === 'notifications' && (
            <NotificationsStep
              onBack={() => setActiveView('main')}
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          )}

          {activeView === 'privacy' && (
            <PrivacyStep
              onBack={() => setActiveView('main')}
              isPrivate={isPrivate}
              onToggle={() => setIsPrivate(!isPrivate)}
            />
          )}
        </div>
      </div>
    </MuiDrawer>
  );
}