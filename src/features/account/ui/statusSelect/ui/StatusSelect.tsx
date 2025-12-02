import classes from './StatusSelect.module.scss'


export type SelectOption = {
    value: number,
    label: string
}

type Props = {
    options: SelectOption[],
    onChangeStatus: (partnerAccountId: string, statusId: string, groupName: string, accountIndex: number) => void,
    accountId: string,
    group: string,
    index: number,
    value: number,
    partnerAccountId: number
}


export const StatusSelect = ({options, value, onChangeStatus, group, index, partnerAccountId} : Props) => {

    let style;

    if (value === 1) {
        style = classes.active
    } else if (value === 2) {
        style = classes.disabled
    } else {
        style = classes.none
    }
    

    return (
        <select
            className={`${classes.select} ${style}`}
            onChange={
                (e) => onChangeStatus(String(partnerAccountId), e.target.value, group, index)
            }
            value={value}
        >
            
            {options.map((element) => <option className={classes.option} label={element.label} value={element.value} key={element.value}></option>)}
        </select>
    )
}