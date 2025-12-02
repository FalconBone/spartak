import { useEcho } from "@laravel/echo-react";
import { useDispatch } from "react-redux";
import { accountApi } from "./api";


export const useStatusChangedListener = () => {
    const dispatch = useDispatch()

    // useEcho("table", "PartnerAccount.updated", (payload) => {
    //     dispatch(accountApi.util.updateQueryData('getAccountsByPartner', arg, (draft) => {
    //         draft.table.groups[]
    //     }))
    // });
}