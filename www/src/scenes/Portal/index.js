import Navbar from "../../components/Navbar";
import React from 'react';
import AuthService from '../../services/Api/AuthService'
import withAuth from  '../Portal/SignIn/components/withAuth'


const Portal = (props) => {
    const Auth = new AuthService();

    const handleLogout = () => {
        Auth.logout()
        props.history.replace('/panel/signin');
    }

    return (
        <div>
            <Navbar user={props.user} handleLogout={handleLogout}/>
            {props.children}
        </div>
    )
}

export default withAuth(Portal)