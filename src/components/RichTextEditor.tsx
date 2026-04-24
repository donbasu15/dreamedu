"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextAlign } from "@tiptap/extension-text-align";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Highlight } from "@tiptap/extension-highlight";
import { Typography } from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import { 
  FiBold, FiItalic, FiUnderline, FiLink, FiList, 
  FiGrid, FiAlignLeft, FiAlignCenter, FiAlignRight, 
  FiType, FiCheckSquare, FiPlusSquare, FiTrash2,
  FiRotateCcw, FiRotateCw, FiChevronDown
} from "react-icons/fi";

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {}
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          }
        },
      },
    }
  },
})

const MenuBar = ({ editor }: { editor: any }) => {
  const [, setUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;
    
    const handler = () => setUpdate(v => v + 1);
    
    // Listen to selection and formatting changes
    editor.on('transaction', handler);
    
    return () => {
      editor.off('transaction', handler);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const Button = ({ onClick, isActive, disabled, title, children, className = "" }: any) => (
    <button
      onMouseDown={(e) => { 
        e.preventDefault(); 
        if (!disabled) onClick(); 
      }}
      disabled={disabled}
      className={`p-2 rounded-md transition-all duration-200 flex items-center justify-center ${
        isActive 
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-400/50" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""} ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-16 z-20 w-full border-b border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center gap-1 p-2 shadow-sm transition-all duration-300">
      {/* History Group */}
      <div className="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
        <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><FiRotateCcw className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><FiRotateCw className="w-4 h-4" /></Button>
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Font Size Selector */}
      <div className="relative group">
        <select
          onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
          className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <option value="">Font Size</option>
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Formatting Group */}
      <div className="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
        <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><FiBold className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><FiItalic className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline"><FiUnderline className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive("highlight")} title="Highlight"><FiType className="w-4 h-4" /></Button>
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Headings */}
      <div className="flex items-center gap-0.5">
        {[2, 3].map(level => (
          <Button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
            isActive={editor.isActive("heading", { level })}
            className="text-xs font-bold px-3 py-2"
          >
            H{level}
          </Button>
        ))}
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Alignment Group */}
      <div className="flex items-center gap-0.5 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
        <Button onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><FiAlignLeft className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><FiAlignCenter className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><FiAlignRight className="w-4 h-4" /></Button>
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Lists Group */}
      <div className="flex items-center gap-0.5">
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List"><FiList className="w-4 h-4" /></Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Ordered List" className="text-xs font-bold px-2">1.</Button>
        <Button onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")} title="Task List"><FiCheckSquare className="w-4 h-4" /></Button>
      </div>

      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Utilities */}
      <Button onClick={addLink} isActive={editor.isActive("link")} title="Add Link"><FiLink className="w-4 h-4" /></Button>
      
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

      {/* Table Group */}
      <div className="flex items-center gap-1">
        <Button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
          <FiGrid className="w-4 h-4" />
        </Button>
        {editor.isActive('table') && (
          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-300 dark:border-slate-700">
            <button
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
              className="px-2 py-1 text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-700/50 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
            >
              +Col
            </button>
            <button
              onClick={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
              className="px-2 py-1 text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-700/50 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
            >
              +Row
            </button>
            <button
              onClick={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}
              className="p-1 px-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 transition-colors"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline cursor-pointer decoration-2 underline-offset-2',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({ multicolor: true }),
      Typography,
      TextStyle,
      Color,
      FontSize,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-slate lg:prose-lg max-w-none focus:outline-none p-6 md:p-8 min-h-[450px] w-full bg-card text-card-foreground transition-all duration-300 ease-in-out selection:bg-blue-100 dark:selection:bg-blue-500/30",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full relative group border border-border rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-none hover:border-blue-400/50 dark:hover:border-blue-500/30 transition-colors bg-card overflow-visible">
      <MenuBar editor={editor} />
      <div className="relative rounded-b-xl overflow-hidden">
        <EditorContent editor={editor} />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-50"></div>
      </div>
      <style jsx global>{`
        .ProseMirror {
          min-height: 450px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .prose ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .prose ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .prose ul[data-type="taskList"] input[type="checkbox"] {
          margin-top: 0.4rem;
          cursor: pointer;
          accent-color: #2563eb;
          width: 1.1rem;
          height: 1.1rem;
        }
        .prose table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        .dark .prose table {
          border-color: #334155;
        }
        .prose table td,
        .prose table th {
          min-width: 1em;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .dark .prose table td,
        .dark .prose table th {
          border-color: #334155;
        }
        .prose table th {
          font-weight: bold;
          text-align: left;
          background-color: #f8fafc;
        }
        .dark .prose table th {
          background-color: #1e293b;
        }
        .prose .tableWrapper {
          overflow-x: auto;
          margin: 1rem 0;
        }
        .prose blockquote {
          border-left: 4px solid #cbd5e1;
          padding-left: 1rem;
          font-style: italic;
          color: #64748b;
        }
        .dark .prose blockquote {
          border-left-color: #475569;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
