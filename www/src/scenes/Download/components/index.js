import React, { Component } from 'react';
import Background from '../../../components/Background/index'
import Modal from '../../../components/Modal/index'


class Download extends Component{
    state = {
        files: []
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        console.log(id)

    }

    render(){
        return(
            <Background>
                <Modal>
                  <div>Hello</div>  
                </Modal>
            </Background>
        )
    }
}

export default Download