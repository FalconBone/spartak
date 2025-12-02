import type { ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Provider } from 'react-redux'
import { store } from "@app/providers/store"
import { ThemeProvider } from "./theme"
import { BrowserRouter } from "react-router-dom"
import { InitializationProvider } from "./init"
import "@shared/api/echo"
import { ErrorPage } from "@shared/ui/errorPage"

type Props = {
    children: ReactNode
}

export const Providers = ({ children }: Props) => {

    return (
        <ErrorBoundary fallback={<ErrorPage/>}>
            <Provider store={store}>
                <BrowserRouter>
                    {/*<InitializationProvider>*/}
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    {/*</InitializationProvider>*/}
                </BrowserRouter>
            </Provider>
        </ErrorBoundary>
    )
}