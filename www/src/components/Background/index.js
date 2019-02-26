import React from 'react';
import ReactFlagsSelect from '../FlagsSelect';
import { useTranslation } from 'react-i18next';


const backgroundStyle = {
    backgroundImage: `url('https://source.unsplash.com/random/1600x900')`,
    height: '100vh',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative'
}

const Background = (props) => {
        const { i18n } = useTranslation();

    const onSelectFlag = (countryCode) => {
        i18n.changeLanguage(countryCode);
    }

    
   const currLang = i18n.language.split('-')[0].toUpperCase()

   console.log(currLang)

    
    return (
        <div style={backgroundStyle} className="background">
            <div className="d-flex flex-column align-items-center" style={{padding: "10px 16px 0 16px"}}>
            <div className="menu"><ReactFlagsSelect
                        countries={["EN", "RU"]} selectedSize={14} optionsSize={12}  defaultCountry={currLang}  placeholder="Select Language"  onSelect={onSelectFlag}  /></div>
        
                 <div className="logo-blue">upload<b className="logo-white">express</b></div>
                  {props.children}
            </div>
            

            </div>

    )
}

export default Background