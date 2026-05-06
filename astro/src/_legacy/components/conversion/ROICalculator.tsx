import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const ROICalculator = () => {
  const [hourlyRate, setHourlyRate] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState([10]);
  const [currentEfficiency, setCurrentEfficiency] = useState([60]);

  // Calculate potential savings
  const weeklyValue = (hoursPerWeek[0] * hourlyRate);
  const timeSavedPerWeek = hoursPerWeek[0] * 0.6; // Average 60% time savings
  const weeklySavings = timeSavedPerWeek * hourlyRate;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = monthlySavings * 12;
  
  const subscriptionCost = 12.99;
  const monthlyROI = ((monthlySavings - subscriptionCost) / subscriptionCost) * 100;
  const paybackDays = Math.ceil((subscriptionCost / (weeklySavings / 7)));

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Calculate Your Potential Savings</CardTitle>
        <p className="text-muted-foreground">
          See how much time and money you could save with our AI prompts
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="hourly-rate" className="text-sm font-medium">
                Your hourly value ($)
              </Label>
              <Input
                id="hourly-rate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                className="mt-2"
                min="1"
                max="500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Average professional rate: $25-75/hour
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">
                Hours spent on content/writing per week: {hoursPerWeek[0]}
              </Label>
              <Slider
                value={hoursPerWeek}
                onValueChange={setHoursPerWeek}
                max={40}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 hour</span>
                <span>40 hours</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">
                Current efficiency: {currentEfficiency[0]}%
              </Label>
              <Slider
                value={currentEfficiency}
                onValueChange={setCurrentEfficiency}
                max={100}
                min={20}
                step={5}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>20%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-4">
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Time Savings</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {timeSavedPerWeek.toFixed(1)}h
                  </div>
                  <div className="text-muted-foreground">per week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {(timeSavedPerWeek * 4.33).toFixed(0)}h
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Money Savings</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${weeklySavings.toFixed(0)}
                  </div>
                  <div className="text-muted-foreground">per week</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${monthlySavings.toFixed(0)}
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800 dark:text-green-200">ROI Analysis</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Monthly ROI:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">
                    {monthlyROI.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Payback time:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">
                    {paybackDays} day{paybackDays !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-300">Annual savings:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">
                    ${yearlySavings.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center space-y-4 pt-6 border-t">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Ready to save {timeSavedPerWeek.toFixed(1)} hours per week?
            </h4>
            <p className="text-muted-foreground">
              Start with our free plan - no credit card required
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/auth?mode=signup">
                Start Saving Time Today
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/library">Browse Free Prompts</Link>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Based on average user results. Individual results may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;