import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface ArgumentInputProps {
  onAnalyze: (argument: string) => void;
  isAnalyzing: boolean;
}

export const ArgumentInput = ({ onAnalyze, isAnalyzing }: ArgumentInputProps) => {
  const [argument, setArgument] = useState("");

  const handleSubmit = () => {
    if (argument.trim()) {
      onAnalyze(argument.trim());
    }
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Enter Opponent's Argument
        </CardTitle>
        <CardDescription>
          Enter the argument content or opponent's core points you want to analyze. We'll help identify logical issues and provide rebuttal strategies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Example: 'Climate change is a natural phenomenon, not caused by humans. Earth's climate has always been changing throughout history, and scientists disagree on this, so we don't need to worry about it.'"
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isAnalyzing}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {argument.length}/1000 characters
          </span>
          
          <Button 
            onClick={handleSubmit}
            disabled={!argument.trim() || isAnalyzing}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};