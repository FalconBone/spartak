import { Input, Modal, notification } from "antd"
import { useState } from "react"
import classes from './PartnerAddingModal.module.scss'
import { useAddPartnerMutation } from "@entities/partner/api/api"

type Props = {
    setIsModalOpen: (open: boolean) => void,
    isModalOpen: boolean
}

export const PartnerAddingModal = ({ setIsModalOpen, isModalOpen }: Props) => {

    const [addPartner, { isLoading: isLoadingAddingPartner }] = useAddPartnerMutation()
    const [partnerName, setPartnerName] = useState<string>('')

    const handleOk = async () => {
        const trimmedName = partnerName.trim()
        if (!trimmedName) {
            notification.error({ message: 'Название не может быть пустым' })
            return
        }

        try {
            await addPartner(trimmedName).unwrap()
            notification.success({ message: 'Партнёр успешно добавлен' })
            setIsModalOpen(false)
            setPartnerName('')
        } catch (err : any) {
            notification.error({ message: err.message || 'Неизвестная ошибка' })
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setPartnerName('')
    }

    return (
        <Modal
            title="Добавьте партнёра"
            centered
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okButtonProps={{ loading: isLoadingAddingPartner }}
        >
            <div className={classes.container}>
                <div className={classes.label_name}>
                    Введите название
                </div>
                <div className={classes.input_container}>
                    <Input
                        className={classes.input}
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    )
}
