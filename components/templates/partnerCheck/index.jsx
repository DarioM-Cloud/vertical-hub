import styles from './partnerCheck.module.scss';

export default function PartnerCheck() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1>Partner Check</h1>
          <p>Encuentra compañero de cordada para hoy</p>
        </div>
        <button className={styles.btnAction}>Crear Anuncio</button>
      </header>

      <main className={styles.board}>
        {/* Huecos para las tarjetas de búsqueda de compañero */}
        <div className={styles.ticketPlaceholder}>
          <p>Hueco para TicketPartner (Usuario, Nivel, Fecha)</p>
        </div>
        <div className={styles.ticketPlaceholder}>
          <p>Hueco para TicketPartner (Usuario, Nivel, Fecha)</p>
        </div>
        <div className={styles.ticketPlaceholder}>
          <p>Hueco para TicketPartner (Usuario, Nivel, Fecha)</p>
        </div>
      </main>
    </div>
  );
}