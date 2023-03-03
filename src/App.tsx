import { useState } from "react";
import { Stack } from "@chakra-ui/react";
import Keybar from "./components/Keybar";
import Header from "./components/Header";
import Chat from "./components/Chat";
import "./App.css";
import { SettingContext, RequestParams } from "./utils/settingContext";

function App() {
    const [apiKey, setApiKey] = useState("");
    const [reqParams, setReqParams] = useState<RequestParams>({ temperature: 0.6 });

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
                <Keybar />
                <Header />
                <Chat />
            </Stack>
        </SettingContext.Provider>
    );
}

export default App;
