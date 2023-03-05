import { Editable, EditablePreview, EditableInput, HStack, Text } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { SettingContext } from "../utils/settingContext";
import { getApiKey } from "../utils/localStorage";

export default function () {
    const { setApiKey } = useContext(SettingContext);
    useEffect(() => {
        setApiKey(getApiKey());
    });

    const getValue = () => {
        const key = getApiKey();
        if (key == "") {
            return "";
        }
        return key.slice(0, 3) + "********************************" + key.slice(-4);
    };
    const onSubmit = (value: string) => {
        localStorage.setItem("openai-key", value);
        setValue(getValue());
        setApiKey(value);
    };
    const onChange = (value: string) => {
        setValue(value);
    };
    const onEdit = () => {
        setValue(getApiKey());
    };
    const [value, setValue] = useState(getValue());

    return (
        <HStack>
            <Text
                as="b"
                color="teal"
                style={{
                    width: "90px",
                    textAlign: "left",
                }}
            >
                当前秘钥：
            </Text>
            <Editable
                style={{
                    textAlign: "left",
                    width: "calc(100vw - 90px)",
                }}
                placeholder="请输入你的秘钥……"
                value={value}
                onChange={onChange}
                onSubmit={onSubmit}
                onEdit={onEdit}
            >
                <EditablePreview style={{ color: "gray" }} />
                <EditableInput />
            </Editable>
        </HStack>
    );
}
