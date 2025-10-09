import { AnalysisData } from "@/pages/Index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FallacyCard } from "@/components/FallacyCard";
import { RebuttalStrategy } from "@/components/RebuttalStrategy";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface AnalysisResultProps {
  data: AnalysisData;
}

export const AnalysisResult = ({ data }: AnalysisResultProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div className="space-y-6">
      {/* Core Argument Extraction */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            {t.results.coreArgument}
          </CardTitle>
          <CardDescription>{t.results.mainClaim}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.extractedPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Badge variant="secondary" className="mt-0.5 shrink-0">
                  {index + 1}
                </Badge>
                <p className="text-sm">{point}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logical Fallacy Detection */}
      {data.fallacies.length > 0 ? (
        <Card className="shadow-elegant border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {t.results.fallaciesFound} ({data.fallacies.length})
            </CardTitle>
            <CardDescription>{t.results.fallacyCount.replace('{{count}}', data.fallacies.length.toString())}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {data.fallacies.map((fallacy, index) => (
                <FallacyCard key={index} fallacy={fallacy} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-elegant border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              {t.results.noFallacies}
            </CardTitle>
            <CardDescription>{t.results.noFallaciesDesc}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Rebuttal Strategy */}
      <RebuttalStrategy strategies={data.rebuttalStrategies} />

      {/* Overall Analysis */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>{t.results.overallAnalysis}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{data.overallAnalysis}</p>
        </CardContent>
      </Card>
    </div>
  );
};