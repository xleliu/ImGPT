import { Editable, EditablePreview, EditableInput, FormControl, FormLabel } from "@chakra-ui/react";
import { getApiKey } from "../utils/selector";
import { useState } from "react";

export default function () {
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
    };
    const onChange = (value: string) => {
        setValue(value);
    };
    const onEdit = () => {
        setValue(getApiKey());
    };
    const [value, setValue] = useState(getValue());

    return (
        <FormControl>
            <FormLabel>当前秘钥：</FormLabel>
            <Editable
                style={{
                    textAlign: "left",
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
        </FormControl>
    );
}
