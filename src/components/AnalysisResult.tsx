import { AnalysisData } from "@/pages/Index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FallacyCard } from "@/components/FallacyCard";
import { RebuttalStrategy } from "@/components/RebuttalStrategy";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText } from "lucide-react";

interface AnalysisResultProps {
  data: AnalysisData;
}

export const AnalysisResult = ({ data }: AnalysisResultProps) => {
  return (
    <div className="space-y-6">
      {/* Core Argument Extraction */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Core Argument Extraction
          </CardTitle>
          <CardDescription>Key points identified from the input content</CardDescription>
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
              Logical Fallacies Found ({data.fallacies.length})
            </CardTitle>
            <CardDescription>Logical issues identified in the argument</CardDescription>
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
              No Obvious Logical Fallacies Found
            </CardTitle>
            <CardDescription>The argument is relatively complete in its logical structure</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Rebuttal Strategy */}
      <RebuttalStrategy strategies={data.rebuttalStrategies} />

      {/* Overall Analysis */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Overall Analysis & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{data.overallAnalysis}</p>
        </CardContent>
      </Card>
    </div>
  );
};