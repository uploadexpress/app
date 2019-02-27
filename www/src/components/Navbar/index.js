import React from 'react';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = (props) => {
    const { t } = useTranslation();

    const handleLogout = () => {
        props.handleLogout()
    }
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-ue ">
            <Link to='/panel' className="navbar-brand">Company name</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to='/panel' className="nav-link" >{t('navbar.uploads')}</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <div className="nav-link dropdown-toggle cursor" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {`${props.user.first_name} ${props.user.last_name}`}
                        </div>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <Link className="dropdown-item" to='/panel/settings'>Settings</Link>
                            <button type="button" className="form-submit dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar