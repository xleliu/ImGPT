export function getApiKey() {
    const apiKey: string | undefined = localStorage.getItem("openai-key") as string;
    if (apiKey === "undefined" || apiKey === null) {
        return "";
    }
    return apiKey;
}
