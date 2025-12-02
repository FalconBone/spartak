import { useState } from "react"
import { useFacebookInsightsMutation, useFacebookMutation, useGetMeMutation } from "@entities/user";
import { useAppDispatch } from "@shared/hooks/redux";
import { useTestMutation } from "@entities/account/api/api";
import { ItemsString } from "@shared/ui/itemsString";

export const Main = () => {

    const dispatch = useAppDispatch();

    const [getMe] = useGetMeMutation()
    const [facebookPost] = useFacebookMutation()
    const [facebookInsightsPost] = useFacebookInsightsMutation()
    const [testUrl] = useTestMutation()
    const [url, setUrl] = useState<string>('');

    const onClickFingerprint = () => {
        const fingerpint = localStorage.getItem('fingerprint')

    }

    const onClickGetMe = async () => {
        await getMe().unwrap()
        console.log('Запрос getMe!')
    }

    const onClickFacebook = async () => {
        await facebookPost().unwrap()
        console.log('Запрос facebookPost!')
    }

    const onClickFacebookInsights = async () => {
        await facebookInsightsPost().unwrap()
        console.log('Запрос facebookInsights!')
    }

    const onClickTest = async () => {
        await testUrl(url).unwrap()
            .then((res) => {
                
            })
    }


    const items : string[] = ['Малина', 'Клубника', 'Вишня', 'Арбуз', 'Арбуз']


    return (
        <div>
            {/* <button onClick={handleSubmit}>Отправить рефреш</button>
            <button onClick={onClickFingerprint}>Вывести fingerprint</button>
            <button onClick={onClickGetMe}>Запрос getMe</button>
            <button onClick={onClickFacebook}>Запрос на /facebook_api/smth_from_facebook</button>
            <button onClick={onClickFacebookInsights}>Запрос на insights</button>
            <div>
                <div>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Input test url"/>
                    <button onClick={onClickTest}>Отправить тест запрос</button>
                </div>
            </div> */}
            <div style={{marginTop: '50px', border: '1px solid black', width: 200, height: 40, padding: 5}}>
                <ItemsString items={items} title={'Съедобное'}/>
            </div>
        </div>
    )
}