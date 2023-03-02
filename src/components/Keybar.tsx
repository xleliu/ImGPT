import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { getInputValue, getApiKey } from "../utils/selector";

export default function () {
    function onChange(value: string) {
        localStorage.setItem("openai-key", value);
    }
    return (
        <Editable placeholder="输入你的秘钥" defaultValue={getApiKey()} onChange={onChange}>
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
}
