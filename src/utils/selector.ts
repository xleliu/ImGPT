export function getInputValue(id: string) {
    let ele = document.getElementById(id);
    if (ele !== null) {
        return (ele as HTMLInputElement).value;
    }
    return "";
}

export function getApiKey() {
    const apiKey: string | undefined = localStorage.getItem("openai-key") as string;
    if (apiKey === "undefined") {
        return "";
    }
    return apiKey;
}
