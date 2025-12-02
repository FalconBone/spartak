import { PartnerAddingModal } from '@widgets/partners/partnerAddingModal/ui/PartnerAddingModal'
import classes from './PartnersListHeader.module.scss'
import { Button } from 'antd'
import { useState } from 'react'

export const PartnersListHeader = () => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false)

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <span>Партнеры</span>
            </div>
            <Button onClick={() => setModalOpen(true)}>Добавить партнера</Button>
            <PartnerAddingModal isModalOpen={isModalOpen} setIsModalOpen={setModalOpen}/>
        </div>
    )
}