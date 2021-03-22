import React from 'react';

const Modal = (props: ModalProps): React.ReactElement => {
  const {
    visible,
    message,
    header,
    handleConfirm,
    handleCancel,
    customConfirmText,
    customCancelText,
    zIndex,
  } = props;
  // If zIndex is defined, update inline style
  const inlineZIndex = zIndex !== undefined ? { zIndex } : {};

  return (
    <>
      {visible && (
        <>
          <div className="modal" style={inlineZIndex}>
            <div className="modal-content">
              <h2>{header}</h2>
              <p>{message}</p>
              <div className="modal-buttons">
                <button onClick={handleConfirm} autoFocus={true}>
                  {customConfirmText ? customConfirmText : 'Okay'}
                </button>
                {handleCancel && (
                  <button onClick={handleCancel}>
                    {customCancelText ? customCancelText : 'Cancel'}
                  </button>
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
  zIndex?: number;
  handleConfirm: () => void | (() => (args: unknown) => void);
  handleCancel?: () => void | (() => (args: unknown) => void);
  customConfirmText?: string;
  customCancelText?: string;
}
