import React, { Component } from 'react'
import AuthService from '../../../../services/Api/AuthService'

const withAuth = (AuthComponent) => {
    const Auth = new AuthService();
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null
            }
        }
        componentWillMount = () => {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/panel/signin')
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    this.setState({
                        user: profile
                    })
                }
                catch (err) {
                    Auth.logout()
                    this.props.history.replace('/panel/signin')
                }
            }
        }
        render() {
            if (this.state.user) {
                return (
                    <AuthComponent {...this.props} history={this.props.history} user={this.state.user}>
                        {this.props.children}
                    </AuthComponent>
                )
            }
            else {
                return null
            }
        }
    }
}

export default withAuth
