import ConvertKitForm from 'convertkit-react';
import React from 'react';
const convertKitConfig = {
  className: 'ck-fm',
  formId: 2074215,
  showLabels: false,
  emailPlaceholder: 'ilovestorysquad@gmail.com',
  hideName: true,
  newTab: true,
  submitText: 'Stay in touch',
};

const EmailCollectionForm = (): React.ReactElement => {
  return (
    <div className="email-collection">
      <ConvertKitForm {...convertKitConfig} />
    </div>
  );
};

export default EmailCollectionForm;
