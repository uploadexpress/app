import React, { Component } from 'react'
import Background from '../../../../components/Background/index'
import Modal from '../../../../components/Modal/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../style/index.css'
import AuthService from '../../../../services/Api/AuthService'

class SignIn extends Component {

    constructor(){
        super();
        this.Auth = new AuthService();
    }



    state = {
        password: null,
        email: null,
        error: false
    }



    handleChange = (e) => {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
      
        this.Auth.login(this.state.email,this.state.password)
            .then(res =>{
               this.props.history.replace('/panel');
            })
            .catch(err =>{
                this.setState({
                    error: true
                })
            })
    }

    componentWillMount(){
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    

    render() {
        return (
            <div>
                <Background>
                    <Modal height={"auto"}>
                        <div className="listfiles">
                            <div className="list-title">Sign in</div>
                            <hr />
                            <form onSubmit = {this.handleFormSubmit}>
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
                                            <input type="password" className="form-control password-input" name="password" placeholder="Password" aria-label="Password" onChange={this.handleChange} />
                                            <div className="input-group-append">
                                                <button className="btn btn-forgot " type="button">Forgot?</button>
                                            </div>
                                        </div>
                                        {this.state.error === true &&
                                    <div className="error-message">Wrong email or password!</div>}
                                    </div>
                                </div>
                                <div className="list-footer">
                                
                                    <button type="submit" className="btn blue-btn">Log in</button>
                                </div>

                            </form>
                        </div>

                    </Modal>
                </Background>
            </div>

        )
    }
}

export default SignIn
