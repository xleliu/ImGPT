import {
    Slider,
    SliderMark,
    SliderFilledTrack,
    Tooltip,
    SliderThumb,
    SliderTrack,
    SimpleGrid,
    Box,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { SettingContext } from "../utils/settingContext";

export default function () {
    const { reqParams, setReqParams } = useContext(SettingContext);

    const [temperature, setTemperature] = useState(6);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <SimpleGrid columns={5} spacing={5}>
            <Box height="80px">
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
            </Box>
            <Box height="80px"></Box>
            <Box height="80px"></Box>
            <Box height="80px"></Box>
            <Box height="80px"></Box>
        </SimpleGrid>
    );
}
