import { useState } from "react";
import { RebuttalStrategy as Strategy } from "@/pages/Index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle, Target, MessageSquare, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface RebuttalStrategyProps {
  strategies: Strategy[];
}

export const RebuttalStrategy = ({ strategies }: RebuttalStrategyProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied to clipboard",
        description: "Rebuttal template copied and ready to use",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually select and copy the content",
        variant: "destructive",
      });
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return "text-success";
    if (effectiveness >= 70) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-success" />
          {t.rebuttal.title}
        </CardTitle>
        <CardDescription>
          {t.rebuttal.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {strategies.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                Strategy {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {strategies.map((strategy, index) => (
            <TabsContent key={strategy.id} value={index.toString()} className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    {strategy.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{strategy.approach}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Effectiveness</span>
                    <Badge 
                      variant="outline" 
                      className={`${getEffectivenessColor(strategy.effectiveness)} border-current`}
                    >
                      {strategy.effectiveness}%
                    </Badge>
                  </div>
                </div>
              </div>

              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Rebuttal Response Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border/50 font-mono text-sm leading-relaxed">
                    {strategy.template}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(strategy.template, strategy.id)}
                    className="w-full"
                  >
                    {copiedId === strategy.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Response Template
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};