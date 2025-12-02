import { useTelegramAuthQuery } from "@entities/user"
import { useLocation, useNavigate } from "react-router-dom"

export const TelegramAuthPage = () => {
    const navigate = useNavigate()
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    
    if (!queryParams.get("user_id") || !queryParams.get("chat_id")) {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('name');
    localStorage.removeItem('partner_id');
        navigate('/login')
    }

    const {data, isLoading : isLoadingQuery} = useTelegramAuthQuery({user_id: queryParams.get("user_id")!, chat_id: queryParams.get("chat_id")!})



    if (!isLoadingQuery) {
        navigate('/partners')
    }

    return (
        <div>

        </div>
    )
}