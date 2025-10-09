import { useState, useRef, useEffect } from "react";
import { ArgumentInput } from "@/components/ArgumentInput";
import { ChatMessage } from "@/components/ChatMessage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface Message {
  role: "user" | "assistant";
  content: string;
  analysis?: AnalysisData;
}

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAnalyze = async (argument: string, context?: string, userReply?: string) => {
    setIsAnalyzing(true);
    
    // Add user message with context if provided
    let displayContent = argument;
    if (context || userReply) {
      displayContent = argument;
      if (context) displayContent = `[Context: ${context}]\n\n${displayContent}`;
      if (userReply) displayContent = `${displayContent}\n\n[My Reply: ${userReply}]`;
    }
    
    const userMessage: Message = {
      role: "user",
      content: displayContent
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Send conversation history
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const { data, error } = await supabase.functions.invoke('analyze-argument', {
        body: { 
          argument,
          conversationHistory,
          context,
          userReply
        }
      });

      if (error) {
        console.error('Error calling analyze function:', error);
        throw error;
      }

      // Add assistant message with analysis
      const assistantMessage: Message = {
        role: "assistant",
        content: data.overallAnalysis || "Analysis complete",
        analysis: data
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback response
      const fallbackData: AnalysisData = {
        extractedPoints: [
          "Unable to analyze at the moment",
          "Please try again"
        ],
        fallacies: [],
        rebuttalStrategies: [
          {
            id: "1",
            title: "Request Clarification",
            approach: "Ask for more specific information",
            template: "Could you please clarify your point? I want to make sure I understand correctly.",
            effectiveness: 70
          }
        ],
        overallAnalysis: "Analysis temporarily unavailable. Please try again."
      };
      
      const assistantMessage: Message = {
        role: "assistant",
        content: fallbackData.overallAnalysis,
        analysis: fallbackData
      };
      setMessages(prev => [...prev, assistantMessage]);
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
      <main className="container mx-auto px-4 py-4 flex flex-col h-[calc(100vh-180px)]">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full gap-4">
          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p>{t.hero.subtitle}</p>
                  <p className="text-sm mt-2">{language === 'zh' ? '开始对话以分析论点' : 'Start a conversation to analyze arguments'}</p>
                </div>
              ) : (
                messages.map((message, idx) => (
                  <ChatMessage
                    key={idx}
                    role={message.role}
                    content={message.content}
                    analysis={message.analysis}
                  />
                ))
              )}
              {isAnalyzing && (
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-pulse">Analyzing...</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="flex-shrink-0">
            <ArgumentInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;