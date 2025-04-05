import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  Code,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  CheckSquare,
  AlertTriangle,
  Info,
  Table,
  ImageIcon,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface EnhancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function EnhancedMarkdownEditor({
  value,
  onChange,
  className,
  placeholder = "Write your content in Markdown...",
}: EnhancedMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle markdown syntax insertions
  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newText);

    // Focus and set cursor position after operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 0);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    // When entering fullscreen, manipulate body scroll
    if (!isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  // Clean up effect to restore scrolling on unmount if in fullscreen
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Add specific code block with language
  const addCodeBlock = (language: string = "") => {
    insertMarkdown(`\n\`\`\`${language}\n`, `\n\`\`\`\n`);
  };

  // Insert horizontal rule
  const insertHorizontalRule = () => {
    insertMarkdown("\n---\n");
  };

  // Insert table of contents marker
  const insertTableOfContents = () => {
    insertMarkdown("\n[TOC]\n");
  };

  // Insert footnote
  const insertFootnote = () => {
    insertMarkdown(
      "[^footnote]",
      "\n\n[^footnote]: Write your footnote text here",
    );
  };

  // List of available code languages for quick insertion
  const codeLanguages = [
    "js",
    "typescript",
    "tsx",
    "jsx",
    "php",
    "css",
    "html",
    "python",
    "bash",
    "json",
    "yaml",
    "sql",
  ];

  return (
    <div
      className={cn(
        "w-full rounded-md border transition-all duration-300 ease-in-out",
        isFullscreen && "fixed inset-0 z-[100] bg-background p-4",
        className,
      )}
    >
      <Tabs
        defaultValue="edit"
        value={activeTab}
        onValueChange={setActiveTab}
        className={cn("h-full flex flex-col", isFullscreen && "h-full")}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>

          <div className="flex items-center">
            <div className="flex flex-wrap gap-1 mr-4 overflow-x-auto max-w-[600px] scrollbar-thin">
              {/* Headers */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("# ")}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("## ")}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("### ")}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>

              {/* Text formatting */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("**", "**")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("*", "*")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>

              {/* Lists */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("\n- ")}
                title="Bulleted List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("\n1. ")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("\n- [ ] ")}
                title="Task List"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>

              {/* Media and links */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("[", "](url)")}
                title="Link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("![Alt text](", ")")}
                title="Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              {/* Blockquote */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("> ")}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>

              {/* Table */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  insertMarkdown(
                    "\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n",
                  )
                }
                title="Table"
              >
                <Table className="h-4 w-4" />
              </Button>

              {/* Horizontal rule */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={insertHorizontalRule}
                title="Horizontal Rule"
              >
                —
              </Button>

              {/* Code dropdown */}
              <div className="relative group">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <div className="absolute hidden group-hover:block right-0 mt-2 bg-card border rounded-md shadow-lg p-2 z-50 w-48">
                  <div className="text-xs font-medium mb-1 text-muted-foreground">
                    Select language:
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {codeLanguages.map((lang) => (
                      <Button
                        key={lang}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="justify-start text-xs h-7"
                        onClick={() => addCodeBlock(lang)}
                      >
                        {lang}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs h-7"
                      onClick={() => addCodeBlock()}
                    >
                      plain
                    </Button>
                  </div>
                </div>
              </div>

              {/* Callouts */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("\n> **Note:** ", "\n")}
                title="Note"
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown("\n> **Warning:** ", "\n")}
                title="Warning"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>

              {/* Advanced features */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={insertTableOfContents}
                title="Table of Contents"
              >
                TOC
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={insertFootnote}
                title="Footnote"
              >
                [^]
              </Button>
            </div>

            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="icon"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <TabsContent
          value="edit"
          className="p-0 flex-1 overflow-auto flex flex-col"
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 overflow-auto flex-1">
          <MarkdownRenderer content={value} />
        </TabsContent>

        <TabsContent
          value="split"
          className="flex-1 overflow-hidden grid grid-cols-2 gap-0"
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-full font-mono"
          />
          <div className="p-4 overflow-auto border-l">
            <MarkdownRenderer content={value} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
