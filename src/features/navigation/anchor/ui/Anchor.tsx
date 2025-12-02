import { useState } from "react"
import classes from './Anchor.module.scss'

type Props = {
    value: number,
    items: {
        value: number,
        label: string
    }[]
}

export const Anchor = ({value, items} : Props) => {

    const [currentItem, setCurrentItem] = useState<number>(value)

    const onChangeCurrentItem = (newValue : number) => {
        setCurrentItem(newValue)
    }

    const itemsElements = items.map((item) => (
        <div onClick={() => onChangeCurrentItem(item.value)}>
            {item.label}
        </div>
    ))

    return (
        <div className={classes.container}>
            {itemsElements}
        </div>
    )
}