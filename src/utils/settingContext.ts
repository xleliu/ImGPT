import { createContext } from "react";

export interface RequestParams {
    temperature?: number;
}

export const SettingContext = createContext<{
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    reqParams: RequestParams;
    setReqParams: (reqParams: RequestParams) => void;
}>({
    apiKey: "",
    setApiKey: () => {},
    reqParams: {},
    setReqParams: () => {},
});
