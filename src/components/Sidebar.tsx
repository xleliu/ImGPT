import {
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Slider,
    SliderMark,
    SliderFilledTrack,
    Tooltip,
    SliderThumb,
    SliderTrack,
    FormControl,
    FormLabel,
    Editable,
    EditablePreview,
    EditableInput,
    Stack,
    VisuallyHiddenInput,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useState, useContext, useRef } from "react";
import { SettingContext } from "../utils/settingContext";

export default function Sidebar() {
    const { config } = useContext(SettingContext);
    const dummyRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: !config.apiKey });

    return (
        <>
            <IconButton
                size="md"
                variant="ghost"
                borderWidth="0"
                onClick={onOpen}
                icon={<HamburgerIcon />}
                aria-label={"view slider"}
            />
            <Drawer
                placement="left"
                onClose={onClose}
                isOpen={isOpen}
                initialFocusRef={config.apiKey ? dummyRef : undefined}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">配置</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing="6">
                            <FormApiKey />
                            <FormTemperature />
                            <FormFontSize />
                            // 防止自动绑定focus
                            <VisuallyHiddenInput ref={dummyRef} />
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

function FormApiKey(): JSX.Element {
    // for update openai config
    const { config, setConfig } = useContext(SettingContext);
    // for form
    const [value, setValue] = useState(secretValue(config.apiKey));

    const onSubmit = (v: string) => {
        setValue(secretValue(v));
        setConfig({ ...config, apiKey: v });
    };

    function secretValue(v: string) {
        if (v == "" || v == undefined) {
            return "";
        }
        return v.slice(0, 3) + "*".repeat(12) + v.slice(-4);
    }

    return (
        <FormControl>
            <FormLabel color="teal">当前秘钥:</FormLabel>
            <Editable
                style={{
                    textAlign: "left",
                }}
                placeholder="请输入你的秘钥……"
                value={value}
                onSubmit={onSubmit}
                onChange={(v) => {
                    setValue(v);
                }}
                onEdit={() => {
                    setValue(config.apiKey);
                }}
            >
                <EditablePreview style={{ color: "gray" }} />
                <EditableInput style={{ fontSize: "0.9em" }} />
            </Editable>
        </FormControl>
    );
}

function FormTemperature(): JSX.Element {
    const { reqParams, setReqParams } = useContext(SettingContext);
    const [temperature, setTemperature] = useState(reqParams.temperature * 10);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <FormControl>
            <FormLabel color="teal">抽样温度:</FormLabel>
            <Slider
                id="slider"
                defaultValue={temperature}
                min={0}
                max={20}
                colorScheme="teal"
                onChange={(v) => {
                    setTemperature(v);
                    setReqParams({ ...reqParams, temperature: v / 10 });
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <SliderMark value={10} mt="1" ml="-1" fontSize="sm">
                    1
                </SliderMark>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                    hasArrow
                    bg="teal.500"
                    color="white"
                    placement="top"
                    isOpen={showTooltip}
                    label={temperature / 10}
                >
                    <SliderThumb />
                </Tooltip>
            </Slider>
        </FormControl>
    );
}

function FormFontSize(): JSX.Element {
    const { config, setConfig } = useContext(SettingContext);
    const [fontsize, setFontsize] = useState(config.fontsize * 10);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <FormControl>
            <FormLabel color="teal">字体大小:</FormLabel>
            <Slider
                id="slider"
                defaultValue={fontsize}
                min={8}
                max={12}
                colorScheme="teal"
                onChange={(v) => {
                    setFontsize(v);
                    setConfig({ ...config, fontsize: v / 10 });
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <SliderMark value={10} mt="1" ml="-1" fontSize="sm">
                    1
                </SliderMark>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                    hasArrow
                    bg="teal.500"
                    color="white"
                    placement="top"
                    isOpen={showTooltip}
                    label={fontsize / 10}
                >
                    <SliderThumb />
                </Tooltip>
            </Slider>
        </FormControl>
    );
}
