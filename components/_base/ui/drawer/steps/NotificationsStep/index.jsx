'use client';

import { ArrowLeft } from 'lucide-react';
import styles from './notificationsStep.module.scss';

export default function NotificationsStep({ onBack, enabled, onToggle }) {
  return (
    <div className={styles.stepContainer}>
      <header className={styles.stepHeader}>
        <button className={styles.iconBtn} onClick={onBack} aria-label="Volver">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h3>Notificaciones</h3>
        <div className={styles.placeholder}></div>
      </header>

      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <span className={styles.settingTitle}>Alertas Generales</span>
          <span className={styles.settingDesc}>Recibe avisos de nuevos mensajes y likes.</span>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
}