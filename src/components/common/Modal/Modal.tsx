import React from 'react';

const Modal = (props: ModalProps): React.ReactElement => {
  const { visible, message, handleConfirm, handleCancel } = props;

  return (
    <>
      {visible && (
        <>
          <div className="modal">
            <div className="modal-content">
              <h2>Before you go...</h2>
              <p>{message}</p>
              <div className="modal-buttons">
                <button onClick={handleConfirm}>Okay</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
          <div className="modal-overlay"></div>
        </>
      )}
    </>
  );
};

export default Modal;

interface ModalProps {
  visible: boolean;
  message: string;
  handleConfirm: () => void | (() => (args: unknown) => void);
  handleCancel: () => void | (() => (args: unknown) => void);
}
