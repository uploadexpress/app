import React from 'react';
import { useTranslation } from 'react-i18next';
import ImgOops from '../../img/img-oops.svg';

const Oops = () => {
  const { t } = useTranslation();

  return (
    <div className="listfiles">
      <div className="list-title">{t('download.oops.header')}</div>
      <hr />
      <div className="list-container">
        <div className="list-body">
          <div className="list-container text-center">
            <img width={100} src={ImgOops} alt="" />
            <div className="oops-title">{t('download.oops.title')}</div>
            <div className="oops-subtitle">{t('download.oops.subtitle')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oops;
