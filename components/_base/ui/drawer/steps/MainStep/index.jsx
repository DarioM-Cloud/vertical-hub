'use client';

import Link from 'next/link';
import { ChevronRight, LogOut, Bell, Shield, User } from 'lucide-react';
import Button from '@/components/_base/ui/button';
import styles from './mainStep.module.scss';

export default function MainStep({ onNavigate, onClose, onLogout }) {
  return (
    <div className={styles.stepContainer}>
      <Link href="/perfil" className={styles.menuItem} onClick={onClose}>
        <div className={styles.menuItemLeft}>
          <User size={18} strokeWidth={2.5} />
          <span>Editar Perfil</span>
        </div>
        <ChevronRight size={18} className={styles.chevron} />
      </Link>

      <button className={styles.menuItem} onClick={() => onNavigate('notifications')}>
        <div className={styles.menuItemLeft}>
          <Bell size={18} strokeWidth={2.5} />
          <span>Notificaciones</span>
        </div>
        <ChevronRight size={18} className={styles.chevron} />
      </button>

      <button className={styles.menuItem} onClick={() => onNavigate('privacy')}>
        <div className={styles.menuItemLeft}>
          <Shield size={18} strokeWidth={2.5} />
          <span>Privacidad</span>
        </div>
        <ChevronRight size={18} className={styles.chevron} />
      </button>

      <div className={styles.divider}></div>

      <Button variant="ghost" onClick={onLogout} className={styles.logoutDrawerBtn}>
        <LogOut size={20} strokeWidth={2} />
        Cerrar Sesión
      </Button>
    </div>
  );
}