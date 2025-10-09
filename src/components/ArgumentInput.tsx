import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, FileText, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ArgumentInputProps {
  onAnalyze: (argument: string, context?: string, userReply?: string) => void;
  isAnalyzing: boolean;
}

export const ArgumentInput = ({ onAnalyze, isAnalyzing }: ArgumentInputProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [argument, setArgument] = useState("");
  const [context, setContext] = useState("");
  const [userReply, setUserReply] = useState("");
  const [showContext, setShowContext] = useState(false);

  const handleSubmit = () => {
    if (argument.trim()) {
      onAnalyze(argument.trim(), context.trim() || undefined, userReply.trim() || undefined);
      setArgument("");
      setUserReply("");
    }
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardContent className="p-3 space-y-2">
        {/* Context Section - Collapsible */}
        <Collapsible open={showContext} onOpenChange={setShowContext}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t.input.addContext}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                {t.input.contextLabel}
              </label>
              <Textarea
                placeholder={t.input.contextPlaceholder}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[50px] resize-none text-sm"
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                {t.input.userReplyLabel}
              </label>
              <Textarea
                placeholder={t.input.userReplyPlaceholder}
                value={userReply}
                onChange={(e) => setUserReply(e.target.value)}
                className="min-h-[50px] resize-none text-sm"
                disabled={isAnalyzing}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Main Argument Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.input.argumentLabel}</label>
          <Textarea
            placeholder={t.input.placeholder}
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !showContext) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="min-h-[60px] resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
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