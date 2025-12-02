import { Button } from 'antd'
import classes from './ErrorPage.module.scss'
import { MehOutlined } from '@ant-design/icons'
import { t } from 'i18next'

export const ErrorPage = () => {
    return (
        <div className={classes.container}>
            <div className={classes.error}>
                <div className={classes.icon}>
                    <MehOutlined style={{color: '#ffffffce'}}/>
                    </div>
                <div className={classes.label} style={{color: '#ffffffce'}}>
                    {t('Something went wrong!')}
                </div>
                <Button onClick={() => window.location.reload()}>{t('Reload page')}</Button>
            </div>
        </div>
    )
}