import React, { Component } from 'react'
import Navbar from '../../../../components/Navbar';
import '../../style/index.css';
import { withTranslation } from 'react-i18next';

class Settings extends Component {
    render() {
      const { t } = this.props;
        return (
            <div>
               <Navbar/>
               <div className="container">
                   <div className="row">
                       <div className="col-12 d-flex justify-content-between mt-4">
                         <div className="container-name">{t('panel.settings.administration')}</div>
                         <button className="btn btn-pannel">{t('panel.settings.save')}</button>
                       </div> 
                   </div>
               </div>
               <div className="container">
                   <div className="row">
                       <div className="col-12">
                       <div className="settings-section">{t('panel.settings.pageStyling')}</div>
                       <hr className='ordinary-hr'/>
                       </div>
                   </div>
               </div>
         
               <div className="container">
                   <div className="row">
                       <div className="col-md-7">
                         <div className="settings-title">{t('panel.settings.title')}</div>
                         <div className="settings-subtitle">{t('panel.settings.titleDescription')}</div>
                         <div className="settings-input-container">
                           <input type="text" className="form-control settings-input" placeholder="Gaspal"></input>
                           <div className="settings-input-description">{t('panel.settings.companyName')}</div>
                         </div>
                         <div className="settings-input-container">
                             <input type="text" className="form-control" placeholder="The app that lets you find the cheapest gas station around you"/>
                             <div className="settings-input-description">{t('panel.settings.companyDescription')}</div>
                         </div>
                       </div>
                       <div className="col-md-5"></div>
                   </div>
               </div>


               <div className="container">
                   <div className="row">
                       <div className="col-12">
                         <div className="settings-section">{t('panel.settings.identity')}</div>
                         <hr className='ordinary-hr'/>
                       </div>
                   </div>
               </div>

               <div className="container">
                   <div className="row">
                       <div className="col-12 d-flex justify-content-between">
                           <div>
                             <div className="settings-title">{t('panel.settings.backgroundImage')}</div>
                             <div className="settings-subtitle">{t('panel.settings.backgroundDescription')}</div>
                           </div>
                           <button className="btn btn-pannel-grey">{t('panel.settings.upload')}</button>

                       </div>
                   </div>
               </div>

               <div className="container">
                   <div className="row">
                       <div className="col-md-7">
                         <div className="settings-title">{t('panel.settings.socialAccounts')}</div>
                         <div className="settings-subtitle">{t('panel.settings.links')}</div>
                         <div className="settings-input-container">
                           <input type="text" className="form-control settings-input" placeholder="https://www.facebook.com/gaspalFR"></input>
                           <div className="settings-input-description">{t('panel.settings.urlFacebook')}</div>
                         </div>
                         <div className="settings-input-container">
                           <input type="text" className="form-control settings-input" placeholder="https://www.twitter.com/gaspalFR"></input>
                           <div className="settings-input-description">{t('panel.settings.urlTweeter')}</div>
                         </div>
                         <div className="settings-input-container">
                           <input type="text" className="form-control settings-input" placeholder="https://www.instagram.com/gaspalFR"></input>
                           <div className="settings-input-description">{t('panel.settings.urlInstagram')}</div>
                         </div>


                       </div>
                   </div>
               </div>



             </div>

        )
    }
}

export default withTranslation()(Settings)