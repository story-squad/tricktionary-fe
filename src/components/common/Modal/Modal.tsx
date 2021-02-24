import React from 'react';

const Modal = (props: ModalProps): React.ReactElement => {
  const { visible, message, header, handleConfirm, handleCancel } = props;

  return (
    <>
      {visible && (
        <>
          <div className="modal">
            <div className="modal-content">
              <h2>{header}</h2>
              <p>{message}</p>
              <div className="modal-buttons">
                <button onClick={handleConfirm}>Okay</button>
                {handleCancel ? (
                  <button onClick={handleCancel}>Cancel</button>
                ) : (
                  <button disabled>Cancel</button>
                )}
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
  header: string;
  handleConfirm: () => void | (() => (args: unknown) => void);
  handleCancel?: () => void | (() => (args: unknown) => void);
}
