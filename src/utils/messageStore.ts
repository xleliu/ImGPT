import { ChatCompletionRequestMessage } from "openai";

export interface MessageWithDate extends ChatCompletionRequestMessage {
    date: string;
    resetContext?: boolean;
}

export interface MessageStore {
    name: string;
    messages: MessageWithDate[];
}

export function updateSession(data: MessageStore[]) {
    localStorage.setItem("sessions", JSON.stringify(data));
}

export function loadSession() {
    const sessions: string | undefined = localStorage.getItem("sessions") as string;
    if (sessions === "undefined" || sessions === null) {
        // default
        return [];
    }
    try {
        return JSON.parse(sessions) as MessageStore[];
    } catch (_) {
        return [];
    }
}
