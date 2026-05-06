import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalloutBox, PromptExample, CodeBlock, TipCallout } from "./callout-box"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Code, Lightbulb, Info, AlertTriangle, CheckCircle } from "lucide-react"

interface CalloutInserterProps {
  onInsert: (markdown: string) => void
  trigger?: React.ReactNode
}

export const CalloutInserter: React.FC<CalloutInserterProps> = ({ 
  onInsert, 
  trigger 
}) => {
  const [open, setOpen] = useState(false)
  const [calloutType, setCalloutType] = useState<string>("prompt")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [template, setTemplate] = useState("")
  const [example, setExample] = useState("")

  const calloutTypes = [
    { id: "prompt", label: "Prompt Template", icon: MessageSquare, description: "Structured prompt with example" },
    { id: "code", label: "Code Block", icon: Code, description: "Code snippet or command" },
    { id: "tip", label: "Pro Tip", icon: Lightbulb, description: "Helpful tip or insight" },
    { id: "info", label: "Information", icon: Info, description: "Important information" },
    { id: "warning", label: "Warning", icon: AlertTriangle, description: "Caution or warning" },
    { id: "success", label: "Success", icon: CheckCircle, description: "Success message or achievement" }
  ]

  const generateMarkdown = () => {
    switch (calloutType) {
      case "prompt":
        return `<PromptExample 
  template="${template}" 
  example="${example}" 
/>`
      case "code":
        return `<CodeBlock title="${title}">
${content}
</CodeBlock>`
      case "tip":
        return `<TipCallout>
${content}
</TipCallout>`
      default:
        return `<CalloutBox variant="${calloutType}" title="${title}">
${content}
</CalloutBox>`
    }
  }

  const handleInsert = () => {
    const markdown = generateMarkdown()
    onInsert(markdown)
    setOpen(false)
    // Reset form
    setTitle("")
    setContent("")
    setTemplate("")
    setExample("")
  }

  const renderPreview = () => {
    switch (calloutType) {
      case "prompt":
        if (!template && !example) return null
        return <PromptExample template={template} example={example} />
      case "code":
        if (!content) return null
        return <CodeBlock title={title}>{content}</CodeBlock>
      case "tip":
        if (!content) return null
        return <TipCallout>{content}</TipCallout>
      default:
        if (!content) return null
        return (
          <CalloutBox variant={calloutType as any} title={title}>
            {content}
          </CalloutBox>
        )
    }
  }

  const renderForm = () => {
    switch (calloutType) {
      case "prompt":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="template">Prompt Template</Label>
              <Textarea
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="[Subject] with [Key Attributes], in [Style and Mood]..."
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="example">Example</Label>
              <Textarea
                id="example"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Cyberpunk Tokyo street at night with neon reflections..."
              />
            </div>
          </>
        )
      case "code":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="code-title">Title (optional)</Label>
              <Input
                id="code-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Code example"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-content">Code</Label>
              <Textarea
                id="code-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your code here..."
                className="font-mono text-sm"
              />
            </div>
          </>
        )
      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="callout-title">Title (optional)</Label>
              <Input
                id="callout-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Callout title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callout-content">Content</Label>
              <Textarea
                id="callout-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your callout content..."
              />
            </div>
          </>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Insert Callout
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insert Callout Box</DialogTitle>
        </DialogHeader>
        
        <Tabs value={calloutType} onValueChange={setCalloutType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {calloutTypes.map((type) => {
              const Icon = type.icon
              return (
                <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1 text-xs">
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{type.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          
          {calloutTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderForm()}
                    <Button onClick={handleInsert} className="w-full">
                      Insert Callout
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderPreview() || (
                      <div className="text-muted-foreground text-sm">
                        Fill in the fields to see a preview
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}