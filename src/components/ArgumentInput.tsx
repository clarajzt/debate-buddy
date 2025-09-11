import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface ArgumentInputProps {
  onAnalyze: (argument: string) => void;
  isAnalyzing: boolean;
}

export const ArgumentInput = ({ onAnalyze, isAnalyzing }: ArgumentInputProps) => {
  const [argument, setArgument] = useState("");

  const handleSubmit = () => {
    if (argument.trim()) {
      onAnalyze(argument.trim());
    }
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          输入对方论点
        </CardTitle>
        <CardDescription>
          请输入您想要分析的争论内容或对方的核心论点，我们将帮您识别其中的逻辑问题并提供反驳策略。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="例如：'气候变化是自然现象，不是人为造成的。历史上地球气候一直在变化，而且科学家们对此意见也不一致，所以我们不需要为此担心。'"
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isAnalyzing}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {argument.length}/1000 字符
          </span>
          
          <Button 
            onClick={handleSubmit}
            disabled={!argument.trim() || isAnalyzing}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                开始分析
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};