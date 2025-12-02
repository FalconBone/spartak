import { useTranslation } from "react-i18next";

export const FinancesHeader = () => {
    
    const { t, i18n } = useTranslation();

    return (
        <h1>
            {t('Finances')}
        </h1>
    )
}