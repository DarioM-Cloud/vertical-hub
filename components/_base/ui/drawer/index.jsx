'use client';

import { useState } from 'react';
import { Drawer as MuiDrawer } from '@mui/material';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePrivacyToggle } from '@/hooks/usePrivacyToggle';
import MainStep from './steps/MainStep';
import NotificationsStep from './steps/NotificationsStep';
import PrivacyStep from './steps/PrivacyStep';
import styles from './drawer.module.scss';

export default function SettingsDrawer({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const [activeView, setActiveView] = useState('main');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isPrivate, togglePrivacy } = usePrivacyToggle(user?.uid);

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
      classes={{ paper: styles.drawerPaper }}
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
              onToggle={togglePrivacy}
            />
          )}
        </div>
      </div>
    </MuiDrawer>
  );
}