import { Input } from "antd"
import classes from './PartnerEditingHeader.module.scss'
import { useGetPartnerInfoQuery, useGetPartnerSettingsQuery, useUpdatePartnerMutation } from "@entities/partner/api/api"
import { useParams } from "react-router-dom"
import { useState } from "react"
import dayjs from "dayjs"



export const PartnerEditingHeader = () => {

    const { id } = useParams()
    const { data: partner, isLoading: isLoadingPartner } = useGetPartnerInfoQuery(id ?? '')
    const [partnerName, setPartnerName] = useState<string>(partner?.name ?? '')
    const [firstPartnerName, setFirstPartnerName] = useState<string>(partner?.name ?? '')

    const [changeName, {isLoading : isLoadingChangingName, status : statusChangingName}] = useUpdatePartnerMutation()

    const submit = async () => {
        const payload = 
            await changeName({id: Number(id), name: partnerName}).unwrap()
            
        if (statusChangingName === 'fulfilled') {

        } else {
            //alert('Неудача')
            //setPartnerName(firstPartnerName)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            submit();
        }
    };

    const handleBlur = () => {
        submit();
    };

    return (
        <div className={classes.container}>
            {
                isLoadingPartner ? '' : (
                    <>
                        <div className={classes.namechange_block}>
                            <Input
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div>

                        </div>
                    </>
                )
            }
        </div>

    )
}