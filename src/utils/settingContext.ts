import { createContext } from "react";

export interface RequestParams {
    temperature: number;
}

export interface Config {
    apiKey: string;
    fontsize: number;
    prePrompt: boolean;
    saveSession: boolean;
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
        config: {
            apiKey: "",
            fontsize: 0.9,
            prePrompt: false,
            saveSession: false,
        },
        reqParams: { temperature: 0.6 },
    };
    const settings: string = localStorage.getItem("settings") as string;
    if (settings === "undefined" || settings === null) {
        // default
        return defaultSetting;
    }
    try {
        const s = JSON.parse(settings) as Settings;
        return s.config == undefined ? defaultSetting : s;
    } catch (_) {
        return defaultSetting;
    }
}

export function updateSettings(settings: Settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
}
