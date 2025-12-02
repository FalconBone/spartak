import classes from './TopPanelLayout.module.scss'


type Props = {
    children: React.ReactNode
}

export const TopPanelLayout = ({children} : Props) => {


    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}