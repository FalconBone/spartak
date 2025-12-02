import { useGetAccountQuery } from "@entities/account/api/api"
import { Skeleton, Timeline, type TimelineItemProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import utc from "dayjs/plugin/utc"
import classes from './AccountPage.module.scss'
import { AccountSpendTable } from "@widgets/account/accountSpendTable";
import { AccountHeader } from "@widgets/account/accountHeader/ui/AccountHeader";
import { motion } from 'framer-motion';

dayjs.extend(utc);

export const AccountPage = () => {

    const { id } = useParams()
    const { data: account, isLoading: isLoadingAccount } = useGetAccountQuery(id!);
    const [items, setItems] = useState<TimelineItemProps[]>([]);

    useEffect(() => {
        if (isLoadingAccount || !account) return;

        const newItems: any[] = [];

        // Мап для быстрого поиска PartnerAccount по id
        const partnerAccountById = new Map<number, any>();
        account.partner_accounts.forEach(pa => {
            partnerAccountById.set(pa.id, pa);
        });

        // 1) Передача партнёру (partner_account без transferred_from_id)
        account.partner_accounts
            .filter(pa => !pa.transferred_from_id)
            .forEach(pa => {
                newItems.push({
                    label: dayjs(pa.created_at).utc().format('YYYY-MM-DD'),
                    children: `Передан партнёру ${pa.partner.name} / ${pa.partner_account_group.name}`,
                });
            });

        // 4) Перемещение между партнёрами (partner_account с transferred_from_id)
        account.partner_accounts
            .filter(pa => pa.transferred_from_id)
            .forEach(pa => {
                const fromPa = partnerAccountById.get(pa.transferred_from_id);
                if (fromPa) {
                    const fromPartner = fromPa.partner.name;
                    const fromGroup = fromPa.partner_account_group.name;
                    const toPartner = pa.partner.name;
                    const toGroup = pa.partner_account_group.name;

                    newItems.push({
                        label: dayjs(pa.created_at).utc().format('YYYY-MM-DD'),
                        children: `Перемещение из партнёра ${fromPartner} / ${fromGroup} в партнёра ${toPartner} / ${toGroup}`,
                    });
                } else {
                    console.warn(`Не найден transferred_from для partner_account id=${pa.id}`);
                }
            });

        // 2) Смена статуса (partner_account_snapshots)
        account.partner_accounts.forEach(pa => {
            pa.partner_account_snapshots.forEach(snap => {
                if (snap.account_status_before_id) {
                    if (snap.account_status_after.name !== 'Transferred') {
                        newItems.push({
                            label:  dayjs(snap.created_at).utc().format('YYYY-MM-DD H:mm'),
                            children: `Сменил статус с «${snap.account_status_before.name}» на «${snap.account_status_after.name}»`,
                        });
                    }
                }

            });
        });

        // 3) Смена карты (fb_funding_source_details)
        account.fb_funding_source_details.forEach(fs => {
            newItems.push({
                label: dayjs(fs.created_at).utc().format('YYYY-MM-DD H:mm'),
                children: `Сменена карта: ${fs.fb_display_string}`,
            });
        });

        // Сортируем по времени
        newItems.sort((a, b) => dayjs(a.label).valueOf() - dayjs(b.label).valueOf());

        setItems(newItems);
    }, [account, isLoadingAccount]);


    return (
        <div className={classes.container}>
            <AccountHeader/>
            <div>
                {
                    !isLoadingAccount
                        ?
                        <AccountSpendTable name={account?.fb_name!} id={account?.id!} age={account?.fb_age!} />
                        :
                        <Skeleton />
                }
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.timeline}>
                {
                    !isLoadingAccount
                        ? 
                            (
                                <>
                                <div className={classes.title}>История изменений аккаунта</div>
                                {items.length > 0 ? <Timeline items={items} mode="right" /> : "У аккаунта пока нет изменений"}   
                                </>
                            )
                        : <Skeleton />
                }
            </motion.div>
        </div>
    )
}