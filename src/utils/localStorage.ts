import { RequestParams } from "./settingContext";

export interface Config {
    apiKey: string;
    reqParams?: RequestParams;
}

export function getConfig() {
    const config: string | undefined = localStorage.getItem("config") as string;
    if (config === "undefined" || config === null) {
        return {} as Config;
    }
    return JSON.parse(config) as Config;
}

export function updateApiKey(v: string) {
    const config = getConfig();
    config.apiKey = v;
    updateConfig(config);
}

export function updateReqParams(v: RequestParams) {
    const config = getConfig();
    config.reqParams = v;
    updateConfig(config);
}

function updateConfig(config: Config) {
    localStorage.setItem("config", JSON.stringify(config));
}
