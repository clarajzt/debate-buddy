import { useState } from "react";
import { ArrowRight, FileText, Loader2, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface ArgumentInputProps {
  onAnalyze: (argument: string, context?: string, userReply?: string) => Promise<boolean>;
  isAnalyzing: boolean;
}

export const ArgumentInput = ({ onAnalyze, isAnalyzing }: ArgumentInputProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [argument, setArgument] = useState("");
  const [context, setContext] = useState("");
  const [userReply, setUserReply] = useState("");
  const [showContext, setShowContext] = useState(false);

  const handleSubmit = async () => {
    if (!argument.trim() || isAnalyzing) return;
    const succeeded = await onAnalyze(argument.trim(), context.trim() || undefined, userReply.trim() || undefined);
    if (succeeded) {
      setArgument("");
      setUserReply("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="argument" className="text-sm font-semibold">{t.input.argumentLabel}</label>
        <button
          type="button"
          onClick={() => setArgument(t.workspace.sampleArgument)}
          disabled={isAnalyzing}
          className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent/50 disabled:opacity-50"
        >
          {t.workspace.sampleButton} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <Textarea
        id="argument"
        placeholder={t.input.placeholder}
        value={argument}
        onChange={(event) => setArgument(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            void handleSubmit();
          }
        }}
        maxLength={5000}
        className="min-h-[160px] resize-y rounded-xl border-input bg-background/70 p-4 text-base leading-6 focus-visible:ring-primary"
        disabled={isAnalyzing}
      />

      <Collapsible open={showContext} onOpenChange={setShowContext}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto px-0 text-primary hover:bg-transparent hover:text-primary/80">
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.input.addContext}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid gap-4 pt-3">
          <div className="space-y-2">
            <label htmlFor="context" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {t.input.contextLabel}
            </label>
            <Textarea
              id="context"
              placeholder={t.input.contextPlaceholder}
              value={context}
              onChange={(event) => setContext(event.target.value)}
              className="min-h-[72px] bg-background/70"
              disabled={isAnalyzing}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reply" className="flex items-center gap-2 text-sm font-medium">
              <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
              {t.input.userReplyLabel}
            </label>
            <Textarea
              id="reply"
              placeholder={t.input.userReplyPlaceholder}
              value={userReply}
              onChange={(event) => setUserReply(event.target.value)}
              className="min-h-[72px] bg-background/70"
              disabled={isAnalyzing}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">{argument.length}/5000 {t.input.charLimit}</span>
        <Button
          onClick={() => void handleSubmit()}
          disabled={!argument.trim() || isAnalyzing}
          className="h-11 rounded-xl bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isAnalyzing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />{t.input.analyzing}</>
          ) : (
            <>{t.input.analyzeButton}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></>
          )}
        </Button>
      </div>
    </div>
  );
};
