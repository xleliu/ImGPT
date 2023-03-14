import {
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Stack,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useState, useContext, useRef } from "react";
import { SettingContext } from "../utils/settingContext";
import { MessageStore } from "../utils/messageStore";

export default function Session() {
    const { config } = useContext(SettingContext);
    const dummyRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton
                size="md"
                variant="ghost"
                borderWidth="0"
                onClick={onOpen}
                icon={<ChatIcon />}
                aria-label={"view slider"}
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">会话</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing="6"></Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
