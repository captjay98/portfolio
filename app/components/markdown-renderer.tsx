/* eslint-disable @typescript-eslint/no-explicit-any */

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Authentic Ayu Dark syntax theme
const ayuDarkTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#d9d7d3',
    background: '#0a0e14',
    fontFamily: '"JetBrains Mono", Consolas, Monaco, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    tabSize: 2,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#d9d7d3',
    background: '#0a0e14',
    fontFamily: '"JetBrains Mono", Consolas, Monaco, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    tabSize: 2,
    hyphens: 'none',
    padding: '1.25rem',
    margin: '1.5rem 0',
    overflow: 'auto',
    borderRadius: '0.5rem',
    border: '1px solid #1e2430',
  },
  comment: { color: '#949dab', fontStyle: 'italic' },
  prolog: { color: '#949dab', fontStyle: 'italic' },
  doctype: { color: '#949dab', fontStyle: 'italic' },
  cdata: { color: '#949dab', fontStyle: 'italic' },
  punctuation: { color: '#d9d7d3' },
  property: { color: '#39bae6' },
  tag: { color: '#39bae6' },
  boolean: { color: '#ff8f40' },
  number: { color: '#e6b673' },
  constant: { color: '#e6b673' },
  symbol: { color: '#e6b673' },
  deleted: { color: '#f07178' },
  selector: { color: '#aad94c' },
  'attr-name': { color: '#ffb454' },
  string: { color: '#aad94c' },
  char: { color: '#aad94c' },
  builtin: { color: '#59c2ff' },
  inserted: { color: '#aad94c' },
  operator: { color: '#f07178' },
  entity: { color: '#59c2ff' },
  url: { color: '#39bae6' },
  variable: { color: '#d9d7d3' },
  atrule: { color: '#ff8f40' },
  'attr-value': { color: '#aad94c' },
  keyword: { color: '#ff8f40' },
  function: { color: '#ffb454' },
  'class-name': { color: '#59c2ff' },
  regex: { color: '#95e6cb' },
  important: { color: '#ff8f40', fontWeight: 'bold' },
};

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
              const { ...syntaxProps } = props as any;
              const safeProps = syntaxProps as SyntaxHighlighterProps;

              return (
                <SyntaxHighlighter
                  style={ayuDarkTheme as any}
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
