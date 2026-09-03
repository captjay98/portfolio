/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Type for SyntaxHighlighter props to fix TypeScript errors
type SyntaxHighlighterProps = React.ComponentProps<typeof SyntaxHighlighter>;

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  if (!content) {
    return <p className="text-muted-foreground">Nothing to preview</p>;
  }

  return (
    <div className={`prose dark:prose-invert max-w-none ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");

            // For code blocks with language, use SyntaxHighlighter
            if (match) {
              // Extract only valid props for SyntaxHighlighter and exclude problematic ones
              const { ...syntaxProps } = props as any;

              // Type assertion to help TypeScript understand what we're doing
              const safeProps = syntaxProps as SyntaxHighlighterProps;

              return (
                <SyntaxHighlighter
                  style={gruvboxDark}
                  language={match[1]}
                  PreTag="div"
                  {...safeProps}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            // For code blocks without language
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
