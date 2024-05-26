"use client";
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import global_es from "./translations/es/global.json";
import global_en from "./translations/en/global.json";

// Initialize i18next
i18next.use(initReactI18next).init({
    lng: 'es',
    resources: {
        es: {global: global_es},
        en: {global: global_en},
    },
});

export default function ClientI18nextProvider({children}) {
    return (
        <I18nextProvider i18n={i18next}>
            {children}
        </I18nextProvider>
    );
}
