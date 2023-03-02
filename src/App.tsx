import { useState } from "react";
import Keybar from "./components/Keybar";
import Chat from "./components/Chat";
import "./App.css";
import { Stack } from "@chakra-ui/react";

function App() {
    return (
        <Stack spacing={4}>
            <Keybar />
            <Chat />
        </Stack>
    );
}

export default App;
