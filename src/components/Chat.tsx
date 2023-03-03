import { Stack, Textarea, Flex, Spacer, Button, Alert, useToast, StackItem, Box, Badge } from "@chakra-ui/react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionResponseMessage } from "openai";
import { useState } from "react";
import { getInputValue, getApiKey } from "../utils/selector";

interface MessageDate {
    date: string;
}

export default function () {
    // 需要处理key刷新的问题
    let apiKey = getApiKey();
    const toast = useToast();
    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAIApi(configuration);

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const [messageDates] = useState<MessageDate[]>([]);

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
        messageDates.push({ date: new Date().toLocaleString() });
        // 产生一次copy才会重新渲染
        setMessages([...messages]);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: messages,
        });
        messages.push(completion.data.choices[0].message as ChatCompletionResponseMessage);
        // messages.push({ role: "assistant", content: "测试回复恢复恢复" });
        messageDates.push({ date: new Date().toLocaleString() });
        setMessages([...messages]);
    }

    return (
        <Stack spacing={4}>
            <Box style={{ height: "calc(100vh - 300px)", overflowY: "auto" }}>
                <Stack>
                    {messages?.map((v: ChatCompletionResponseMessage, i: number) => (
                        <ChatItem key={i} message={v} date={messageDates[i].date} />
                    ))}
                </Stack>
            </Box>
            <Stack>
                <Textarea placeholder="输入您的问题……" id="prompt" />
                <Flex align="end">
                    <Spacer />
                    <Button colorScheme="teal" size="md" onClick={handleClick}>
                        提交
                    </Button>
                </Flex>
            </Stack>
        </Stack>
    );
}

function ChatItem(props: { message: ChatCompletionResponseMessage; date: string }) {
    const message = props.message;
    return (
        <Alert
            style={{ textAlign: "left", whiteSpace: "pre-wrap" }}
            status={message.role == "user" ? "info" : "success"}
            variant="left-accent"
        >
            <Stack>
                <StackItem>
                    <Badge>{message.role + "@" + props.date}:</Badge>
                </StackItem>
                <StackItem>{message.content.trim()}</StackItem>
            </Stack>
        </Alert>
    );
}
