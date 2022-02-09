import React, { useState } from 'react';
import { Modal } from '..';
import { getRandomFromArray } from '../../../utils/helpers/commonHelpers';
import proTips from '../../../utils/text/proTips.json';

const ProTip = (props: ProTipProps): React.ReactElement => {
  const [openModal, setOpenModal] = useState(false);

  // Display custom message if defined or random message
  const [tipMessage] = useState(
    () => props.message || getRandomFromArray(proTips),
  );

  //* Open the ProTip Modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <button className="pro-tip-btn" onClick={handleOpenModal}>
        Read Pro-Tip
      </button>
      <Modal
        header={'Pro-Tip'}
        message={tipMessage}
        visible={openModal}
        handleConfirm={() => setOpenModal(false)}
      />
    </>
  );
};

export default ProTip;

interface ProTipProps {
  message?: string;
}
