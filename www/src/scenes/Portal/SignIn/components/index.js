import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SignInModal from '../../../../components/SignInModal';
import Background from '../../../../components/Background/index';

const SignInScene = (props) => {
  const { history } = props;
  return (
    <Background>
      <SignInModal history={history} />
    </Background>
  );
};

SignInScene.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

export default withTranslation()(SignInScene);
