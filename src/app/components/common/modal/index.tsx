import React, { ReactNode, CSSProperties, MouseEvent } from 'react';
export { modalStyle, backdropStyle, titleStyle, closeButtonStyle };


interface ModalProps {
  children: ReactNode;
  onClose: (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  className?: string;

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
  width: 'auto', // Allows the modal to size width dynamically up to maxWidth
  maxWidth: '500px', // Max width to manage modal sizing
  maxHeight: '80vh', // Reduce the max height to provide padding within the viewport
  overflowY: 'auto', // Ensure the content can scroll
  display: 'flex',
  flexDirection: 'column', // Stack children vertically
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

const titleStyle: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#1a202c', // Blue-900
};

const closeButtonStyle: CSSProperties = {
  backgroundColor: '#f97316', // Orange-600
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
};


const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
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
        <button onClick={onClose}></button>
      </div>
    </>
  );
};

export default Modal;
