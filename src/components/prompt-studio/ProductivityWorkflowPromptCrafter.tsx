import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { productivityWorkflowPromptOptions } from "@/data/promptStudioOptions";

interface ProductivityWorkflowPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    taskType?: string;
    framework?: string;
  };
  initialSubject?: string;
}

export const ProductivityWorkflowPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: ProductivityWorkflowPromptCrafterProps) => {
  const [taskType, setTaskType] = useState(initialSelections?.taskType || "");
  const [productivityFramework, setProductivityFramework] = useState(initialSelections?.framework || "");
  const [outputFormat, setOutputFormat] = useState("");
  const [taskDetails, setTaskDetails] = useState(initialSubject || "");
  const [toneOfOutput, setToneOfOutput] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.taskType || initialSelections?.framework || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!taskType) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Create a productivity and workflow optimization plan with the following specifications:");
    
    if (taskType) {
      const typeLabel = productivityWorkflowPromptOptions.taskTypes.find(t => t.value === taskType)?.label;
      if (typeLabel) promptParts.push(`\nTask Type: ${typeLabel}`);
    }
    
    if (productivityFramework) {
      const frameworkLabel = productivityWorkflowPromptOptions.productivityFrameworks.find(f => f.value === productivityFramework)?.label;
      if (frameworkLabel) promptParts.push(`Productivity Framework: ${frameworkLabel}`);
    }
    
    if (outputFormat) {
      const formatLabel = productivityWorkflowPromptOptions.outputFormats.find(o => o.value === outputFormat)?.label;
      if (formatLabel) promptParts.push(`Output Format: ${formatLabel}`);
    }
    
    if (taskDetails) {
      promptParts.push(`Task Details: ${taskDetails.trim()}`);
    }
    
    if (toneOfOutput) {
      const toneLabel = productivityWorkflowPromptOptions.toneOfOutput.find(t => t.value === toneOfOutput)?.label;
      if (toneLabel) promptParts.push(`Tone: ${toneLabel}`);
    }
    
    if (timeHorizon) {
      const horizonLabel = productivityWorkflowPromptOptions.timeHorizons.find(h => h.value === timeHorizon)?.label;
      if (horizonLabel) promptParts.push(`Time Horizon: ${horizonLabel}`);
    }
    
    if (additionalFeatures.length > 0) {
      promptParts.push(`Additional Features: ${additionalFeatures.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Clear actionable steps");
    promptParts.push("- Prioritization guidelines");
    promptParts.push("- Resource requirements");
    promptParts.push("- Timeline considerations");
    promptParts.push("- Success measurements");
    promptParts.push("- Optimization recommendations");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [taskType, productivityFramework, outputFormat, taskDetails, toneOfOutput, timeHorizon, additionalFeatures, onPromptGenerated]);

  const availableAdditionalFeatures = [
    "Time estimates",
    "Accountability tracking",
    "Daily/Weekly cadence",
    "Milestone highlights",
    "Progress bar simulation"
  ];

  const addAdditionalFeature = (feature: string) => {
    if (!additionalFeatures.includes(feature)) {
      setAdditionalFeatures([...additionalFeatures, feature]);
    }
  };

  const removeAdditionalFeature = (feature: string) => {
    setAdditionalFeatures(additionalFeatures.filter(f => f !== feature));
  };

  const clearAll = () => {
    setTaskType("");
    setProductivityFramework("");
    setOutputFormat("");
    setTaskDetails("");
    setToneOfOutput("");
    setTimeHorizon("");
    setAdditionalFeatures([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Task Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Task Type *</Label>
        <Select value={taskType} onValueChange={setTaskType}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose task type" />
          </SelectTrigger>
          <SelectContent>
            {productivityWorkflowPromptOptions.taskTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Productivity Framework */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Productivity Framework</Label>
        <Select value={productivityFramework} onValueChange={setProductivityFramework}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose framework" />
          </SelectTrigger>
          <SelectContent>
            {productivityWorkflowPromptOptions.productivityFrameworks.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Output Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Output Format</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose output format" />
          </SelectTrigger>
          <SelectContent>
            {productivityWorkflowPromptOptions.outputFormats.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Details */}
      <div className="space-y-2">
        <Label htmlFor="task-details" className="text-sm font-medium">
          Task Details *
        </Label>
        <div className="w-full">
          <Textarea
            id="task-details"
            placeholder="Enter task(s) or project(s) (e.g., 'Marketing campaign launch steps')"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>
      </div>

      {/* Tone of Output */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tone of Output</Label>
        <Select value={toneOfOutput} onValueChange={setToneOfOutput}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose tone" />
          </SelectTrigger>
          <SelectContent>
            {productivityWorkflowPromptOptions.toneOfOutput.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Horizon */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Time Horizon</Label>
        <Select value={timeHorizon} onValueChange={setTimeHorizon}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose time horizon" />
          </SelectTrigger>
          <SelectContent>
            {productivityWorkflowPromptOptions.timeHorizons.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Features */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Additional Features</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availableAdditionalFeatures
            .filter(feature => !additionalFeatures.includes(feature))
            .map((feature) => (
              <Button
                key={feature}
                variant="outline"
                size="sm"
                onClick={() => addAdditionalFeature(feature)}
                className="justify-start text-xs"
              >
                + {feature}
              </Button>
            ))}
        </div>
        
        {/* Selected Additional Features */}
        {additionalFeatures.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {additionalFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalFeature(feature)}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={clearAll}
          className="flex-1"
          disabled={!taskType && !productivityFramework && !outputFormat && !taskDetails && !toneOfOutput && !timeHorizon && additionalFeatures.length === 0}
        >
          Clear All
        </Button>
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Wand2 className="h-4 w-4" />
                Scout is crafting your prompt...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};