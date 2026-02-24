import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, Code, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react"

const calloutVariants = cva(
  "rounded-lg p-4 my-6 border",
  {
    variants: {
      variant: {
        default: "bg-muted border-muted-foreground/20",
        info: "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/20",
        success: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
        warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
        danger: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
        code: "bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-700",
        prompt: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertTriangle,
  code: Code,
  prompt: Code,
  default: Lightbulb
}

const colorMap = {
  info: "text-primary dark:text-primary",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
  code: "text-slate-600 dark:text-slate-400",
  prompt: "text-primary",
  default: "text-muted-foreground"
}

export interface CalloutBoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof calloutVariants> {
  title?: string
  icon?: React.ReactNode
  showIcon?: boolean
}

const CalloutBox = React.forwardRef<HTMLDivElement, CalloutBoxProps>(
  ({ className, variant = "default", title, icon, showIcon = true, children, ...props }, ref) => {
    const IconComponent = iconMap[variant || "default"]
    const iconColor = colorMap[variant || "default"]
    
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ variant }), className)}
        {...props}
      >
        {(title || showIcon) && (
          <div className="flex items-center gap-2 mb-2">
            {showIcon && (
              <div className={cn("flex-shrink-0", iconColor)}>
                {icon || <IconComponent className="w-4 h-4" />}
              </div>
            )}
            {title && (
              <div className={cn("font-semibold text-sm", iconColor)}>
                {title}
              </div>
            )}
          </div>
        )}
        <div className="space-y-2">
          {children}
        </div>
      </div>
    )
  }
)

CalloutBox.displayName = "CalloutBox"

// Specialized components for common use cases
export const PromptExample = ({ template, example, ...props }: { 
  template: string
  example: string
} & Omit<CalloutBoxProps, 'children'>) => {
  return (
    <CalloutBox variant="prompt" title="Prompt Template" {...props}>
      <p className="font-mono text-sm mb-2 leading-relaxed">
        {template}
      </p>
      <p className="text-sm text-muted-foreground">
        <strong>Example:</strong> "{example}"
      </p>
    </CalloutBox>
  )
}

export const CodeBlock = ({ children, title, ...props }: CalloutBoxProps) => {
  return (
    <CalloutBox variant="code" title={title} {...props}>
      <div className="font-mono text-sm">
        {children}
      </div>
    </CalloutBox>
  )
}

export const TipCallout = ({ children, ...props }: CalloutBoxProps) => {
  return (
    <CalloutBox variant="info" title="💡 Pro Tip" {...props}>
      {children}
    </CalloutBox>
  )
}

export { CalloutBox, calloutVariants }