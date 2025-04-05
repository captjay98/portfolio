// import { useState, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import {
//   Maximize2, Minimize2, Code, Bold, Italic,
//   List, ListOrdered, Image, Link, Heading1,
//   Heading2, Heading3, Quote, CheckSquare,
//   AlertTriangle, Info, Table
// } from 'lucide-react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import remarkGfm from 'remark-gfm';

// interface EnhancedMarkdownEditorProps {
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
//   placeholder?: string;
// }

// // Type for SyntaxHighlighter props to fix TypeScript errors
// type SyntaxHighlighterProps = React.ComponentProps<typeof SyntaxHighlighter>;

// export function EnhancedMarkdownEditor({
//   value,
//   onChange,
//   className,
//   placeholder = "Write your content in Markdown...",
// }: EnhancedMarkdownEditorProps) {
//   const [activeTab, setActiveTab] = useState<string>("edit");
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // Handle markdown syntax insertions
//   const insertMarkdown = (prefix: string, suffix = '') => {
//     const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = value.substring(start, end);

//     const newText =
//       value.substring(0, start) +
//       prefix +
//       selectedText +
//       suffix +
//       value.substring(end);

//     onChange(newText);

//     // Focus and set cursor position after operation
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(
//         start + prefix.length,
//         start + prefix.length + selectedText.length
//       );
//     }, 0);
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);

//     // When entering fullscreen, manipulate body scroll
//     if (!isFullscreen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//   };

//   // Clean up effect to restore scrolling on unmount if in fullscreen
//   useEffect(() => {
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, []);

//   // Add specific code block with language
//   const addCodeBlock = (language: string = '') => {
//     insertMarkdown(`\n\`\`\`${language}\n`, `\n\`\`\`\n`);
//   };

//   // Insert horizontal rule
//   const insertHorizontalRule = () => {
//     insertMarkdown('\n---\n');
//   };

//   // Insert table of contents marker
//   const insertTableOfContents = () => {
//     insertMarkdown('\n[TOC]\n');
//   };

//   // Insert footnote
//   const insertFootnote = () => {
//     insertMarkdown('[^footnote]', '\n\n[^footnote]: Write your footnote text here');
//   };

//   // List of available code languages for quick insertion
//   const codeLanguages = ['js', 'typescript', 'tsx', 'jsx', 'php', 'css', 'html', 'python', 'bash', 'json', 'yaml', 'sql',];

//   return (
//     <div className={cn(
//       "w-full rounded-md border transition-all duration-300 ease-in-out",
//       isFullscreen && "fixed inset-0 z-[100] bg-background p-4",
//       className
//     )}>
//       <Tabs
//         defaultValue="edit"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className={cn("h-full flex flex-col", isFullscreen && "h-full")}
//       >
//         <div className="flex items-center justify-between px-4 py-2 border-b">
//           <TabsList>
//             <TabsTrigger value="edit">Edit</TabsTrigger>
//             <TabsTrigger value="preview">Preview</TabsTrigger>
//             <TabsTrigger value="split">Split View</TabsTrigger>
//           </TabsList>

//           <div className="flex items-center">
//             <div className="flex flex-wrap gap-1 mr-4 overflow-x-auto max-w-[600px] scrollbar-thin">
//               {/* Headers */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('# ')}
//                 title="Heading 1"
//               >
//                 <Heading1 className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('## ')}
//                 title="Heading 2"
//               >
//                 <Heading2 className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('### ')}
//                 title="Heading 3"
//               >
//                 <Heading3 className="h-4 w-4" />
//               </Button>

//               {/* Text formatting */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('**', '**')}
//                 title="Bold"
//               >
//                 <Bold className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('*', '*')}
//                 title="Italic"
//               >
//                 <Italic className="h-4 w-4" />
//               </Button>

//               {/* Lists */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n- ')}
//                 title="Bulleted List"
//               >
//                 <List className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n1. ')}
//                 title="Numbered List"
//               >
//                 <ListOrdered className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n- [ ] ')}
//                 title="Task List"
//               >
//                 <CheckSquare className="h-4 w-4" />
//               </Button>

//               {/* Media and links */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('[', '](url)')}
//                 title="Link"
//               >
//                 <Link className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('![Alt text](', ')')}
//                 title="Image"
//               >
//                 <Image className="h-4 w-4" />
//               </Button>

//               {/* Blockquote */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('> ')}
//                 title="Quote"
//               >
//                 <Quote className="h-4 w-4" />
//               </Button>

//               {/* Table */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n')}
//                 title="Table"
//               >
//                 <Table className="h-4 w-4" />
//               </Button>

//               {/* Horizontal rule */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={insertHorizontalRule}
//                 title="Horizontal Rule"
//               >
//                 —
//               </Button>

//               {/* Code dropdown */}
//               <div className="relative group">
//                 <Button
//                   type="button" size="icon" variant="ghost"
//                   title="Code Block"
//                 >
//                   <Code className="h-4 w-4" />
//                 </Button>
//                 <div className="absolute hidden group-hover:block right-0 mt-2 bg-card border rounded-md shadow-lg p-2 z-50 w-48">
//                   <div className="text-xs font-medium mb-1 text-muted-foreground">Select language:</div>
//                   <div className="grid grid-cols-2 gap-1">
//                     {codeLanguages.map(lang => (
//                       <Button
//                         key={lang}
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="justify-start text-xs h-7"
//                         onClick={() => addCodeBlock(lang)}
//                       >
//                         {lang}
//                       </Button>
//                     ))}
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="justify-start text-xs h-7"
//                       onClick={() => addCodeBlock()}
//                     >
//                       plain
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Callouts */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n> **Note:** ', '\n')}
//                 title="Note"
//               >
//                 <Info className="h-4 w-4" />
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={() => insertMarkdown('\n> **Warning:** ', '\n')}
//                 title="Warning"
//               >
//                 <AlertTriangle className="h-4 w-4" />
//               </Button>

//               {/* Advanced features */}
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={insertTableOfContents}
//                 title="Table of Contents"
//               >
//                 TOC
//               </Button>
//               <Button
//                 type="button" size="icon" variant="ghost"
//                 onClick={insertFootnote}
//                 title="Footnote"
//               >
//                 [^]
//               </Button>
//             </div>

//             <Button
//               onClick={toggleFullscreen}
//               variant="outline"
//               size="icon"
//               title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
//             >
//               {isFullscreen ?
//                 <Minimize2 className="h-4 w-4" /> :
//                 <Maximize2 className="h-4 w-4" />
//               }
//             </Button>
//           </div>
//         </div>

//         <TabsContent value="edit" className="p-0 flex-1 overflow-auto flex flex-col">
//           <Textarea
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
//           />
//         </TabsContent>

//         <TabsContent value="preview" className="p-4 overflow-auto flex-1">
//           <div className="prose dark:prose-invert max-w-none">
//             {value ? (
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   // Fixed typescript error with proper type handling
//                   code: ({node,  className, children, ...props}) => {
//                     const match = /language-(\w+)/.exec(className || '');

//                     // For code blocks with language, use SyntaxHighlighter
//                     if ( match) {
//                       // Extract only valid props for SyntaxHighlighter and exclude problematic ones
//                       const { ref, ...syntaxProps } = props as any;

//                       // Type assertion to help TypeScript understand what we're doing
//                       const safeProps = syntaxProps as SyntaxHighlighterProps;

//                       return (
//                         <SyntaxHighlighter
//                           style={gruvboxDark}
//                           language={match[1]}
//                           PreTag="div"
//                           {...safeProps}
//                         >
//                           {String(children).replace(/\n$/, '')}
//                         </SyntaxHighlighter>
//                       );
//                     }

//                     // For code blocks without language
//                     return (
//                       <code className={className} {...props}>
//                         {children}
//                       </code>
//                     );
//                   }
//                 }}
//               >
//                 {value}
//               </ReactMarkdown>
//             ) : (
//               <p className="text-muted-foreground">Nothing to preview</p>
//             )}
//           </div>
//         </TabsContent>

//         <TabsContent value="split" className="flex-1 overflow-hidden grid grid-cols-2 gap-0">
//           <Textarea
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className="resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-full font-mono"
//           />
//           <div className="p-4 overflow-auto border-l prose dark:prose-invert max-w-none">
//             {value ? (
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}

//                 components={{
//                   // Reuse the same component definition to avoid duplication
//                   code: ({node, className, children, ...props}) => {
//                     const match = /language-(\w+)/.exec(className || '');

//                     if ( match) {
//                       const { ref, ...syntaxProps } = props as any;
//                       const safeProps = syntaxProps as SyntaxHighlighterProps;

//                       return (
//                         <SyntaxHighlighter
//                           style={gruvboxDark}
//                           language={match[1]}
//                           PreTag="div"
//                           {...safeProps}
//                         >
//                           {String(children).replace(/\n$/, '')}
//                         </SyntaxHighlighter>
//                       );
//                     }

//                     return (
//                       <code className={className} {...props}>
//                         {children}
//                       </code>
//                     );
//                   }
//                 }}
//               >
//                 {value}
//               </ReactMarkdown>
//             ) : (
//               <p className="text-muted-foreground">Nothing to preview</p>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

export const categories = [
  { value: "all", label: "All Projects" },
  { value: "fullstack", label: "Full-Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "featured", label: "Featured" },
];

export const allProjects = [
  {
    id: 1,
    name: "Kalbites",
    image: "/kalbites.jpg",
    description:
      "Backend built with Hono running on Bun with PostgreSQL as DB. Frontend in React.",
    longDescription:
      "Backend is currently built with Hono running on Bun with PostgreSQl as DB. The Backend was previously built with Express.js running on NodeJs with MongoDb as DB. The frontend is still React, previous one was built with JSX.",
    technologies: ["Hono", "Bun", "PostgreSQL", "React"],
    category: "fullstack",
    github: "https://www.github.com/captjay98/kalbites_frontend",
    live: "https://kalbites.vercel.app/",
    featured: true,
  },
  {
    id: 2,
    name: "Ticketer",
    image: "/ticketer.jpg",
    description:
      "Train Booking App built with Laravel, PostgreSQL, and Vue/Inertia.",
    longDescription:
      "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Train Booking App with all the features required for a Booking Platform to work.",
    technologies: ["Laravel", "PostgreSQL", "Vue", "Inertia"],
    category: "fullstack",
    github: "https://www.github.com/captjay98/jobsite",
    live: "https://ticketer.fly.dev/",
    featured: true,
  },
  {
    id: 3,
    name: "Raffle Suites",
    image: "/rafflesuites.webp",
    description:
      "Full-Stack Hotel Website built with NextJS 14 with top-notch SEO.",
    longDescription:
      "This is a Full-Stack App cooked up with nextjs14 with Top Notch SEO. It is also visually appealing and also has all the basic features required for a Hotel Website to work, with room for additional features.",
    technologies: ["Next.js", "React", "Tailwind CSS", "SEO"],
    category: "fullstack",
    github: "https://www.github.com/captjay98/rafflesuites",
    live: "https://raffle-suites.vercel.app/",
    featured: true,
  },
  {
    id: 4,
    name: "Bumsa Election Portal",
    image: "/bumsa.webp",
    description:
      "Voting platform for BUK Medical Students Association Elections using Laravel & Vue.",
    longDescription:
      "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Voting platform for BUK Medical Students Association Elections.",
    technologies: ["Laravel", "PostgreSQL", "Vue", "Inertia"],
    category: "fullstack",
    github: "https://www.github.com/captjay98/bumsa",
    live: "https://bumsa.fly.dev/",
  },
  {
    id: 5,
    name: "Abata Crafts",
    image: "/abatacrafts.webp",
    description: "Online Shop with custom payment & delivery integrations.",
    longDescription:
      "This is an online Shop built with Medusajs. I added a Paytack Integration for payment, and also built a custom fullfillment provider for delivery from Kaduna using Public Transport delivery or Gig Logistics.",
    technologies: [
      "Medusajs",
      "React",
      "Payment Integration",
      "Custom Fulfillment",
    ],
    category: "fullstack",
    github: "https://www.github.com/captjay98/abatacrafts-storefront",
    live: "https://abatacrafts.vercel.app/",
  },
  {
    id: 6,
    name: "Jobsite",
    image: "/jobsite.webp",
    description:
      "Complete job platform with seeker, employer and admin features.",
    longDescription:
      "I built the Backend Of this project using Laravel and PGSQl. The Frontend was buitlt with Inertiajs/Vue3. It is a Jobsite with all the features required for a jobsite to work, Seeker, Employer and Admin Features.",
    technologies: ["Laravel", "PostgreSQL", "Vue", "Inertia"],
    category: "fullstack",
    github: "https://www.github.com/captjay98/jobsite",
    live: "https://jobsite-fejw.onrender.com",
  },
  {
    id: 7,
    name: "SBTravels",
    image: "/sbtravel.webp",
    description:
      "Travel agency website built with NextJS 13 focused on reach and visibility.",
    longDescription:
      "I built this with the NextJs13. It is a website for a Travel Agency, that wants to expand their reach and visibility. It is mostly an SSG site for now. But I left room for future Intergrations and Updates.",
    technologies: ["Next.js", "React", "SEO", "SSG"],
    category: "frontend",
    github: "https://www.github.com/captjay98/sbtravels",
    live: "https://sbtravels.vercel.app/",
  },
  {
    id: 8,
    name: "Interview Django",
    image: "/inter.webp",
    description:
      "API server for a job platform built with Django and PostgreSQL.",
    longDescription:
      "This is an Api server for a Job Platform built with, Django, Django-Rest-Framework and PostgreSQL. It has most of the features available on most Job Platforms.",
    technologies: ["Django", "DRF", "PostgreSQL", "RESTful API"],
    category: "backend",
    github: "https://www.github.com/captjay98/jobsite-django",
    live: "https://jobsite-django.onrender.com/",
  },
];
