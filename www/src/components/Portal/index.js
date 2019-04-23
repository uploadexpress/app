import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../Navbar';
import AuthService from '../../services/Api/AuthService';
import withAuth from '../WithAuth';

const Portal = (props) => {
  const Auth = new AuthService();

  const handleLogout = () => {
    const { history } = props;
    Auth.logout();
    history.replace('/panel/signin');
  };

  const { user, children } = props;

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      {children}
    </div>
  );
};

Portal.propTypes = {
  history: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default withAuth(Portal);
