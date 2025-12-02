import type { ReactNode } from "react";
import {Checkbox, ConfigProvider, Layout, theme} from 'antd'
import { constantsMap } from "@shared/model";


interface ThemeProviderProps {
  children: ReactNode | ReactNode[];
}



const components = {
  Menu: {
    // colorBgElevated: constantsMap.shared.theme.dark.gray,
    // colorBgContainer: constantsMap.shared.theme.dark.lightGray,
    // itemSelectedBg: '#333A45',
    // itemSelectedColor: '#D1D7E0',
    // itemMarginInline: 20
  },
  Layout: {
    // bodyBg: constantsMap.shared.theme.dark.darkerGray,
    // siderBg: constantsMap.shared.theme.dark.lightGray,
    // triggerBg: "#0B0E12",
    // triggerColor: constantsMap.shared.theme.dark.gray,
    // headerHeight: 100

  },
  Select: {
    //colorBorder: "red",
    
  },
  Checkbox: {

    
  },
}

export const ThemeProvider = ({children} : ThemeProviderProps) => {

  return (
    <ConfigProvider
      theme={{
        /*token: {
          // colorBgContainer: constantsMap.shared.theme.dark.darkerGray,
          // colorText: constantsMap.shared.theme.dark.text,
          // colorBgElevated: constantsMap.shared.theme.dark.gray,
          // colorBgSolidHover: "#CC397B",
          // colorBgTextHover: constantsMap.shared.theme.dark.gray,
          // colorBgTextActive: "#CC397B",
          // colorBgSpotlight: "#CC397B",
          // colorBgSolidActive: "#CC397B",
          // colorBgSolid: "#CC397B",
          //colorBgContainerDisabled: "#CC397B", //disabled select фоон
          // controlItemBgActiveDisabled: 'blue',
          // colorTextDisabled: '#B5B5B5',
          // colorBgLayout: constantsMap.shared.theme.dark.gray,
          // colorFill: "#3F4D5C",
          // colorBorder: constantsMap.shared.theme.dark.gray,
          // colorHighlight: "#CC397B",
          // colorInfoBg: "#CC397B",
          // colorPrimaryBg: "", 
          // colorPrimaryBgHover: "#CC397B",
          // controlItemBgHover: constantsMap.shared.theme.dark.gray,
          // controlItemBgActive: '#333A45', //выбранный элемент в select
          // colorTextPlaceholder: `${constantsMap.shared.theme.dark.gray}99`,
          //colorBorderSecondary: "red" //цвет рамок для карточке
          
        },
        components*/
        //algorithm: theme.darkAlgorithm,
        components: {
          
        }
      }}>
      {children}
    </ConfigProvider>
  )
}