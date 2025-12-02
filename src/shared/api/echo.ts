
import { configureEcho } from "@laravel/echo-react";
import { apiMap } from "@shared/model";

configureEcho({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_ECHO_KEY,
    wsHost: apiMap.baseWSUrl,
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_HTTP_PROTOCOL}://${apiMap.baseWSUrl}/broadcasting/auth`,
    auth: {
        headers: {
            'authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }
});

