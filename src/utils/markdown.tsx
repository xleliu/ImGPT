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
                const el = (
                    // 这里属于remote HTML content，无法直接使用 chakra 的组件
                    // https://chakra-ui.com/community/recipes/prose
                    <code
                        style={{
                            backgroundColor: "#BEE3F8",
                            padding: "1px 4px",
                            margin: "0px 4px",
                            borderRadius: "2px",
                        }}
                    >
                        {inlineCode.slice(1, -1)}
                    </code>
                );
                return ReactDOMServer.renderToString(el);
            } else {
                return match;
            }
        }
    );

    return <div dangerouslySetInnerHTML={{ __html: jsx }} />;
};
