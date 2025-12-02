import dayjs from "dayjs";

export const switchDateFormatToYDM = (date : string, fromFormat : string, toFormat : string) : string => dayjs(date, fromFormat).format(toFormat)






//DD.MM.YYYY -> YYYY-MM-DD
//dayjs(since, constantsMap.shared.dateFormat).format(constantsMap.shared.serverDateFormat)



//switchDateFormatTo(since, constantsMap.shared.dateFormat, constantsMap.shared.serverDateFormat)