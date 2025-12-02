
import { NavbarItem } from '@features/navigation/navbarItem'
import classes from './Navbar.module.scss'
import { ApartmentOutlined, GroupOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'

export function Navbar() {
    return (
        <div className={classes.container}>
            <NavbarItem
                name='Партнеры'
                to='/partners'
                icon={<SolutionOutlined className={classes.icon}/>}
            />
            <NavbarItem
                name='Главная (тесты)'
                to='/main'
                icon={<ApartmentOutlined className={classes.icon}/>}
            />
            <NavbarItem
                name='Логин'
                to='/login'  
                icon={<UserOutlined className={classes.icon}/>}
            />
            <NavbarItem
                name='Бизнес-менеджеры'
                to='/businesses'
                icon={<GroupOutlined className={classes.icon}/>}
            />     
        </div>
    )
}