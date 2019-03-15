import React, { Component } from 'react'
import Background from '../../../../components/Background/index'
import Modal from '../../../../components/Modal/index'
import '../style/index.css'
import { withTranslation } from 'react-i18next';
import SetupService from '../../../../services/Api/SetupService'

class Setup extends Component {
    constructor() {
        super();
        this.setupService = new SetupService();
    }

    state = {
        password: null,
        confirm_password: null,
        email: null,
        first_name: null,
        last_name: null,
        errorPass: false
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }



    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.confirm_password) {
            this.setState({
                errorPass: true
            })
            return
        }
        this.setupService.setup(this.state.email, this.state.password, this.state.last_name, this.state.first_name)
            .then(res => {
                this.props.history.replace('/panel');
            })
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <Background>
                    <Modal height={426} >
                        <div className="listfiles">
                            <div className="list-title">{t('panel.setup.setup')}</div>
                            <hr />
                            <form onSubmit={this.handleSubmit}>
                                <div className="list-container">
                                    <div className="list-body setup-body">
                                        <div className="container-fluid p-0">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div class="input-group-sm">
                                                        <label className="setup-label" for="first-name">{t('panel.setup.firstName')}</label>
                                                        <input type="text" class="form-control" id="first_name" placeholder="John" required onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div class="input-group-sm ">
                                                        <label className="setup-label" for="last-name">{t('panel.setup.lastName')}</label>
                                                        <input type="text" class="form-control" id="last_name" placeholder="Smith" required onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="input-group-sm pt-1">
                                            <label className="setup-label" for="email">{t('panel.setup.email')}</label>
                                            <input type="email" class="form-control" id="email" placeholder="my@email.com" required onChange={this.handleChange} />
                                        </div>
                                        <div className="container-fluid p-0">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div class="input-group-sm pt-1 ">
                                                        <label className="setup-label" for="password">{t('panel.setup.password')}</label>
                                                        <input type="password" class="form-control" id="password" placeholder="Password" required onChange={this.handleChange} />
                                                        <small id="passwordHelp" class="form-text text-muted">{t('panel.setup.min')}</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div class="input-group-sm pt-1">
                                                        <label className="setup-label" for="confirm_password">{t('panel.setup.passwordConfirm')}</label>
                                                        <input type="password" class="form-control" id="confirm_password" required placeholder="Confirm password" onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.errorPass === true &&
                                            <div className="setup-password-error"> {t('panel.setup.passwordErr')}</div>
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

        )


    }
}




export default withTranslation()(Setup);