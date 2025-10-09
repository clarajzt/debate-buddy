import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const qwenApiKey = Deno.env.get('QWEN_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FallacyType {
  type: string;
  name: string;
  description: string;
  example: string;
  severity: "high" | "medium" | "low";
}

interface RebuttalStrategy {
  id: string;
  title: string;
  approach: string;
  template: string;
  effectiveness: number;
}

interface AnalysisData {
  extractedPoints: string[];
  fallacies: FallacyType[];
  rebuttalStrategies: RebuttalStrategy[];
  overallAnalysis: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { argument, conversationHistory = [], context, userReply } = await req.json();

    if (!argument) {
      return new Response(
        JSON.stringify({ error: 'Argument text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let prompt = '';
    
    // Add context and user reply information if provided
    let contextInfo = '';
    if (context) {
      contextInfo += `\n\nDEBATE CONTEXT: ${context}`;
    }
    if (userReply) {
      contextInfo += `\n\nUSER'S ACTUAL REPLY: ${userReply}`;
    }
    
    if (conversationHistory.length > 1) {
      // Ongoing conversation - provide contextual analysis
      prompt = `You are analyzing an ongoing debate conversation. Here is the conversation history:

${conversationHistory.slice(0, -1).map((msg: any, idx: number) => 
  `${idx + 1}. ${msg.role === 'user' ? 'User' : 'Analysis'}: ${msg.content}`
).join('\n')}
${contextInfo}

Latest argument to analyze: "${argument}"

Analyze this latest argument in the context of the ongoing conversation${context ? ' and provided debate context' : ''}${userReply ? '. Also evaluate the effectiveness of the user\'s reply' : ''}. Provide analysis in the following JSON format:`;
    } else {
      // First message - standard analysis
      prompt = `Analyze the following argument for logical fallacies and provide rebuttal strategies.${contextInfo}

Argument: "${argument}"

Please provide a comprehensive analysis in the following JSON format:`;
    }
    
    prompt += `
{
  "extractedPoints": ["point1", "point2", "point3"],
  "fallacies": [
    {
      "type": "fallacy_type_key",
      "name": "Fallacy Name",
      "description": "Description of the fallacy",
      "example": "How this fallacy appears in the argument",
      "severity": "high|medium|low"
    }
  ],
  "rebuttalStrategies": [
    {
      "id": "1",
      "title": "Strategy Title",
      "approach": "Brief description of approach",
      "template": "Specific rebuttal template that can be used",
      "effectiveness": 85
    }
  ],
  "overallAnalysis": "Overall analysis and recommendations"
}

Focus on identifying these common fallacies:
1. Straw Man - Misrepresenting opponent's position
2. Slippery Slope - Assuming one thing leads to extreme consequences
3. Ad Hominem - Attacking the person instead of the argument
4. False Dichotomy - Presenting only two options when more exist
5. Appeal to Authority - Using irrelevant authority as evidence

Provide 2-3 rebuttal strategies with specific, usable templates. Make the analysis thorough but practical.`;

    // Build message history for the AI
    const messages = [
      {
        role: 'system',
        content: 'You are an expert in logical reasoning and debate analysis. Provide detailed, accurate analysis of arguments and practical rebuttal strategies in the context of ongoing conversations. Always respond with valid JSON.'
      }
    ];

    // Add conversation context if it exists
    if (conversationHistory.length > 1) {
      conversationHistory.slice(0, -1).forEach((msg: any) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qwenApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: messages
        },
        parameters: {
          result_format: 'message'
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qwen API error:', errorText);
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Qwen API response:', data);

    let analysisResult: AnalysisData;
    
    try {
      const content = data.output?.choices?.[0]?.message?.content || data.output?.text;
      if (!content) {
        throw new Error('No content in response');
      }
      
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Qwen response:', parseError);
      
      // Fallback to a structured response if parsing fails
      analysisResult = {
        extractedPoints: [
          "Unable to parse argument automatically",
          "Please try rephrasing your argument",
          "Manual analysis may be required"
        ],
        fallacies: [],
        rebuttalStrategies: [
          {
            id: "1",
            title: "Request Clarification",
            approach: "Ask for more specific information",
            template: "Could you please clarify what you mean by [specific point]? I want to make sure I understand your argument correctly.",
            effectiveness: 70
          }
        ],
        overallAnalysis: "The argument structure was not clear enough for automated analysis. Consider breaking it down into more specific points."
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-argument function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});