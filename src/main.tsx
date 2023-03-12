import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, withDefaultColorScheme } from "@chakra-ui/react";
import App from "./App";
import "./styles.css";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme(
    {
        config: {
            initialColorMode: "system",
            useSystemColorMode: true,
        },
    },
    withDefaultColorScheme({ colorScheme: "teal" })
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
