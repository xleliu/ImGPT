import { Flex, Heading, IconButton, Spacer, useColorMode, Link, HStack } from "@chakra-ui/react";
import { MoonIcon, SunIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function () {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Flex>
            <Heading as="h1" size="lg" color="teal.500" noOfLines={1} style={{ margin: "10px 0px" }}>
                ImGPT
            </Heading>
            <Spacer />
            <HStack spacing="2">
                <IconButton
                    size="md"
                    variant="ghost"
                    borderWidth="0"
                    boxShadow="none"
                    icon={colorMode == "dark" ? <SunIcon /> : <MoonIcon />}
                    aria-label={"change color mode"}
                    onClick={toggleColorMode}
                />
                <Link href="https://github.com/xiaoler/ImGPT" isExternal>
                    Github <ExternalLinkIcon mx="2px" />
                </Link>
            </HStack>
        </Flex>
    );
}
