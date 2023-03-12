import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Center, Flex, Heading, IconButton, Spacer, useColorMode } from "@chakra-ui/react";

export default function () {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Flex>
            <Heading as="h1" size="lg" color="teal.500" noOfLines={1} style={{ margin: "10px 0px" }}>
                ImGPT
            </Heading>
            <Spacer />
            <Center>
                <IconButton
                    size="md"
                    variant="ghost"
                    borderWidth="0"
                    icon={colorMode == "dark" ? <SunIcon /> : <MoonIcon />}
                    aria-label={"change color mode"}
                    onClick={toggleColorMode}
                />
            </Center>
        </Flex>
    );
}
