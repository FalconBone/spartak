import type { ReactNode } from "react"
import classes from './ElementWithLabel.module.css'

type Props = {
    children: ReactNode,
    label: string,
    marginRight?: string
}

export const ElementWithLabel = ({children, label, marginRight} : Props) => {
    return (
        <div className={classes.container} style={{marginRight}}>
            <div className={classes.label}>
                {label}
            </div>
            {children}
        </div>
    )
}