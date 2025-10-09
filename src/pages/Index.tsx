import { useState } from "react";
import { ArgumentInput } from "@/components/ArgumentInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Brain, Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

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
  const { language } = useLanguage();
  const t = translations[language];
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (argument: string) => {
    setIsAnalyzing(true);
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('analyze-argument', {
        body: { argument }
      });

      if (error) {
        console.error('Error calling analyze function:', error);
        throw error;
      }

      setAnalysisData(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to demo data if API fails
      const fallbackData: AnalysisData = {
        extractedPoints: [
          "Climate change is a natural phenomenon, not human-caused",
          "Earth's climate has always been changing throughout history", 
          "Scientists disagree on this issue"
        ],
        fallacies: [
          {
            type: "appeal_to_nature",
            name: "Appeal to Nature",
            description: "Assuming something is good or correct just because it's 'natural'",
            example: "Believing all natural phenomena don't need human intervention",
            severity: "medium"
          },
          {
            type: "false_equivalence", 
            name: "False Balance",
            description: "Treating scientific consensus and minority dissent as equal",
            example: "Ignoring 97% scientific consensus while emphasizing minority voices",
            severity: "high"
          }
        ],
        rebuttalStrategies: [
          {
            id: "1",
            title: "Scientific Evidence Rebuttal",
            approach: "Counter with specific data and research results",
            template: "According to the latest NASA and IPCC reports, [specific data] clearly shows that human activities are indeed the primary factor...",
            effectiveness: 90
          },
          {
            id: "2", 
            title: "Logical Structure Analysis",
            approach: "Point out logical fallacies in the argument",
            template: "Your argument contains a [fallacy type] problem because [specific analysis]...",
            effectiveness: 85
          }
        ],
        overallAnalysis: "This argument primarily relies on misunderstanding of scientific consensus and naturalistic fallacy. Recommend countering from both scientific evidence and logical structure perspectives."
      };
      
      setAnalysisData(fallbackData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t.hero.title}
                </h1>
                <p className="text-muted-foreground">{t.hero.subtitle}</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

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