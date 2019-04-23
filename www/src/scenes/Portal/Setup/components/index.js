/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Background from '../../../../components/Background/index';
import Modal from '../../../../components/Modal/index';
import SetupService from '../../../../services/Api/SetupService';
import { setSetting } from '../../../../actions/settings';
import '../style/index.css';

class Setup extends Component {
  constructor() {
    super();
    this.setupService = new SetupService();
  }

  state = {
    password: null,
    confirmPassword: null,
    email: null,
    firstName: null,
    lastName: null,
    errorPass: false,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }


  handleSubmit = (e) => {
    e.preventDefault();

    const {
      password, confirmPassword, email, lastName, firstName,
    } = this.state;

    const { history, setSetting } = this.props;

    if (password !== confirmPassword) {
      this.setState({
        errorPass: true,
      });
      return;
    }
    this.setupService.setup(email, password, lastName, firstName)
      .then(() => {
        setSetting('setup', true);
        history.replace('/panel');
      });
  }

  render() {
    const { errorPass } = this.state;
    const { t } = this.props;
    return (
      <div>
        <Background>
          <Modal height="inherit">
            <div className="listfiles">
              <div className="list-title pb-0">{t('panel.setup.setup')}</div>
              <div className="setup-description text-muted">
                {t('panel.setup.explanation')}
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="list-container" style={{ height: '280px' }}>
                  <div className="list-body setup-body">
                    <div className="container-fluid p-0">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-group-sm">
                            <label htmlFor="firstName" className="setup-label">{t('panel.setup.firstName')}</label>
                            <input type="text" className="form-control" id="firstName" placeholder="John" required onChange={this.handleChange} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-group-sm ">
                            <label className="setup-label" htmlFor="lastName">{t('panel.setup.lastName')}</label>
                            <input type="text" className="form-control" id="lastName" placeholder="Smith" required onChange={this.handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="input-group-sm pt-1">
                      <label className="setup-label" htmlFor="email">{t('panel.setup.email')}</label>
                      <input type="email" className="form-control" id="email" placeholder="my@email.com" required onChange={this.handleChange} />
                    </div>
                    <div className="container-fluid p-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="input-group-sm pt-1 ">
                            <label className="setup-label" htmlFor="password">{t('panel.setup.password')}</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required onChange={this.handleChange} />
                            <small id="passwordHelp" className="form-text text-muted">{t('panel.setup.min')}</small>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="input-group-sm pt-1">
                            <label className="setup-label" htmlFor="confirmPassword">{t('panel.setup.passwordConfirm')}</label>
                            <input type="password" className="form-control" id="confirmPassword" required placeholder="Confirm password" onChange={this.handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {errorPass === true
                      && (
                        <div className="setup-password-error">
                          {' '}
                          {t('panel.setup.passwordErr')}
                        </div>
                      )
                    }
                  </div>
                </div>
                <div className="list-footer">
                  <button type="submit" className="btn blue-btn">{t('panel.setup.setupBtn')}</button>
                </div>
              </form>
            </div>
          </Modal>
        </Background>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSetting: (name, value) => { dispatch(setSetting(name, value)); },
});

Setup.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  setSetting: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(withTranslation()(Setup));
