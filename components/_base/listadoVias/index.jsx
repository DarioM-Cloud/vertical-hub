'use client';

import { useState } from 'react';
import { Route, CheckCircle2, Filter, Hammer, XCircle } from 'lucide-react';
import Button from '@/components/_base/ui/button';
import styles from './listadoVias.module.scss';

export default function ListadoVias({ vias, onOpenModal }) {
  const [filtroGrado, setFiltroGrado] = useState('');
  const [filtroColor, setFiltroColor] = useState('');
  const [filtroSector, setFiltroSector] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const ordenColores = ['Verde', 'Amarillo', 'Azul', 'Rojo', 'Negro', 'Blanco'];

  const getStatusLabel = (estado) => {
    const est = estado?.toLowerCase() || '';
    if (est === 'proyecto' || est === 'equipando' || est === 'en equipamiento') {
      return 'Equipando';
    }
    if (est === 'desequipada') {
      return 'Desequipada';
    }
    return 'Abierta';
  };

  const getStatusIcon = (label) => {
    if (label === 'Equipando') return <Hammer size={14} />;
    if (label === 'Desequipada') return <XCircle size={14} />;
    return <CheckCircle2 size={14} />;
  };

  const gradosDisponibles = [...new Set(vias.map(v => v.grado))].sort();
  const sectoresDisponibles = [...new Set(vias.map(v => v.sector))].sort();
  const estadosDisponibles = [...new Set(vias.map(v => getStatusLabel(v.estado)))].sort();
  
  const coloresDisponibles = [...new Set(vias.map(v => v.colorNombre))]
    .filter(Boolean)
    .sort((a, b) => {
      const indexA = ordenColores.indexOf(a);
      const indexB = ordenColores.indexOf(b);
      
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });

  const viasFiltradas = vias.filter(via => {
    const coincideGrado = filtroGrado ? via.grado === filtroGrado : true;
    const coincideColor = filtroColor ? via.colorNombre === filtroColor : true;
    const coincideSector = filtroSector ? via.sector === filtroSector : true;
    const coincideEstado = filtroEstado ? getStatusLabel(via.estado) === filtroEstado : true;
    return coincideGrado && coincideColor && coincideSector && coincideEstado;
  });

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <Route size={20} />
        <h2>Vías Actuales</h2>
      </div>
      
      <div className={styles.legendContainer}>
        <span className={styles.legendTitle}>Circuitos:</span>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#10b981'}}></div><span>Iniciación</span></div>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#f59e0b'}}></div><span>Fácil</span></div>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#3b82f6'}}></div><span>Medio</span></div>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#ef4444'}}></div><span>Difícil</span></div>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#0f172a'}}></div><span>Experto</span></div>
          <div className={styles.legendItem}><div className={styles.legendColor} style={{background: '#ffffff', border: '1px solid #cbd5e1'}}></div><span>Pro</span></div>
        </div>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select 
            className={styles.filterSelect} 
            value={filtroGrado} 
            onChange={(e) => setFiltroGrado(e.target.value)}
          >
            <option value="">Todos los grados</option>
            {gradosDisponibles.map(grado => (
              <option key={grado} value={grado}>{grado}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select 
            className={styles.filterSelect} 
            value={filtroColor} 
            onChange={(e) => setFiltroColor(e.target.value)}
          >
            <option value="">Todos los colores</option>
            {coloresDisponibles.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select 
            className={styles.filterSelect} 
            value={filtroSector} 
            onChange={(e) => setFiltroSector(e.target.value)}
          >
            <option value="">Todos los sectores</option>
            {sectoresDisponibles.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select 
            className={styles.filterSelect} 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.viasGrid}>
        {viasFiltradas.length === 0 ? (
          <div className={styles.emptyAvisos}>No se han encontrado vías con estos filtros.</div>
        ) : (
          viasFiltradas.map((via) => {
            const label = getStatusLabel(via.estado);
            const estadoClase = label === 'Equipando' ? 'equipamiento' : label === 'Desequipada' ? 'desequipada' : 'abierta';

            return (
              <div key={via.id} className={`${styles.viaCard} ${styles[estadoClase]}`}>
                <div className={styles.viaHeader}>
                  <div className={styles.viaColorCircle} style={{ backgroundColor: via.colorHex || '#cbd5e1', border: via.colorHex === '#ffffff' ? '1px solid #cbd5e1' : 'none' }}></div>
                  <span className={styles.viaGrade}>{via.grado}</span>
                </div>
                <div className={styles.viaInfo}>
                  <h3>{via.nombre}</h3>
                  <span>{via.sector}</span>
                </div>

                <div className={styles.viaFooter}>
                  <span className={`${styles.statusBadge} ${styles[estadoClase]}`}>
                    {getStatusIcon(label)}
                    {label}
                  </span>
                  
                  {onOpenModal && (
                    <Button 
                      variant="outline" 
                      className={styles.viaBtn} 
                      onClick={() => onOpenModal(via)}
                      disabled={label === 'Desequipada' || label === 'Equipando'}
                    >
                      <CheckCircle2 size={16} />
                      Hecha
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}