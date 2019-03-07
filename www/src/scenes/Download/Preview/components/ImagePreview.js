import React, { Component } from 'react';
import '../style/index.css';
import ImgSelected from '../../../../img/img-preview-selected.svg';

class ImagePreview extends Component {

    state = {
        selected: false
    }

    onSelect = () => {
        this.setState({
            selected: !this.state.selected
        })
    }

    render() {
        return (
            <div className="preview-container">
                <img 
                    className={this.state.selected ? 'preview-img selected' : 'preview-img'}
                    onClick={this.onSelect} src={this.props.previewUrl}
                    alt="" />
                { this.state.selected &&
                    <div className="preview-selected-img">
                        <img width={20} height={20} src={ImgSelected} alt="" />
                    </div>
                }
            </div>
        )
    }
}



export default ImagePreview