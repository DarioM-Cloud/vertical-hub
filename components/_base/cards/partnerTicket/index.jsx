import { Trash2, UserCheck, UserPlus, MapPin } from 'lucide-react';
import styles from './partnerTicket.module.scss';

export default function PartnerTicket({ data, currentUser, onDelete, onJoin }) {
  let day = '--/--';
  let time = '--:--';
  
  if (data?.fecha) {
    const dateObj = data.fecha.toDate ? data.fecha.toDate() : new Date(data.fecha);
    day = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(dateObj);
    time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(dateObj);
  }

  const isAuthor = currentUser?.uid === data?.autorId;
  const isJoined = data?.interesados?.includes(currentUser?.uid);
  const interesadosCount = data?.interesados?.length || 0;

  const handleAction = () => {
    if (!currentUser) return alert('Debes iniciar sesión para hacer esto');
    if (isAuthor) {
      if(confirm('¿Seguro que quieres borrar tu petición?')) onDelete(data.id);
    } else {
      onJoin(data.id, currentUser.uid, isJoined);
    }
  };

  return (
    <div className={styles.ticket}>
      <div className={styles.dateColumn}>
        <span className={styles.day}>{day}</span>
        <span className={styles.time}>{time}</span>
      </div>
      
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.user}>{data?.autorNombre || 'Usuario'}</span>
          {interesadosCount > 0 && (
            <span className={styles.interesadosBadge}>{interesadosCount} apuntados</span>
          )}
        </div>
        
        <p className={styles.message}>"{data?.mensaje}"</p>
        
        <div className={styles.bottomRow}>
          <span className={styles.place}>
            <MapPin size={14} />
            {data?.rocodromoNombre || 'Rocódromo'}
          </span>
          
          <button 
            className={`${styles.actionBtn} ${isAuthor ? styles.deleteBtn : isJoined ? styles.joinedBtn : styles.joinBtn}`} 
            onClick={handleAction}
          >
            {isAuthor ? (
              <><Trash2 size={16} /> Borrar</>
            ) : isJoined ? (
              <><UserCheck size={16} /> Apuntado</>
            ) : (
              <><UserPlus size={16} /> Apuntarme</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}