import { createContext } from "react";

export interface RequestParams {
    temperature?: number;
}

export interface Settings {
    apiKey: string;
    reqParams?: RequestParams;
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

export function getSettings() {
    const settings: string | undefined = localStorage.getItem("settings") as string;
    if (settings === "undefined" || settings === null) {
        return {} as Settings;
    }
    return JSON.parse(settings) as Settings;
}

export function updateSettings(settings: Settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}
