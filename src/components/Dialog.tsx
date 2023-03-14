import {
    Stack,
    Flex,
    Spacer,
    StackItem,
    Box,
    Text,
    ButtonGroup,
    Divider,
    IconButton,
    useBoolean,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, MinusIcon } from "@chakra-ui/icons";
import { ChatCompletionRequestMessage } from "openai";
import { useContext, useEffect, useRef } from "react";
import { Markdown } from "../utils/markdown";
import { SettingContext } from "../utils/settingContext";
import { MessageWithDate } from "../utils/messageStore";

export default function Dialog(props: {
    messages: ChatCompletionRequestMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatCompletionRequestMessage[]>>;
    messageStack: MessageWithDate[];
    setMessageStack: React.Dispatch<React.SetStateAction<MessageWithDate[]>>;
}) {
    const { messages, setMessages, messageStack, setMessageStack } = props;
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        // onChange events seem to block certain transitions
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages, messageStack]);

    return (
        <Box borderWidth="1px" borderRadius="lg" padding="0px 4px" bg="gray.100" _dark={{ bg: "whiteAlpha.100" }}>
            <Box style={{ height: "calc(100vh - 300px)", overflowY: "auto" }} padding="16px">
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
    );
}

function ChatItem(props: { message: MessageWithDate; remove: () => void }) {
    const { config } = useContext(SettingContext);

    const message = props.message;
    const content = props.message.content.trim();
    const [flag, setFlag] = useBoolean();
    const [viewRaw, setViewRaw] = useBoolean();

    return (
        <>
            <Stack
                style={{
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    fontSize: `${config.fontsize}em`,
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
                                onClick={setViewRaw.toggle}
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
