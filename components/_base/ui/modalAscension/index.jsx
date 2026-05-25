import Modal from '@/components/_base/ui/modal';
import Button from '@/components/_base/ui/button';
import styles from './modalAscension.module.scss';

export default function ModalAscension({ 
  isOpen, 
  onClose, 
  rocodromo, 
  selectedVia, 
  estiloAscenso, 
  setEstiloAscenso, 
  intentos, 
  setIntentos, 
  onSave, 
  submitting 
}) {
  if (!selectedVia) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Ascensión">
      <div className={styles.logForm}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label>Rocódromo</label>
            <input type="text" value={rocodromo.nombre} disabled className={styles.inputDisabled} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label>Vía / Bloque</label>
            <input type="text" value={selectedVia.nombre} disabled className={styles.inputDisabled} />
          </div>
          <div className={styles.inputGroup}>
            <label>Dificultad</label>
            <input type="text" value={selectedVia.grado} disabled className={styles.inputDisabled} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label>Estilo de ascenso</label>
            <select value={estiloAscenso} onChange={(e) => setEstiloAscenso(e.target.value)} className={styles.selectActive}>
              <option value="a vista">A vista (Primer intento sin info)</option>
              <option value="flash">Flash (Primer intento con info)</option>
              <option value="pegues">Al pegue (Ensayo previo)</option>
            </select>
          </div>
          {estiloAscenso === 'pegues' && (
            <div className={styles.inputGroup}>
              <label>Número de pegues</label>
              <input 
                type="number" 
                min="2" 
                value={intentos} 
                onChange={(e) => setIntentos(Number(e.target.value))}
                className={styles.inputActive}
              />
            </div>
          )}
        </div>

        <Button 
          variant="primary" 
          onClick={onSave} 
          disabled={submitting}
          style={{ width: '100%', marginTop: '16px' }}
        >
          {submitting ? 'Guardando...' : 'Guardar en mi Logbook'}
        </Button>
      </div>
    </Modal>
  );
}