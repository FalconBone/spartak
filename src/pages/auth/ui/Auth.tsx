import { constantsMap } from "@shared/model"
import { LoginForm } from "@widgets/login"
import classes from './Auth.module.scss'

export const AuthPage = () => {

    return (
        <div className={classes.container}>
            <LoginForm />
        </div>
    )
}