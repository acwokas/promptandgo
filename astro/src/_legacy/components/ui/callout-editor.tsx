import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Edit } from "lucide-react"

interface CalloutEditorProps {
  selectedText: string
  onUpdate: (newMarkup: string) => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ParsedCallout {
  type: 'PromptExample' | 'CalloutBox' | 'CodeBlock' | 'TipCallout'
  template?: string
  example?: string
  variant?: string
  title?: string
  content?: string
}

export function CalloutEditor({ selectedText, onUpdate, trigger, open, onOpenChange }: CalloutEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [calloutData, setCalloutData] = useState<ParsedCallout | null>(null)
  const [template, setTemplate] = useState("")
  const [example, setExample] = useState("")
  const [variant, setVariant] = useState("default")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // Parse different callout types
  const parseCallout = (text: string): ParsedCallout | null => {
    // PromptExample
    const promptExampleMatch = text.match(/<PromptExample\s+([^>]*)\s*\/?>/i)
    if (promptExampleMatch) {
      const attrs = promptExampleMatch[1]
      const templateMatch = attrs.match(/template="([^"]*)"/)
      const exampleMatch = attrs.match(/example="([^"]*)"/)
      
      return {
        type: 'PromptExample',
        template: templateMatch?.[1] || '',
        example: exampleMatch?.[1] || ''
      }
    }

    // CalloutBox
    const calloutBoxMatch = text.match(/<CalloutBox\s+variant="([^"]*)"(?:\s+title="([^"]*)")?\s*>([\s\S]*?)<\/CalloutBox>/i)
    if (calloutBoxMatch) {
      return {
        type: 'CalloutBox',
        variant: calloutBoxMatch[1] || 'default',
        title: calloutBoxMatch[2] || '',
        content: calloutBoxMatch[3] || ''
      }
    }

    // CodeBlock
    const codeBlockMatch = text.match(/<CodeBlock(?:\s+title="([^"]*)")?\s*>([\s\S]*?)<\/CodeBlock>/i)
    if (codeBlockMatch) {
      return {
        type: 'CodeBlock',
        title: codeBlockMatch[1] || '',
        content: codeBlockMatch[2] || ''
      }
    }

    // TipCallout
    const tipCalloutMatch = text.match(/<TipCallout\s*>([\s\S]*?)<\/TipCallout>/i)
    if (tipCalloutMatch) {
      return {
        type: 'TipCallout',
        content: tipCalloutMatch[1] || ''
      }
    }

    return null
  }

  // Check if selected text contains a callout
  const isCalloutSelected = () => {
    return parseCallout(selectedText) !== null
  }

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (isOpen && selectedText) {
      const parsed = parseCallout(selectedText)
      if (parsed) {
        setCalloutData(parsed)
        setTemplate(parsed.template || '')
        setExample(parsed.example || '')
        setVariant(parsed.variant || 'default')
        setTitle(parsed.title || '')
        setContent(parsed.content || '')
      }
    }
  }, [isOpen, selectedText])

  const handleSave = () => {
    if (!calloutData) return

    let newMarkup = ''

    switch (calloutData.type) {
      case 'PromptExample':
        newMarkup = `<PromptExample template="${template}" example="${example}" />`
        break
      case 'CalloutBox':
        newMarkup = `<CalloutBox variant="${variant}"${title ? ` title="${title}"` : ''}>${content}</CalloutBox>`
        break
      case 'CodeBlock':
        newMarkup = `<CodeBlock${title ? ` title="${title}"` : ''}>${content}</CodeBlock>`
        break
      case 'TipCallout':
        newMarkup = `<TipCallout>${content}</TipCallout>`
        break
    }

    onUpdate(newMarkup)
    setIsOpen(false)
    onOpenChange?.(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  // If no callout is selected, don't render anything
  if (!isCalloutSelected()) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Callout
        </Button>
      )}
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {calloutData?.type}</DialogTitle>
          <DialogDescription>
            Modify the properties of your callout
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {calloutData?.type === 'PromptExample' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="template">Template *</Label>
                <Textarea
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Enter the prompt template"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">Example</Label>
                <Input
                  id="example"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Enter an example"
                />
              </div>
            </>
          )}

          {calloutData?.type === 'CalloutBox' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Select value={variant} onValueChange={setVariant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="danger">Danger</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter callout title (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter callout content"
                  rows={4}
                />
              </div>
            </>
          )}

          {(calloutData?.type === 'CodeBlock' || calloutData?.type === 'TipCallout') && (
            <>
              {calloutData.type === 'CodeBlock' && (
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter code block title (optional)"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Enter ${calloutData.type === 'CodeBlock' ? 'code' : 'tip'} content`}
                  rows={4}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}