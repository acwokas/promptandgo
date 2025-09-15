import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2, X } from "lucide-react";
import { researchPromptOptions } from "@/data/promptStudioOptions";

interface ResearchPromptCrafterProps {
  onPromptGenerated: (prompt: string) => void;
  initialSelections?: {
    researchGoal?: string;
    dataScope?: string;
  };
  initialSubject?: string;
}

export const ResearchPromptCrafter = ({ onPromptGenerated, initialSelections, initialSubject }: ResearchPromptCrafterProps) => {
  const [researchTopic, setResearchTopic] = useState(initialSubject || "");
  const [researchGoal, setResearchGoal] = useState(initialSelections?.researchGoal || "");
  const [dataScope, setDataScope] = useState(initialSelections?.dataScope || "");
  const [outputFormat, setOutputFormat] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [depthLevel, setDepthLevel] = useState("");
  const [sourcesToInclude, setSourcesToInclude] = useState<string[]>([]);

  // Auto-generate prompt when initial selections are provided
  useEffect(() => {
    if (initialSelections?.researchGoal || initialSelections?.dataScope || initialSubject) {
      setTimeout(() => {
        const prompt = buildPrompt();
        if (prompt) onPromptGenerated(prompt);
      }, 100);
    }
  }, []);

  const buildPrompt = () => {
    if (!researchTopic.trim()) return "";

    const promptParts: string[] = [];
    
    promptParts.push("Conduct comprehensive research and analysis with the following specifications:");
    promptParts.push(`\nResearch Topic: ${researchTopic.trim()}`);
    
    if (researchGoal) {
      const goalLabel = researchPromptOptions.researchGoals.find(g => g.value === researchGoal)?.label;
      if (goalLabel) promptParts.push(`Research Goal: ${goalLabel}`);
    }
    
    if (dataScope) {
      const scopeLabel = researchPromptOptions.dataScopes.find(s => s.value === dataScope)?.label;
      if (scopeLabel) promptParts.push(`Data Scope: ${scopeLabel}`);
    }
    
    if (outputFormat) {
      const formatLabel = researchPromptOptions.outputFormats.find(f => f.value === outputFormat)?.label;
      if (formatLabel) promptParts.push(`Output Format: ${formatLabel}`);
    }
    
    if (timeHorizon) {
      const horizonLabel = researchPromptOptions.timeHorizons.find(t => t.value === timeHorizon)?.label;
      if (horizonLabel) promptParts.push(`Time Horizon: ${horizonLabel}`);
    }
    
    if (depthLevel) {
      const depthLabel = researchPromptOptions.depthLevels.find(d => d.value === depthLevel)?.label;
      if (depthLabel) promptParts.push(`Depth of Analysis: ${depthLabel}`);
    }
    
    if (sourcesToInclude.length > 0) {
      promptParts.push(`Sources to Include: ${sourcesToInclude.join(", ")}`);
    }
    
    promptParts.push("\nPlease include:");
    promptParts.push("- Executive summary of key findings");
    promptParts.push("- Methodology and data sources");
    promptParts.push("- Detailed analysis and insights");
    promptParts.push("- Supporting data and statistics");
    promptParts.push("- Trends and patterns identification");
    promptParts.push("- Conclusions and recommendations");
    promptParts.push("- Future implications and predictions");
    promptParts.push("- Source citations and references");
    
    return promptParts.join("\n");
  };

  useEffect(() => {
    const prompt = buildPrompt();
    onPromptGenerated(prompt);
  }, [researchTopic, researchGoal, dataScope, outputFormat, timeHorizon, depthLevel, sourcesToInclude, onPromptGenerated]);

  const availableSources = [
    "Academic papers",
    "Market reports", 
    "News media",
    "Industry blogs",
    "Surveys"
  ];

  const addSource = (source: string) => {
    if (!sourcesToInclude.includes(source)) {
      setSourcesToInclude([...sourcesToInclude, source]);
    }
  };

  const removeSource = (source: string) => {
    setSourcesToInclude(sourcesToInclude.filter(s => s !== source));
  };

  const clearAll = () => {
    setResearchTopic("");
    setResearchGoal("");
    setDataScope("");
    setOutputFormat("");
    setTimeHorizon("");
    setDepthLevel("");
    setSourcesToInclude([]);
  };

  return (
    <div className="space-y-6 w-full mobile-safe">
      {/* Research Topic - Free text */}
      <div className="space-y-2">
        <Label htmlFor="research-topic" className="text-sm font-medium">
          Research Topic *
        </Label>
        <Input
          id="research-topic"
          placeholder="What are you analysing? (e.g., 'EV adoption trends in Southeast Asia')"
          value={researchTopic}
          onChange={(e) => setResearchTopic(e.target.value)}
          className="w-full bg-background"
        />
      </div>

      {/* Research Goal */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Research Goal</Label>
        <Select value={researchGoal} onValueChange={setResearchGoal}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose research goal" />
          </SelectTrigger>
          <SelectContent>
            {researchPromptOptions.researchGoals.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Scope */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Data Scope</Label>
        <Select value={dataScope} onValueChange={setDataScope}>
          <SelectTrigger className="mobile-select">
            <SelectValue placeholder="Choose data scope" />
          </SelectTrigger>
          <SelectContent>
            {researchPromptOptions.dataScopes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sources to Include */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sources to Include</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {availableSources
            .filter(source => !sourcesToInclude.includes(source))
            .map((source) => (
              <Button
                key={source}
                variant="outline"
                size="sm"
                onClick={() => addSource(source)}
                className="justify-start text-xs"
              >
                + {source}
              </Button>
            ))}
        </div>
        
        {/* Selected Sources */}
        {sourcesToInclude.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {sourcesToInclude.map((source) => (
                <Badge key={source} variant="secondary" className="text-xs">
                  {source}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSource(source)}
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

      {/* Output Format */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Output Format</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose output format" />
          </SelectTrigger>
          <SelectContent>
            {researchPromptOptions.outputFormats.map((option) => (
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
            {researchPromptOptions.timeHorizons.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Depth of Analysis */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Depth of Analysis</Label>
        <Select value={depthLevel} onValueChange={setDepthLevel}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choose analysis depth" />
          </SelectTrigger>
          <SelectContent>
            {researchPromptOptions.depthLevels.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={clearAll}
          className="flex-1"
          disabled={!researchTopic && !researchGoal && !dataScope && !outputFormat && !timeHorizon && !depthLevel && sourcesToInclude.length === 0}
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