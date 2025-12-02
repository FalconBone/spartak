import { NavLink } from 'react-router-dom'
import classes from './NavbarItem.module.scss'
import type { MouseEventHandler } from 'react'

type Props = {
    icon: React.ReactNode,
    name: string,
    to: string,

}

export const NavbarItem = ({ icon, name, to }: Props) => {

    const onClick = () => {
        
        if (to === '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            localStorage.removeItem('name');
    localStorage.removeItem('partner_id');
        }
    }

    return (
        <NavLink
            className={classes.link}
            to={to}
            onClick={(e) => {
                
            }}
        >
            <div className={classes.icon}>
                {icon}
            </div>
            <div className={classes.name}>
                {name}
            </div>
        </NavLink>
    )
}