import React, { Component } from 'react'
import Navbar from '../../../../components/Navbar';

class Settings extends Component {
    render() {
        return (
            <div>
               <Navbar/>
               <div>Download page styling</div>
               <hr/>
               <div className="container">
                   <div className="row">
                       <div className="col-md-8">
                         <div className="settings-title">Title & description</div>
                         <div className="settings-subtitle">The information that will appear on the download page.</div>
                         <input type="text" className="form-control"></input>
                       </div>
                   </div>
               </div>
             </div>

        )
    }
}

export default Settings