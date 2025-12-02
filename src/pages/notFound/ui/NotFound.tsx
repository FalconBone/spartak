import classes from './NotFound.module.scss'

export const NotFound = () => {
    return (
        <div className={classes.container}>
            <div className={classes.status}>
                404
            </div>
            <div className={classes.title}>
                Page not found
            </div>
            
        </div>
    )
}