import { useLoginMutation } from "@entities/user";
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import classes from './LoginForm.module.scss'
import { constantsMap } from "@shared/model";
import type { LoginResponceData } from "@entities/user/model/types";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type Inputs = {
    login: string,
    password: string
}

export const LoginForm = () => {

    const navigate = useNavigate();

    const [login, { isLoading: isLoadingLogin, isError, error }] = useLoginMutation();
    const [loginError, isLoginError] = useState<boolean>(false)

    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        watch
    } = useForm<Inputs>()

    const onSumbit: SubmitHandler<Inputs> = async (formData) => {
        try {
            const payloadFromLogin = await login({ name: formData.login, password: formData.password }).unwrap();
            saveUserDataToLocalStorage(payloadFromLogin)
            navigate('/partners')
            
        } catch (e) {
            console.log('Something went wrong', e)
            
        }
    }

    const saveUserDataToLocalStorage = (payload: LoginResponceData) => {
        localStorage.setItem('token', payload.token.token)
        localStorage.setItem('name', payload.user.name)
        localStorage.setItem('roles', JSON.stringify(payload.user.teams))

        if (payload?.partner?.id) {
            localStorage.setItem('partner_id', String(payload.partner.id))
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSumbit)} className={classes.container} style={{ backgroundColor: '#262626' }}>
                <h1>{t('Login')}</h1>
                <div className={classes.inputs}>
                    
                    <input {...register("login")} placeholder={t('Username')} />
                    <input {...register("password")} type="password" placeholder={t('Password')} />
                    <Button htmlType="submit" disabled={isLoadingLogin || watch("login") === '' || watch("password") === '' ? true : false}>{t('Login')}</Button>
                    {
                        isError ? (
                            <div className={classes.error}>
                                {t('WrongLoginOrPassword')}
                            </div>
                        ) : ''
                    }
                </div>
            </form>
        </>

    )
}