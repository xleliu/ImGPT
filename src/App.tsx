import { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import Header from "./components/Header";
import Chat from "./components/Chat";
import "./App.css";
import { SettingContext, RequestParams, updateSettings, getSettings } from "./utils/settingContext";

function App() {
    // for localstorage
    const settings = getSettings();
    const [apiKey, setApiKey] = useState(settings.apiKey);
    const [reqParams, setReqParams] = useState(settings.reqParams as RequestParams);

    useEffect(() => {
        updateSettings({
            apiKey: apiKey,
            reqParams: reqParams,
        });
    }, [apiKey, reqParams]);

    return (
        <SettingContext.Provider
            value={{
                apiKey,
                setApiKey,
                reqParams,
                setReqParams,
            }}
        >
            <Stack spacing={4}>
                <Header />
                <Chat />
            </Stack>
        </SettingContext.Provider>
    );
}

export default App;
