import React, { ReactNode, CSSProperties, MouseEvent } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const modalStyle: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const backdropStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 500,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  // Stop scrolling on the main window while the modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <div style={backdropStyle} onClick={onClose} />
      <div style={modalStyle}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
};

export default Modal;
