import { Providers } from "./providers";
import { AppRouter } from "./providers/routers";

export default function App() {

    return (
        <Providers>
            <AppRouter/>
        </Providers>
    )
}