import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BrainCircuit, Check, MessageSquareText, SearchCheck, Sparkles } from "lucide-react";
import { z } from "zod";
import { ArgumentInput } from "@/components/ArgumentInput";
import { ChatMessage } from "@/components/ChatMessage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

const fallacySchema = z.object({
  type: z.string(),
  name: z.string(),
  description: z.string(),
  example: z.string(),
  severity: z.enum(["high", "medium", "low"]),
});

const rebuttalStrategySchema = z.object({
  id: z.string(),
  title: z.string(),
  approach: z.string(),
  template: z.string(),
  effectiveness: z.number(),
});

const analysisSchema = z.object({
  extractedPoints: z.array(z.string()),
  fallacies: z.array(fallacySchema),
  rebuttalStrategies: z.array(rebuttalStrategySchema),
  overallAnalysis: z.string(),
});

export type FallacyType = z.infer<typeof fallacySchema>;
export type RebuttalStrategy = z.infer<typeof rebuttalStrategySchema>;
export type AnalysisData = z.infer<typeof analysisSchema>;

interface Message {
  role: "user" | "assistant";
  content: string;
  analysis?: AnalysisData;
  error?: boolean;
}

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resultEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) resultEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleAnalyze = async (argument: string, context?: string, userReply?: string): Promise<boolean> => {
    setIsAnalyzing(true);

    let displayContent = argument;
    if (context) displayContent = `[${t.input.contextLabel}: ${context}]\n\n${displayContent}`;
    if (userReply) displayContent += `\n\n[${t.input.userReplyLabel}: ${userReply}]`;

    const userMessage: Message = { role: "user", content: displayContent };
    setMessages((previous) => [...previous, userMessage]);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const conversationHistory = [...messages, userMessage]
        .filter((message) => !message.error)
        .map(({ role, content }) => ({ role, content }));
      const { data, error } = await supabase.functions.invoke("analyze-argument", {
        body: { argument, conversationHistory, context, userReply },
      });

      if (error) throw error;
      const parsed = analysisSchema.safeParse(data);
      if (!parsed.success) throw new Error("Invalid analysis response");

      setMessages((previous) => [...previous, {
        role: "assistant",
        content: parsed.data.overallAnalysis,
        analysis: parsed.data,
      }]);
      return true;
    } catch (error) {
      console.error("Analysis failed:", error);
      setMessages((previous) => [...previous, {
        role: "assistant",
        content: t.workspace.error,
        error: true,
      }]);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-base font-semibold tracking-tight">Debate Buddy</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t.workspace.brandTag}
              </div>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-11 md:px-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 lg:pt-20">
        <section className="lg:sticky lg:top-12 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t.workspace.eyebrow}
          </div>
          <h1 className="mt-7 max-w-xl font-display text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl">
            {t.workspace.headline}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
            {t.workspace.description}
          </p>

          <div className="mt-10 grid gap-4 border-t border-border pt-6 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: SearchCheck, title: t.workspace.stepOne, body: t.workspace.stepOneDetail },
              { icon: MessageSquareText, title: t.workspace.stepTwo, body: t.workspace.stepTwoDetail },
              { icon: Check, title: t.workspace.stepThree, body: t.workspace.stepThreeDetail },
            ].map(({ icon: Icon, title, body }, index) => (
              <div className="flex gap-3" key={title}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm ring-1 ring-border">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold"><span className="mr-2 text-muted-foreground/70">0{index + 1}</span>{title}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-sm text-xs leading-5 text-muted-foreground">
            {t.workspace.caveat}
          </p>
        </section>

        <section aria-label={t.workspace.workspaceLabel} className="min-w-0">
          <div className="overflow-hidden rounded-[1.4rem] border border-border bg-card shadow-[0_24px_70px_-35px_hsl(var(--primary)/0.26)]">
            <div className="flex items-center justify-between border-b border-border bg-secondary/65 px-6 py-4 sm:px-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{t.workspace.workspaceLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.workspace.workspaceHint}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-primary/55" aria-hidden="true" />
            </div>
            <div className="p-5 sm:p-8">
              <ArgumentInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

              {messages.length === 0 ? (
                <div className="mt-7 rounded-2xl border border-dashed border-border bg-background/70 p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t.workspace.outputLabel}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.workspace.emptyState}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[t.analysis.extractedPoints, t.analysis.fallaciesDetected, t.analysis.rebuttalStrategies].map((label) => (
                      <span key={label} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">{label}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div aria-live="polite" className="mt-8 space-y-5 border-t border-border pt-7">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">{t.workspace.conversationLabel}</h2>
                    <span className="text-xs text-muted-foreground">{messages.length} {t.workspace.entries}</span>
                  </div>
                  {messages.map((message, index) => <ChatMessage key={index} {...message} />)}
                  {isAnalyzing && <p className="text-sm text-muted-foreground" role="status">{t.input.analyzing}</p>}
                  <div ref={resultEndRef} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
