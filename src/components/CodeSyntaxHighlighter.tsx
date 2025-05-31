import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeSyntaxHighlighterProps {
  code: string;
  language: string;
  highlightedLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

const CodeSyntaxHighlighter = ({
  code,
  language,
  highlightedLines = [],
  showLineNumbers = true,
  className = "",
}: CodeSyntaxHighlighterProps) => {
  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "1.5rem",
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
      fontSize: "14px",
      lineHeight: "1.6",
    },
  };

  const lineNumberStyle = {
    color: "rgba(156, 163, 175, 0.5)",
    fontSize: "12px",
    minWidth: "2.5em",
    paddingRight: "1em",
  };

  const getLineProps = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const isPrimary =
      highlightedLines.length > 0 && highlightedLines[0] === lineNumber;

    return {
      style: {
        display: "block",
        backgroundColor: isHighlighted
          ? isPrimary
            ? "rgba(59, 130, 246, 0.3)"
            : "rgba(59, 130, 246, 0.15)"
          : "transparent",
        borderLeft: isHighlighted
          ? isPrimary
            ? "4px solid rgb(59, 130, 246)"
            : "3px solid rgba(59, 130, 246, 0.7)"
          : "3px solid transparent",
        paddingLeft: "0.5rem",
        paddingRight: "2rem",
        transition: "all 0.3s ease",
        marginLeft: isHighlighted ? "2px" : "0px",
        minWidth: "100%",
        width: "max-content",
        boxSizing: "border-box" as const,
      },
    };
  };

  return (
    <div className={`${className}`}>
      <div className="transition-opacity duration-200" key={language}>
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={lineNumberStyle}
          wrapLines={true}
          lineProps={getLineProps}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeSyntaxHighlighter;
