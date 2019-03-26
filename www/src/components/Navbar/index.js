import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const Navbar = (props) => {
  const { t } = useTranslation();
  const { settings, user } = props;

  const handleLogout = () => {
    const { handleLogout } = props;
    handleLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-ue ">
      <Link to="/panel" className="navbar-brand">{settings.name}</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/panel" className="nav-link text-white">{t('navbar.uploads')}</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/panel/settings">{t('navbar.settings')}</Link>
          </li>
          <li className="nav-item dropdown">
            <div className="nav-link text-white dropdown-toggle cursor" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {`${user.first_name} ${user.last_name}`}
            </div>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <button type="button" className="form-submit dropdown-item" onClick={handleLogout}>{t('navbar.logout')}</button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapStateToProps = state => ({
  settings: state.settings,
});

Navbar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  settings: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(Navbar);
