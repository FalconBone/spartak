import classes from './MainContentLayout.module.scss'

type Props = {
    children: React.ReactNode
}

export const MainContentLayout = ({children} : Props) => {
    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}