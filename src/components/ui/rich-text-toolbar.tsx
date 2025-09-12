import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Minus,
  Type,
  MousePointer,
  CornerDownLeft,
  ArrowDown
} from "lucide-react";
import { RefObject } from "react";

interface RichTextToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  onContentChange: (content: string) => void;
}

export const RichTextToolbar = ({ textareaRef, onContentChange }: RichTextToolbarProps) => {
  
  const insertText = (beforeText: string, afterText: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    
    const newContent = before + beforeText + textToInsert + afterText + after;
    
    onContentChange(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + beforeText.length + textToInsert.length + afterText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtNewLine = (text: string, addParagraphBreak: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(start);
    
    // For proper paragraph formatting: use double newlines
    let prefix = '';
    if (before && !before.endsWith('\n\n')) {
      if (addParagraphBreak) {
        prefix = before.endsWith('\n') ? '\n' : '\n\n';
      } else {
        prefix = before.endsWith('\n') ? '' : '\n';
      }
    }
    
    const suffix = addParagraphBreak ? '\n\n' : '\n';
    
    const newContent = before + prefix + text + suffix + after;
    onContentChange(newContent);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + text.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => insertText('**', '**', 'bold text');
  const formatItalic = () => insertText('*', '*', 'italic text');
  const formatUnderline = () => insertText('<u>', '</u>', 'underlined text');
  
  const addH1 = () => insertAtNewLine('# Heading 1');
  const addH2 = () => insertAtNewLine('## Heading 2');
  const addH3 = () => insertAtNewLine('### Heading 3');
  
  const addParagraph = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(start);
    
    // Insert double newline for proper paragraph break
    const prefix = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    const newContent = before + prefix + 'Your paragraph text here.\n\n' + after;
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + 'Your paragraph text here.'.length;
      textarea.setSelectionRange(start + prefix.length, newCursorPos);
    }, 0);
  };

  const addLineBreak = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(start);
    
    // Insert single line break (two spaces + newline for markdown)
    const newContent = before + '  \n' + after;
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + 3;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const addBulletList = () => insertAtNewLine('- List item 1\n- List item 2\n- List item 3', true);
  const addOrderedList = () => insertAtNewLine('1. First item\n2. Second item\n3. Third item', true);
  
  const addHorizontalRule = () => insertAtNewLine('---', true);
  
  const addButton = () => insertText('<button class="btn btn-primary">', '</button>', 'Button Text');

  return (
    <div className="border border-border rounded-lg p-2 mb-2 bg-card">
      <div className="flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatUnderline}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addH1}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addH2}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addH3}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addParagraph}
          title="Add Paragraph (Double line break)"
        >
          <Type className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLineBreak}
          title="Add Line Break (Single line break)"
        >
          <CornerDownLeft className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addBulletList}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addOrderedList}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        {/* Elements */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addButton}
          title="Add Button"
        >
          <MousePointer className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addHorizontalRule}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};