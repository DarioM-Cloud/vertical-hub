'use client';

import { ArrowLeft } from 'lucide-react';
import styles from './privacyStep.module.scss';

export default function PrivacyStep({ onBack, isPrivate, onToggle }) {
  return (
    <div className={styles.stepContainer}>
      <header className={styles.stepHeader}>
        <button className={styles.iconBtn} onClick={onBack} aria-label="Volver">
          <ArrowLeft size={24} strokeWidth={2} />
        </button>
        <h3>Privacidad</h3>
        <div className={styles.placeholder}></div>
      </header>

      <div className={styles.settingRow}>
        <div className={styles.settingInfo}>
          <span className={styles.settingTitle}>Perfil Privado</span>
          <span className={styles.settingDesc}>Oculta tu logbook a usuarios no amigos.</span>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={onToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
}