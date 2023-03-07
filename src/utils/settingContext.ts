import { createContext } from "react";

export interface RequestParams {
    temperature: number;
}

export interface Config {
    apiKey: string;
    enableContext: boolean;
}

export interface Settings {
    config: Config;
    reqParams: RequestParams;
}

export const SettingContext = createContext<{
    config: Config;
    setConfig: (config: Config) => void;
    reqParams: RequestParams;
    setReqParams: (reqParams: RequestParams) => void;
}>({
    config: {} as Config,
    setConfig: () => {},
    reqParams: {} as RequestParams,
    setReqParams: () => {},
});

export function getSettings() {
    const defaultSetting: Settings = {
        config: { apiKey: "", enableContext: false },
        reqParams: { temperature: 0 },
    };
    const settings: string | undefined = localStorage.getItem("settings") as string;
    if (settings === "undefined" || settings === null) {
        // default
        return defaultSetting;
    }
    try {
        return JSON.parse(settings) as Settings;
    } catch (_) {
        return defaultSetting;
    }
}

export function updateSettings(settings: Settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}
