import { FallacyType } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface FallacyCardProps {
  fallacy: FallacyType;
}

const getSeverityIcon = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "medium":
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case "low":
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

const getSeverityColor = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
  }
};

const getSeverityLabel = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return "Severe";
    case "medium":
      return "Medium";
    case "low":
      return "Mild";
  }
};

export const FallacyCard = ({ fallacy }: FallacyCardProps) => {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{fallacy.name}</CardTitle>
          <div className="flex items-center gap-2">
            {getSeverityIcon(fallacy.severity)}
            <Badge variant={getSeverityColor(fallacy.severity) as any} className="text-xs">
              {getSeverityLabel(fallacy.severity)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm leading-relaxed">
          {fallacy.description}
        </CardDescription>
        
        <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-accent">
          <p className="text-sm font-medium mb-1">Typical Example:</p>
          <p className="text-sm text-muted-foreground italic">"{fallacy.example}"</p>
        </div>
      </CardContent>
    </Card>
  );
};