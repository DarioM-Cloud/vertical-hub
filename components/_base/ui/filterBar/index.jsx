import { Search } from 'lucide-react';
import styles from './filterBar.module.scss';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedUbicacion,
  onUbicacionChange,
  ubicacionesUnicas,
  selectedModalidad,
  onModalidadChange,
  selectedServicio,
  onServicioChange
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.selectorsGroup}>
        <div className={styles.selectWrapper}>
          <select 
            value={selectedUbicacion} 
            onChange={(e) => onUbicacionChange(e.target.value)}
            className={styles.selectControl}
          >
            <option value="">Todas las ubicaciones</option>
            {ubicacionesUnicas.map(ub => (
              <option key={ub} value={ub}>{ub}</option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <select 
            value={selectedModalidad} 
            onChange={(e) => onModalidadChange(e.target.value)}
            className={styles.selectControl}
          >
            <option value="">Todas las modalidades</option>
            <option value="boulder">Sólo Boulder</option>
            <option value="vias">Vías de cuerda</option>
            <option value="velocidad">Muro de Velocidad</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <select 
            value={selectedServicio} 
            onChange={(e) => onServicioChange(e.target.value)}
            className={styles.selectControl}
          >
            <option value="">Cualquier servicio</option>
            <option value="cafeteria">Cafetería</option>
            <option value="parking">Parking propio</option>
            <option value="tienda">Tienda de material</option>
            <option value="gimnasio">Zona de musculación</option>
            <option value="zonachill">Zona Chill Out</option>
          </select>
        </div>
      </div>
    </div>
  );
}