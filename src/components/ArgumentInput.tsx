import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface ArgumentInputProps {
  onAnalyze: (argument: string) => void;
  isAnalyzing: boolean;
}

export const ArgumentInput = ({ onAnalyze, isAnalyzing }: ArgumentInputProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [argument, setArgument] = useState("");

  const handleSubmit = () => {
    if (argument.trim()) {
      onAnalyze(argument.trim());
      setArgument("");
    }
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardContent className="p-4 space-y-3">
        <Textarea
          placeholder={t.input.placeholder}
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="min-h-[80px] resize-none"
          disabled={isAnalyzing}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {argument.length}/5000 {t.input.charLimit}
          </span>
          
          <Button 
            onClick={handleSubmit}
            disabled={!argument.trim() || isAnalyzing}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.input.analyzing}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t.input.analyzeButton}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};