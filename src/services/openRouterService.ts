import { GeminiPlanPayload } from '../types';
import { StreamProgressCallback } from './geminiService';

export const OPENROUTER_FREE_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'deepseek/deepseek-r1:free',
  'openrouter/free'
];

function extractJsonPayload(rawText: string): GeminiPlanPayload {
  let cleaned = rawText.trim();

  // Remove markdown backticks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // Find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(cleaned);

  // Normalize fields to ensure compliance with GeminiPlanPayload
  return {
    apiAction: parsed.apiAction || 'POST_CREATE',
    targetResourceId: parsed.targetResourceId || '',
    searchQuery: parsed.searchQuery || '',
    changeSummary: parsed.changeSummary || '',
    title: parsed.title || 'Untitled Publication',
    metaDescription: parsed.metaDescription || '',
    labels: Array.isArray(parsed.labels) ? parsed.labels : ['Technology'],
    htmlContent: parsed.htmlContent || '<p>Content generated via OpenRouter fallback.</p>',
    mermaidDiagramCode: parsed.mermaidDiagramCode || '',
    mathFormulas: parsed.mathFormulas || '',
    affiliateComparisonHtml: parsed.affiliateComparisonHtml || '',
    mediaQuery: parsed.mediaQuery || '',
    jsonLdSchema: parsed.jsonLdSchema || ''
  };
}

export const OpenRouterService = {
  async synthesizeWithOpenRouter(
    apiKey: string,
    prompt: string,
    contextInfo = '',
    onStreamChunk?: StreamProgressCallback,
    onModelChange?: (modelName: string) => void
  ): Promise<{ plan: GeminiPlanPayload; modelUsed: string }> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      throw new Error('OpenRouter API key is required for fallback synthesis.');
    }

    const systemPrompt = `You are Viblogger for Blogger, an autonomous publishing workstation with direct control over Blogger API v3, Mermaid.js diagrams, KaTeX LaTeX math, and Search Console telemetry.
Synthesize deep, professional publications with semantic H2/H3 headings, tables, code blocks, Mermaid diagrams, and valid JSON-LD schemas.
CRITICAL: You MUST respond ONLY with a raw, valid JSON object matching this exact TypeScript interface:
{
  "apiAction": "POST_CREATE" | "POST_UPDATE" | "POST_DELETE" | "POST_PUBLISH" | "POST_REVERT" | "POST_LIST" | "POST_SEARCH" | "PAGE_CREATE" | "PAGE_UPDATE" | "PAGE_DELETE" | "PAGE_LIST" | "COMMENTS_LIST" | "BLOG_STATS" | "GSC_QUERY" | "RSS_ANALYZE" | "EXPORT_BACKUP",
  "targetResourceId": string,
  "searchQuery": string,
  "changeSummary": string,
  "title": string,
  "metaDescription": string,
  "labels": string[],
  "htmlContent": string,
  "mermaidDiagramCode": string,
  "mathFormulas": string,
  "affiliateComparisonHtml": string,
  "mediaQuery": string,
  "jsonLdSchema": string
}
Do not include any conversational filler or markdown wrapping outside the JSON object.`;

    const userMessage = `User Instruction: "${prompt}"\n${contextInfo ? `Context Info:\n${contextInfo}` : ''}`;

    let lastError: Error | null = null;

    // Try each free model in sequence until one succeeds
    for (const model of OPENROUTER_FREE_MODELS) {
      try {
        if (onModelChange) {
          onModelChange(model);
        }

        const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://mlspyshop.github.io/Viblogger-for-Blogger/',
          'X-Title': 'Viblogger for Blogger'
        };

        const requestBody = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          response_format: { type: 'json_object' },
          stream: true,
          temperature: 0.25
        };

        let fullAccumulatedText = '';

        // Attempt streaming
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Model ${model} returned ${res.status}: ${errText}`);
        }

        if (res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6).trim();
                if (jsonStr && jsonStr !== '[DONE]') {
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const delta = parsed.choices?.[0]?.delta?.content || '';
                    if (delta) {
                      fullAccumulatedText += delta;
                      if (onStreamChunk) {
                        onStreamChunk(delta, fullAccumulatedText);
                      }
                    }
                  } catch {
                    // Ignore SSE json chunk fragment parse errors
                  }
                }
              }
            }
          }

          if (fullAccumulatedText.trim()) {
            const plan = extractJsonPayload(fullAccumulatedText);
            return { plan, modelUsed: model };
          }
        }

        // Fallback to static if streaming gave empty
        const staticRes = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...requestBody, stream: false })
        });

        if (!staticRes.ok) {
          const errText = await staticRes.text();
          throw new Error(`Model ${model} static failed ${staticRes.status}: ${errText}`);
        }

        const staticData = await staticRes.json();
        const content = staticData.choices?.[0]?.message?.content;
        if (content) {
          if (onStreamChunk) {
            onStreamChunk(content, content);
          }
          const plan = extractJsonPayload(content);
          return { plan, modelUsed: model };
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Proceed to next free model
        continue;
      }
    }

    throw lastError || new Error('All OpenRouter free models failed to synthesize content. Please verify your OpenRouter key or check service status.');
  }
};
