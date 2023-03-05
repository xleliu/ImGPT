import { Stack, Textarea, Flex, Spacer, Button, Alert, useToast, StackItem, Box, Badge } from "@chakra-ui/react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionResponseMessage } from "openai";
import { useState, useContext, useEffect } from "react";
import { useMarkdown } from "../utils/useMarkdown";
import { SettingContext } from "../utils/settingContext";

interface MessageDate {
    date: string;
}

export default function () {
    const toast = useToast();
    const { apiKey, reqParams } = useContext(SettingContext);
    const [prompt, setPrompt] = useState("");

    let openai: OpenAIApi;
    const setupOpenAI = () => {
        const configuration = new Configuration({ apiKey: apiKey });
        openai = new OpenAIApi(configuration);
    };

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const [messageDates] = useState<MessageDate[]>([]);

    setupOpenAI();
    useEffect(() => {
        setupOpenAI();
    }, [apiKey]);

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
        if (apiKey == "") {
            toast({ title: "缺少 api key", status: "warning", position: "top", duration: 2000 });
            return;
        }

        messages.push({ role: "user", content: prompt });
        messageDates.push({ date: new Date().toLocaleString() });
        // 产生一次copy才会重新渲染
        setMessages([...messages]);
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
                temperature: reqParams.temperature,
            });
            console.log(completion);
            messages.push(completion.data.choices[0].message as ChatCompletionResponseMessage);
        } catch (_) {
            toast({ title: "请求失败", status: "warning", position: "top", duration: 2000 });
            return;
        }
        // messages.push({
        //     role: "assistant",
        //     content:
        //         '\n\n在 go 中，可以通过组合来实现继承的效果。具体来说，一个结构体可以嵌入（embed）另一个结构体，从而继承其字段和方法。被嵌入的结构体称为匿名字段，可以直接使用其字段和方法，就像自己本身的一样。\n\n示例：\n\n```go\ntype Animal struct {\n    name string\n}\n\nfunc (a *Animal) Move() {\n    fmt.Println(a.name, "is moving...")\n}\n\ntype Dog struct {\n    Animal // 匿名字段\n}\n\nfunc main() {\n    d := Dog{Animal{"Puppy"}}\n    d.Move() // Puppy is moving...\n}\n```\n\n在这个示例中，定义了 Animal 结构体和其 Move 方法，然后定义了 Dog 结构体，将 Animal 结构体作为其匿名字段。通过这种方式，Dog 结构体也具有了 Animal 结构体的字段和方法。在主函数中，创建了一个名为 d 的 Dog 实例，调用其 Move 方法，输出 Puppy is moving...。\n\n需要注意的是，如果 Animal 结构体中有同名的字段或方法，则 Dog 结构体中的字段或方法会覆盖 Animal 结构体中的同名字段或方法。此外，也可以通过显式调用 Animal 结构体中的方法或访问其字段来实现具体实现的继承效果。',
        // });
        messageDates.push({ date: new Date().toLocaleString() });
        setMessages([...messages]);
        setPrompt("");
    }

    return (
        <Stack spacing={4}>
            <Box style={{ height: "calc(100vh - 320px)", overflowY: "auto" }} bg="gray.100">
                <Stack>
                    {messages?.map((v: ChatCompletionResponseMessage, i: number) => (
                        <ChatItem key={i} message={v} date={messageDates[i].date} />
                    ))}
                </Stack>
            </Box>
            <Stack>
                <Textarea
                    placeholder="输入您的问题……"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.trim())}
                    resize="none"
                />
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
                    <Badge>{message.role + " @ " + props.date}:</Badge>
                </StackItem>
                <StackItem>{useMarkdown(message.content.trim())}</StackItem>
            </Stack>
        </Alert>
    );
}
