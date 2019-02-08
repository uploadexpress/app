import React, { Component } from 'react';
import Background from '../../../components/Background/index'
import Modal from '../../../components/Modal/index'
import Dropfile from './Dropfile'
import Listfiles from './Listfiles'

class Upload extends Component {

    state = {
        files: []
    }


    onFilesSelected = (files) => {
        this.setState({ files: files })
    }

    render() {
        return (
            <Background>
                <Modal>
                    {this.state.files.length !== 0 ?
                        <Listfiles />
                        : <Dropfile onFilesSelected={this.onFilesSelected} />}
                </Modal>
            </Background>
        )
    }
}

export default Upload


