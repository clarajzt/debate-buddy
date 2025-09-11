import { useState } from "react";
import { RebuttalStrategy as Strategy } from "@/pages/Index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle, Target, MessageSquare, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RebuttalStrategyProps {
  strategies: Strategy[];
}

export const RebuttalStrategy = ({ strategies }: RebuttalStrategyProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "已复制到剪贴板",
        description: "反驳话术已复制，可以直接使用",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动选择并复制内容",
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
          反驳策略方案
        </CardTitle>
        <CardDescription>
          基于分析结果为您推荐的反驳策略和话术模板
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {strategies.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                策略 {index + 1}
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
                    <span className="text-xs text-muted-foreground">有效性</span>
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
                    反驳话术模板
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
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        复制话术模板
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