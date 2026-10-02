import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Lightbulb, User, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import type { AnalysisData } from "@/pages/Index";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  analysis?: AnalysisData;
  error?: boolean;
}

export const ChatMessage = ({ role, content, analysis, error }: ChatMessageProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <Card className="max-w-[92%] rounded-2xl border-primary/10 bg-primary/5 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <p className="whitespace-pre-wrap break-words text-sm leading-6">{content}</p>
              <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:flex">
        <BrainCircuit className="h-4 w-4" aria-hidden="true" />
      </div>
      <Card className={`w-full rounded-2xl shadow-none ${error ? "border-destructive/30 bg-destructive/5" : "border-border bg-background/50"}`}>
        <CardContent className="space-y-5 p-5">
          {error && <p role="alert" className="text-sm leading-6 text-destructive">{content}</p>}
          {analysis && (
            <>
              {/* Extracted Points */}
              {analysis.extractedPoints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    {t.analysis.extractedPoints}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm leading-6 text-muted-foreground">
                    {analysis.extractedPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fallacies */}
              {analysis.fallacies.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    {t.analysis.fallaciesDetected}
                  </h4>
                  <div className="space-y-2">
                    {analysis.fallacies.map((fallacy, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{fallacy.name}</span>
                          <Badge variant={fallacy.severity === "high" ? "destructive" : "secondary"}>
                            {t.severity[fallacy.severity]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{fallacy.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  {t.analysis.noFallacies}
                </div>
              )}

              {/* Rebuttal Strategies */}
              {analysis.rebuttalStrategies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t.analysis.rebuttalStrategies}</h4>
                  <div className="space-y-2">
                    {analysis.rebuttalStrategies.map((strategy) => (
                      <div key={strategy.id} className="p-3 rounded-lg bg-accent/10 space-y-1">
                        <div className="font-medium text-sm">{strategy.title}</div>
                        <p className="text-xs text-muted-foreground">{strategy.approach}</p>
                        <div className="p-2 mt-2 rounded bg-background/50 text-xs italic">
                          "{strategy.template}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Analysis */}
              {analysis.overallAnalysis && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">{analysis.overallAnalysis}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
