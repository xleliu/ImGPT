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
    IconButton,
    useBoolean,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, MinusIcon } from "@chakra-ui/icons";
import { useState, useContext, useEffect, useRef } from "react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { Markdown } from "../utils/markdown";
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
    setupOpenAI();
    useEffect(() => {
        setupOpenAI();
    }, [config.apiKey]);

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

    const handleKeyEnter = (e: { shiftKey: boolean; keyCode: number }) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            handleClick();
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", handleKeyEnter);
        return () => {
            window.removeEventListener("keydown", handleKeyEnter);
        };
    }, [handleKeyEnter]);

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
                { timeout: 60000 }
            );
            console.log(completion);
            m = completion.data.choices[0].message as ChatCompletionRequestMessage;
        } catch (_) {
            toast({ title: "请求失败", status: "warning", position: "top", duration: 2000 });
            setLoading(false);
            return;
        }
        // await sleep(3000);
        // m = {
        //     role: "system",
        //     content:
        //         "\n\n以下是一个快速排序算法的`Go`实现：\n\n```go\nfunc quickSort(arr []int, left, right int) {\n    if left < right {\n        pivot := partition(arr, left, right)\n        quickSort(arr, left, pivot-1)\n        quickSort(arr, pivot+1, right)\n    }\n}\n\nfunc partition(arr []int, left, right int) int {\n    pivot := arr[right]\n    i := left - 1\n    for j := left; j < right; j++ {\n        if arr[j] < pivot {\n            i++\n            arr[i], arr[j] = arr[j], arr[i]\n        }\n    }\n    arr[i+1], arr[right] = arr[right], arr[i+1]\n    return i + 1\n}\n```\n\n这个算法使用了快速排序的思想，将数组分成两个部分，一部分小于基准值，一部分大于基准值。然后递归地对这两个部分进行排序。在这个实现中，基准值被选为数组的最后一个元素，然后使用双指针法将数组分成两个部分。",
        // };

        messages.push(m);
        messageStack.push({ ...m, date: new Date().toLocaleString() });

        setMessageStack([...messageStack]);
        setLoading(false);
    }

    return (
        <Stack spacing={4}>
            <Box bg="gray.100" borderWidth="1px" borderRadius="lg" padding="0px 5px">
                <Box
                    style={{ height: "calc(100vh - 300px)", overflowY: "auto" }}
                    // bg="gray.100"
                    // borderWidth="1px"
                    // borderRadius="lg"
                    padding="15px"
                >
                    <Stack spacing="5">
                        {messageStack?.map((v: MessageWithDate, i: number) => (
                            <ChatItem
                                key={i}
                                message={v}
                                remove={() => {
                                    messages.splice(i, 1);
                                    setMessages([...messages]);
                                    messageStack.splice(i, 1);
                                    setMessageStack([...messageStack]);
                                }}
                            />
                        ))}
                    </Stack>
                    <div ref={messagesEndRef} />
                </Box>
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
                                setLoading(false);
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
                                setLoading(false);
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

function ChatItem(props: { message: MessageWithDate; remove: () => void }) {
    const message = props.message;
    const content = props.message.content.trim();
    const [flag, setFlag] = useBoolean();
    const [viewRaw, setviewRaw] = useBoolean();

    return (
        <>
            <Stack
                style={{
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9em",
                }}
                onMouseEnter={setFlag.on}
                onMouseLeave={setFlag.off}
            >
                <StackItem>
                    <Flex>
                        <Text color={message.role == "user" ? "blue.600" : "green.600"}>
                            {message.role + " @ " + message.date + ":"}
                        </Text>
                        <Spacer />
                        <ButtonGroup
                            gap="0"
                            style={{
                                visibility: flag ? "visible" : "hidden",
                            }}
                        >
                            <IconButton
                                size="xs"
                                boxShadow="none"
                                color="gray.400"
                                variant="ghost"
                                colorScheme="yellow"
                                borderWidth="0"
                                icon={viewRaw ? <ViewOffIcon /> : <ViewIcon />}
                                aria-label={"view source"}
                                onClick={setviewRaw.toggle}
                            />
                            <IconButton
                                size="xs"
                                boxShadow="none"
                                color="gray.400"
                                variant="ghost"
                                colorScheme="yellow"
                                borderWidth="0"
                                icon={<MinusIcon />}
                                aria-label={"remove item"}
                                onClick={props.remove}
                            />
                        </ButtonGroup>
                    </Flex>
                </StackItem>
                <StackItem>{viewRaw ? <Text>{content}</Text> : <Markdown source={content} />}</StackItem>
            </Stack>
            {message.resetContext ? <Divider borderColor="gray.500" borderStyle="dashed" /> : null}
        </>
    );
}

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
