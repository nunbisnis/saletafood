"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HtmlContent } from "@/components/ui/html-content";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Edit,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichTextEditorWithPreviewProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditorWithPreview({
  value,
  onChange,
  placeholder = "Write something...",
  className = "",
  minHeight = "200px",
}: RichTextEditorWithPreviewProps) {
  const [text, setText] = useState(value || "");
  const [activeTab, setActiveTab] = useState<string>("edit");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Update the text when the value prop changes
  useEffect(() => {
    setText(value || "");
  }, [value]);

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => {
      setText("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    };
    
    const editorContainer = textareaRef.current?.closest('.rich-text-editor');
    if (editorContainer) {
      editorContainer.addEventListener('reset', handleReset);
      return () => {
        editorContainer.removeEventListener('reset', handleReset);
      };
    }
  }, []);

  // Function to handle text formatting
  const formatText = (tag: string, attributes: Record<string, string> = {}) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    // Create opening tag with attributes
    let openingTag = `<${tag}`;
    for (const [key, value] of Object.entries(attributes)) {
      openingTag += ` ${key}="${value}"`;
    }
    openingTag += ">";

    // Create closing tag
    const closingTag = `</${tag}>`;

    // Insert the tags around the selected text
    const newText =
      textarea.value.substring(0, start) +
      openingTag +
      selectedText +
      closingTag +
      textarea.value.substring(end);

    // Update the text state
    setText(newText);
    onChange(newText);

    // Set focus back to textarea and adjust selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openingTag.length,
        start + openingTag.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <Tabs 
        defaultValue="edit" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "edit" && (
            <div className="toolbar flex flex-wrap gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("b")}
                      type="button"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("i")}
                      type="button"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("u")}
                      type="button"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("h1")}
                      type="button"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Heading 1</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("h2")}
                      type="button"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Heading 2</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("ul")}
                      type="button"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("ol")}
                      type="button"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("p", { align: "left" })}
                      type="button"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Left</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("p", { align: "center" })}
                      type="button"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Center</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText("p", { align: "right" })}
                      type="button"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Align Right</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight }}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div 
            className="w-full rounded-md border border-input bg-background px-3 py-2 prose prose-sm max-w-none overflow-auto" 
            style={{ minHeight }}
          >
            {text ? (
              <HtmlContent html={text} />
            ) : (
              <p className="text-muted-foreground">{placeholder}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
