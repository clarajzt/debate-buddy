import { useState } from "react";
import { ArgumentInput } from "@/components/ArgumentInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Brain, Zap, Target } from "lucide-react";

export interface FallacyType {
  type: string;
  name: string;
  description: string;
  example: string;
  severity: "high" | "medium" | "low";
}

export interface RebuttalStrategy {
  id: string;
  title: string;
  approach: string;
  template: string;
  effectiveness: number;
}

export interface AnalysisData {
  extractedPoints: string[];
  fallacies: FallacyType[];
  rebuttalStrategies: RebuttalStrategy[];
  overallAnalysis: string;
}

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (argument: string) => {
    setIsAnalyzing(true);
    
    // 模拟API调用 - 实际应用中需要连接LLM API
    setTimeout(() => {
      const mockData: AnalysisData = {
        extractedPoints: [
          "气候变化是自然现象，不是人为造成的",
          "历史上地球气候一直在变化",
          "科学家们对此意见不一致"
        ],
        fallacies: [
          {
            type: "appeal_to_nature",
            name: "诉诸自然",
            description: "仅仅因为某事是'自然的'就认为它是正确或好的",
            example: "认为所有自然现象都不需要人为干预",
            severity: "medium"
          },
          {
            type: "false_equivalence", 
            name: "虚假平衡",
            description: "将科学共识与少数异议等同视之",
            example: "忽视97%科学家的共识，强调少数异议声音",
            severity: "high"
          }
        ],
        rebuttalStrategies: [
          {
            id: "1",
            title: "科学证据反驳",
            approach: "用具体数据和科学研究结果反驳",
            template: "根据NASA和IPCC的最新报告，{具体数据}表明人为活动确实是主要因素...",
            effectiveness: 90
          },
          {
            id: "2", 
            title: "逻辑结构分析",
            approach: "指出论证中的逻辑谬误",
            template: "你的论证存在{谬误类型}的问题，因为{具体分析}...",
            effectiveness: 85
          }
        ],
        overallAnalysis: "该论证主要依赖于对科学共识的误解和自然主义谬误。建议从科学证据和逻辑结构两个角度进行反驳。"
      };
      
      setAnalysisData(mockData);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Debate Buddy
              </h1>
              <p className="text-muted-foreground">AI智能辩论助手 - 识别谬误，制胜策略</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Banner */}
      <section className="py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
              <Zap className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">逻辑谬误识别</h3>
                <p className="text-sm text-muted-foreground">自动识别5种常见逻辑谬误</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
              <Target className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">反驳策略生成</h3>
                <p className="text-sm text-muted-foreground">提供针对性反驳方案</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
              <Brain className="h-8 w-8 text-accent" />
              <div>
                <h3 className="font-semibold">话术模板</h3>
                <p className="text-sm text-muted-foreground">生成具体可用的回复模板</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ArgumentInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          
          {analysisData && (
            <AnalysisResult data={analysisData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;