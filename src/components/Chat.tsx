import {
    Stack,
    Textarea,
    Flex,
    Spacer,
    Button,
    useToast,
    StackItem,
    Box,
    Text,
    CircularProgress,
    Center,
    ButtonGroup,
    Divider,
} from "@chakra-ui/react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionResponseMessage } from "openai";
import { useState, useContext, useEffect, useRef } from "react";
import { useMarkdown } from "../utils/useMarkdown";
import { SettingContext } from "../utils/settingContext";

interface MessageWithDate extends ChatCompletionRequestMessage {
    date: string;
    resetContext?: boolean;
}

export default function () {
    const toast = useToast();
    const { config, reqParams } = useContext(SettingContext);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    let openai: OpenAIApi;
    const setupOpenAI = () => {
        const configuration = new Configuration({ apiKey: config.apiKey });
        openai = new OpenAIApi(configuration);
    };
    // 用于向接口提交
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    // 用于展示
    const [messageStack, setMessageStack] = useState<MessageWithDate[]>([]);

    useEffect(() => {
        // onChange events seem to block certain transitions
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages, messageStack]);

    setupOpenAI();
    useEffect(() => {
        setupOpenAI();
    }, [config.apiKey]);

    useEffect(() => {
        window.addEventListener("keypress", handleKeyEnter);
        return () => {
            window.removeEventListener("keypress", handleKeyEnter);
        };
    }, [handleKeyEnter]);

    function handleKeyEnter(e: { key: string }) {
        if (e.key === "Enter") {
            handleClick();
        }
    }

    async function handleClick() {
        if (prompt == "") {
            return;
        }
        if (config.apiKey == "") {
            toast({ title: "缺少 api key", status: "warning", position: "top", duration: 2000 });
            return;
        }
        let m: ChatCompletionRequestMessage;
        m = { role: "user", content: prompt };
        messages.push(m);
        messageStack.push({ ...m, date: new Date().toLocaleString() });
        // 产生一次copy才会重新渲染
        setMessageStack([...messageStack]);
        setPrompt("");
        setLoading(true);

        try {
            const completion = await openai.createChatCompletion(
                {
                    model: "gpt-3.5-turbo-0301",
                    messages: messages,
                    temperature: reqParams.temperature,
                    // stream: true,
                },
                { timeout: 30000 }
            );
            console.log(completion);
            m = completion.data.choices[0].message as ChatCompletionRequestMessage;
        } catch (_) {
            toast({ title: "请求失败", status: "warning", position: "top", duration: 2000 });
            setLoading(false);
            return;
        }
        // await sleep(3000);
        // m = { role: "system", content: "1234\n\n1234" };

        messages.push(m);
        messageStack.push({ ...m, date: new Date().toLocaleString() });

        setMessageStack([...messageStack]);
        setLoading(false);
    }

    return (
        <Stack spacing={4}>
            <Box
                style={{ height: "calc(100vh - 300px)", overflowY: "auto" }}
                bg="gray.100"
                borderWidth="1px"
                borderRadius="lg"
                padding="15px"
            >
                <Stack spacing="5">
                    {messageStack?.map((v: MessageWithDate, i: number) => (
                        <ChatItem key={i} message={v} />
                    ))}
                </Stack>
                <div ref={messagesEndRef} />
            </Box>
            <Stack spacing="3">
                <Textarea
                    style={{ fontSize: "0.9em" }}
                    placeholder="输入您的问题……"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.trimStart())}
                    resize="none"
                />
                <Flex>
                    <Center
                        style={{
                            visibility: loading ? "visible" : "hidden",
                        }}
                    >
                        <CircularProgress isIndeterminate color="gray.400" size="4" style={{ marginRight: "5px" }} />
                        <Text color="gray.500" fontSize="sm">
                            正在获取答案……
                        </Text>
                    </Center>
                    <Spacer />
                    <ButtonGroup gap="3">
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            size="md"
                            onClick={() => {
                                setMessages([]);
                                setMessageStack([]);
                            }}
                            w="100px"
                        >
                            清屏
                        </Button>
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            size="md"
                            onClick={() => {
                                if (messages.length > 0) {
                                    messageStack.at(-1)!.resetContext = true;
                                }
                                setMessages([]);
                            }}
                            w="100px"
                        >
                            重置
                        </Button>
                        <Button colorScheme="teal" size="md" onClick={handleClick} w="100px">
                            发送
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Stack>
        </Stack>
    );
}

function ChatItem(props: { message: MessageWithDate }) {
    const message = props.message;
    const content = props.message.content.trim();
    return (
        <>
            <Stack
                style={{
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9em",
                }}
            >
                <StackItem>
                    <Text color={message.role == "user" ? "blue.600" : "green.600"}>
                        {message.role + " @ " + message.date + ":"}
                    </Text>
                </StackItem>
                <StackItem>{content.includes("```") ? useMarkdown(content) : content}</StackItem>
            </Stack>
            {message.resetContext ? <Divider borderColor="gray.500" borderStyle="dashed" /> : null}
        </>
    );
}

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
