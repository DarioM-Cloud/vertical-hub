import styles from './partnerTicket.module.scss';

export default function PartnerTicket({ usuario, nivel, fecha, mensaje, rocodromo }) {
  return (
    <div className={styles.ticket}>
      <div className={styles.dateColumn}>
        <span className={styles.day}>{fecha.split(' ')[0]}</span>
        <span className={styles.time}>{fecha.split(' ')[1]}</span>
      </div>
      
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.user}>{usuario}</span>
          <span className={styles.level}>{nivel}</span>
        </div>
        
        <p className={styles.message}>"{mensaje}"</p>
        
        <div className={styles.bottomRow}>
          <span className={styles.place}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {rocodromo}
          </span>
          <button className={styles.joinBtn}>Apuntarme</button>
        </div>
      </div>
    </div>
  );
}