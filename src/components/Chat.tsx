import {
    Stack,
    Textarea,
    Flex,
    Spacer,
    Button,
    useToast,
    Text,
    CircularProgress,
    Center,
    ButtonGroup,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    useMediaQuery,
} from "@chakra-ui/react";
import { useState, useContext, useEffect, useRef } from "react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { SettingContext } from "../utils/settingContext";
import Sidebar from "./Sidebar";
import Dialog from "./Dialog";

interface MessageWithDate extends ChatCompletionRequestMessage {
    date: string;
    resetContext?: boolean;
}

export default function () {
    const toast = useToast();
    const { config, reqParams } = useContext(SettingContext);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    // 移动端
    const [isLargerThan600] = useMediaQuery("(min-width: 600px)");

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
        // await sleep(1000);
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
            <Dialog
                messages={messages}
                setMessages={setMessages}
                messageStack={messageStack}
                setMessageStack={setMessageStack}
            />
            <Stack spacing="3">
                {!config.prePrompt ? (
                    <Textarea
                        resize="none"
                        style={{ fontSize: `${config.fontsize}em` }}
                        placeholder="输入您的问题……"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value.trimStart())}
                        onKeyDown={(e: { shiftKey: boolean; keyCode: number }) => {
                            if (e.keyCode == 13 && !e.shiftKey) {
                                handleClick();
                            }
                        }}
                    />
                ) : (
                    <TextField prompt={prompt} setPrompt={setPrompt} handleClick={handleClick} />
                )}
                <Flex>
                    <Sidebar />
                    <Center
                        style={{
                            visibility: loading ? "visible" : "hidden",
                            marginLeft: "15px",
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
                            display={isLargerThan600 ? "" : "none"}
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
                            display={isLargerThan600 ? "" : "none"}
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
                        <Button size="md" onClick={handleClick} w="100px">
                            发送
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Stack>
        </Stack>
    );
}

function TextField(props: { prompt: string; setPrompt: (s: string) => void; handleClick: () => void }) {
    const { config } = useContext(SettingContext);
    const { prompt, setPrompt, handleClick } = props;
    const btnRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    return (
        <>
            <Menu>
                <MenuButton
                    ref={btnRef}
                    visibility="hidden"
                    style={{
                        height: "0px",
                        marginTop: "-14px",
                    }}
                >
                    Slash Commands
                </MenuButton>
                <SlashCommands setPrompt={setPrompt} inputRef={inputRef} />
            </Menu>

            <Textarea
                resize="none"
                style={{ fontSize: `${config.fontsize}em` }}
                placeholder="输入您的问题……"
                ref={inputRef}
                value={prompt}
                onChange={(e) => {
                    const v = e.target.value.trimStart();
                    setPrompt(v);
                    if (v === "/") {
                        btnRef.current!.click();
                    }
                }}
                onKeyDown={(e: { shiftKey: boolean; keyCode: number }) => {
                    if (e.keyCode == 13 && !e.shiftKey) {
                        handleClick();
                    }
                }}
            />
        </>
    );
}

function SlashCommands(props: { setPrompt: (s: string) => void; inputRef: React.RefObject<HTMLTextAreaElement> }) {
    const { setPrompt, inputRef } = props;

    const commands = ["翻译成英文", "翻译成中文", "查询 Github 仓库", "历史上的今天", "查询菜谱"];
    return (
        <MenuList>
            {commands.map((cmd: string, i: number) => (
                <MenuItem
                    key={i}
                    borderRadius="0"
                    boxShadow="none"
                    onClick={() => {
                        setPrompt(cmd + ": ");
                        inputRef.current!.focus();
                    }}
                >
                    {cmd}
                </MenuItem>
            ))}
        </MenuList>
    );
}

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
