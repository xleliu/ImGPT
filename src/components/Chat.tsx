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
} from "@chakra-ui/react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionResponseMessage } from "openai";
import { useState, useContext, useEffect } from "react";
import { useMarkdown } from "../utils/useMarkdown";
import { SettingContext } from "../utils/settingContext";

interface MessageDate {
    date: string;
}

export default function () {
    const toast = useToast();
    const { config, reqParams } = useContext(SettingContext);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    let openai: OpenAIApi;
    const setupOpenAI = () => {
        const configuration = new Configuration({ apiKey: config.apiKey });
        openai = new OpenAIApi(configuration);
    };

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const [messageDates] = useState<MessageDate[]>([]);

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

        messages.push({ role: "user", content: prompt });
        messageDates.push({ date: new Date().toLocaleString() });
        // 产生一次copy才会重新渲染
        setMessages([...messages]);
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
            messages.push(completion.data.choices[0].message as ChatCompletionResponseMessage);
        } catch (_) {
            toast({ title: "请求失败", status: "warning", position: "top", duration: 2000 });
            setLoading(false);
            return;
        }
        // messages.push({
        //     role: "assistant",
        //     content:
        //         '\n\n在 go 中，可以通过组合来实现继承的效果。具体来说，一个结构体可以嵌入（embed）另一个结构体，从而继承其字段和方法。被嵌入的结构体称为匿名字段，可以直接使用其字段和方法，就像自己本身的一样。\n\n示例：\n\n```go\ntype Animal struct {\n    name string\n}\n\nfunc (a *Animal) Move() {\n    fmt.Println(a.name, "is moving...")\n}\n\ntype Dog struct {\n    Animal // 匿名字段\n}\n\nfunc main() {\n    d := Dog{Animal{"Puppy"}}\n    d.Move() // Puppy is moving...\n}\n```\n\n在这个示例中，定义了 Animal 结构体和其 Move 方法，然后定义了 Dog 结构体，将 Animal 结构体作为其匿名字段。通过这种方式，Dog 结构体也具有了 Animal 结构体的字段和方法。在主函数中，创建了一个名为 d 的 Dog 实例，调用其 Move 方法，输出 Puppy is moving...。\n\n需要注意的是，如果 Animal 结构体中有同名的字段或方法，则 Dog 结构体中的字段或方法会覆盖 Animal 结构体中的同名字段或方法。此外，也可以通过显式调用 Animal 结构体中的方法或访问其字段来实现具体实现的继承效果。',
        // });
        messageDates.push({ date: new Date().toLocaleString() });
        setMessages([...messages]);
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
                <Stack spacing="6">
                    {messages?.map(
                        (v: ChatCompletionResponseMessage, i: number) => (
                            <ChatItem key={i} message={v} date={messageDates[i].date} />
                        )
                        // v.role == "user" ? (
                        //     <ChatItemUser key={i} message={v} date={messageDates[i].date} />
                        // ) : (
                        //     <ChatItemAssistant key={i} message={v} date={messageDates[i].date} />
                        // )
                    )}
                </Stack>
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
                    <ButtonGroup gap="2">
                        <Button
                            colorScheme="teal"
                            variant="outline"
                            size="md"
                            onClick={() => {
                                setMessages([]);
                            }}
                            w="100px"
                        >
                            重置会话
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

function ChatItem(props: { message: ChatCompletionResponseMessage; date: string }) {
    const message = props.message;
    const content = props.message.content.trim();
    return (
        <Stack
            style={{
                textAlign: "left",
                whiteSpace: "pre-wrap",
                fontSize: "0.9em",
            }}
        >
            <StackItem>
                <Text color={message.role == "user" ? "blue.600" : "green.600"}>
                    {message.role + " @ " + props.date + ":"}
                </Text>
            </StackItem>
            <StackItem>{content.includes("```") ? useMarkdown(content) : content}</StackItem>
        </Stack>
    );
}
function ChatItemAssistant(props: { message: ChatCompletionResponseMessage; date: string }) {}

function ChatItemUser(props: { message: ChatCompletionResponseMessage; date: string }) {}
