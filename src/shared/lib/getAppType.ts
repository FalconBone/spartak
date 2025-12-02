import type { AppType } from "@shared/model/types";


export const getAppType = () : AppType => {
    const hostname = window.location.hostname;


    return 'manager'
}
