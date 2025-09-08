import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div data-cy='modal-overlay' className={styles.overlay} onClick={onClick} />
);
