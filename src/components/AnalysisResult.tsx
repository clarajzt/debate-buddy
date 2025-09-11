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
      {/* 论点提取 */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            核心论点提取
          </CardTitle>
          <CardDescription>从输入内容中识别出的关键观点</CardDescription>
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

      {/* 逻辑谬误识别 */}
      {data.fallacies.length > 0 ? (
        <Card className="shadow-elegant border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              发现逻辑谬误 ({data.fallacies.length})
            </CardTitle>
            <CardDescription>在论证中识别出的逻辑问题</CardDescription>
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
              未发现明显逻辑谬误
            </CardTitle>
            <CardDescription>该论证在逻辑结构上相对完整</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* 反驳策略 */}
      <RebuttalStrategy strategies={data.rebuttalStrategies} />

      {/* 总体分析 */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>总体分析建议</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{data.overallAnalysis}</p>
        </CardContent>
      </Card>
    </div>
  );
};