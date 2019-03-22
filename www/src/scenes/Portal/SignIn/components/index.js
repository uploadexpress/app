import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Background from '../../../../components/Background/index';
import Modal from '../../../../components/Modal/index';
import AuthService from '../../../../services/Api/AuthService';
import '../style/index.css';

class SignIn extends Component {
  constructor() {
    super();
    this.auth = new AuthService();
  }

  state = {
    password: null,
    email: null,
    error: false,
  }

  componentWillMount() {
    const { history } = this.props;
    if (this.auth.loggedIn()) {
      history.replace('/');
    }
  }

  handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
    );
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    const { history } = this.props;

    this.auth.login(email, password).then(() => {
      history.replace('/panel');
    }).catch(() => {
      this.setState({
        error: true,
      });
    });
  }

  render() {
    const { t } = this.props;
    const { error } = this.state;
    return (
      <div>
        <Background>
          <Modal height="auto">
            <div className="listfiles">
              <div className="list-title">{t('panel.signin.signin')}</div>
              <hr />
              <form onSubmit={this.handleFormSubmit}>
                <div className="list-container">
                  <div className="list-body">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-img">
                          <FontAwesomeIcon icon="envelope" />
                        </span>
                      </div>
                      <input type="text" className="form-control" placeholder="Email" name="email" aria-label="Email" onChange={this.handleChange} />
                    </div>
                    <div className="input-group mt-4">
                      <div className="input-group-prepend">
                        <span className="input-group-text input-img">
                          <FontAwesomeIcon icon="key" />
                        </span>
                      </div>
                      <input type="password" className="form-control" name="password" placeholder="Password" aria-label="Password" onChange={this.handleChange} />
                    </div>
                    {error === true
                      && <div className="error-message">{t('panel.signin.error')}</div>}
                  </div>
                </div>
                <div className="list-footer">
                  <button type="submit" className="btn blue-btn">{t('panel.signin.login')}</button>
                </div>
              </form>
            </div>
          </Modal>
        </Background>
      </div>
    );
  }
}

SignIn.propTypes = {
  history: PropTypes.shape({}).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SignIn);
