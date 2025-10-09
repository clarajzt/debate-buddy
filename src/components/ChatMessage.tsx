import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Lightbulb, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import type { AnalysisData } from "@/pages/Index";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  analysis?: AnalysisData;
}

export const ChatMessage = ({ role, content, analysis }: ChatMessageProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (role === "user") {
    return (
      <div className="flex gap-3 justify-end">
        <Card className="max-w-[80%] bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <p className="text-sm">{content}</p>
              <User className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Card className="w-full bg-card">
        <CardContent className="p-4 space-y-4">
          {analysis && (
            <>
              {/* Extracted Points */}
              {analysis.extractedPoints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    {t.analysis.extractedPoints}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
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
