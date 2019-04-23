import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../../services/Api/AuthService';

const withAuth = (AuthComponent) => {
  const Auth = new AuthService();
  return class AuthWrapped extends Component {
    static propTypes = {
      history: PropTypes.shape({}).isRequired,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]).isRequired,
    }

    constructor() {
      super();
      this.state = {
        user: null,
      };
    }

    componentWillMount = () => {
      const { history } = this.props;
      if (!Auth.loggedIn()) {
        history.replace('/panel/signin');
      } else {
        try {
          const profile = Auth.getProfile();
          this.setState({
            user: profile,
          });
        } catch (err) {
          Auth.logout();
          history.replace('/panel/signin');
        }
      }
    }

    render() {
      const { user } = this.state;
      const { history, children } = this.props;

      if (user) {
        return (
          <AuthComponent {...this.props} history={history} user={user}>
            {children}
          </AuthComponent>
        );
      }

      return null;
    }
  };
};

export default withAuth;
