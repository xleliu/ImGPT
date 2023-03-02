import { Stack, Textarea, Flex, CircularProgress, Text, Spacer, Button, Alert, useToast } from "@chakra-ui/react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionResponseMessage } from "openai";
import { useState } from "react";
import { getInputValue, getApiKey } from "../utils/selector";

export default function () {
    const apiKey = getApiKey();
    const toast = useToast();
    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAIApi(configuration);

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    async function handleClick() {
        if (apiKey == "") {
            toast({
                title: "缺少 api key",
                status: "warning",
                position: "top",
                duration: 2000,
            });
            return;
        }
        const prompt = getInputValue("prompt");
        if (prompt === "") {
            return;
        }
        messages.push({ role: "user", content: prompt });
        // 产生一次copy才会重新渲染
        setMessages([...messages]);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: messages,
        });
        messages.push(completion.data.choices[0].message as ChatCompletionResponseMessage);
        setMessages([...messages]);
    }

    return (
        <Stack spacing={4}>
            <Stack style={{ overflow: "auto" }}>
                {messages?.map((v: ChatCompletionRequestMessage) => (
                    <ChatItem message={v} />
                ))}
            </Stack>
            <Textarea placeholder="输入您的问题……" id="prompt" />
            <Flex align="end">
                {/* <Stack
                    direction="row"
                    align="center"
                    style={{
                        visibility: "hidden",
                    }}
                >
                    <CircularProgress isIndeterminate color="gray.400" size="4" />
                    <Text>正在思考……</Text>
                </Stack> */}
                <Spacer />
                <Button colorScheme="teal" size="md" onClick={handleClick}>
                    提交
                </Button>
            </Flex>
        </Stack>
    );
}

function ChatItem(props: { message: ChatCompletionRequestMessage }) {
    const message = props.message;
    return (
        <Alert
            style={{ textAlign: "left", whiteSpace: "pre-wrap" }}
            status={message.role == "user" ? "info" : "success"}
            variant="left-accent"
        >
            {message.content}
        </Alert>
    );
}
