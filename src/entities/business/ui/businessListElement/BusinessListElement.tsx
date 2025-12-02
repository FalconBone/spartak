import { NavLink } from 'react-router-dom'
import classes from './BusinessListElement.module.scss'

type Props = {
    name: string,
    id: string
}

export const BusinessListElement = ({id, name} : Props) => {
    return (
        <NavLink className={classes.container} to={`/businessmanager/${id}`}>
            {name}
        </NavLink>
    )
}