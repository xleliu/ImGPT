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
import { useState, useContext } from "react";
import { SettingContext } from "../utils/settingContext";

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
        return v.slice(0, 3) + "*".repeat(44) + v.slice(-4);
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
            <FormLabel color="teal">Temperature:</FormLabel>
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
