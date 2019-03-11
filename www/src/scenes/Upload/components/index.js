import React from 'react'
import Background from '../../../components/Background';
import UploadModal from '../../../components/UploadModal/components';

const Upload = () => {
    return(
        <Background>
            <UploadModal public={true}/> 
        </Background>
    )
}

export default Upload