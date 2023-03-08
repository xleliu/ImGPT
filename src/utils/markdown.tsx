import { Code } from "@chakra-ui/react";
import ReactDOMServer from "react-dom/server";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
    language: string;
    children: string;
}

interface MarkdownProps {
    source: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
    return (
        <SyntaxHighlighter language={language} style={solarizedlight}>
            {children}
        </SyntaxHighlighter>
    );
};

export const Markdown: React.FC<MarkdownProps> = ({ source }) => {
    const jsx = source.replace(
        /(```([a-zA-Z]+)?\s*([\s\S]*?)```)|(`[^`]*`)/g,
        (match: string, codeBlock: string, lang: string, code: string, inlineCode: string) => {
            if (codeBlock) {
                const el = <CodeBlock language={lang}>{code}</CodeBlock>;
                return ReactDOMServer.renderToString(el);
            } else if (inlineCode) {
                const el = <Code colorScheme="yellow">{inlineCode.slice(1, -1)}</Code>;
                return ReactDOMServer.renderToString(el);
            } else {
                return match;
            }
        }
    );

    return <div dangerouslySetInnerHTML={{ __html: jsx }} />;
};
