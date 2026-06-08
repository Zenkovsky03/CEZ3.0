import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const isPolish = i18n.language?.startsWith('pl');

    return (
        <button
            className="lang-switcher"
            onClick={() => i18n.changeLanguage(isPolish ? 'en' : 'pl')}
            title={isPolish ? 'English' : 'Polski'}
        >
            {isPolish ? 'PL' : 'EN'}
        </button>
    );
};

export default LanguageSwitcher;
