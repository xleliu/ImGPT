import {
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
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { SettingContext } from "../utils/settingContext";
import { updateApiKey, getConfig } from "../utils/localStorage";

export default function () {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={10} height="80px">
            <GridItem colSpan={3}>
                <FormApiKey />
            </GridItem>
            <GridItem colSpan={1}>
                <FormTemperature />
            </GridItem>
        </Grid>
    );
}

function FormApiKey(): JSX.Element {
    // for localstorage
    const config = getConfig();
    // for form
    const [value, setValue] = useState(secretValue(config.apiKey));
    // for update openai config
    const { setApiKey } = useContext(SettingContext);

    useEffect(() => {
        setApiKey(config.apiKey);
    });

    const onSubmit = (v: string) => {
        updateApiKey(v);
        setValue(secretValue(v));
        setApiKey(v);
    };

    function secretValue(v: string) {
        if (v == "") {
            return "";
        }
        return v.slice(0, 3) + "********************************" + v.slice(-4);
    }

    return (
        <FormControl>
            <FormLabel color="teal">当前秘钥</FormLabel>
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
                <EditableInput />
            </Editable>
        </FormControl>
    );
}

function FormTemperature(): JSX.Element {
    const { reqParams, setReqParams } = useContext(SettingContext);
    const [temperature, setTemperature] = useState(6);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <FormControl>
            <FormLabel color="teal">Temperature:</FormLabel>
            <Slider
                id="slider"
                defaultValue={6}
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
