import { GeminiPlanPayload } from '../types';

export interface StreamProgressCallback {
  (delta: string, accumulated: string): void;
}

export const GeminiService = {
  async routeAndSynthesize(
    apiKey: string,
    prompt: string,
    contextInfo = '',
    onStreamChunk?: StreamProgressCallback
  ): Promise<GeminiPlanPayload> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      throw new Error('Gemini API key is required. Please input it in the toolbar.');
    }

    const streamEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${encodeURIComponent(cleanKey)}&alt=sse`;
    const staticEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(cleanKey)}`;

    const schema = {
      type: 'OBJECT',
      properties: {
        apiAction: {
          type: 'STRING',
          enum: [
            'POST_CREATE',
            'POST_UPDATE',
            'POST_DELETE',
            'POST_PUBLISH',
            'POST_REVERT',
            'POST_LIST',
            'POST_SEARCH',
            'PAGE_CREATE',
            'PAGE_UPDATE',
            'PAGE_DELETE',
            'PAGE_LIST',
            'COMMENTS_LIST',
            'BLOG_STATS',
            'GSC_QUERY',
            'RSS_ANALYZE',
            'EXPORT_BACKUP'
          ]
        },
        targetResourceId: { type: 'STRING' },
        searchQuery: { type: 'STRING' },
        changeSummary: { type: 'STRING' },
        title: { type: 'STRING' },
        metaDescription: { type: 'STRING' },
        labels: { type: 'ARRAY', items: { type: 'STRING' } },
        htmlContent: {
          type: 'STRING',
          description: 'Complete article body formatted in semantic HTML5 with H2/H3 headings, tables, or affiliate cards.'
        },
        mermaidDiagramCode: {
          type: 'STRING',
          description: 'Mermaid.js diagram syntax (e.g., graph TD or sequenceDiagram). Leave empty if not applicable.'
        },
        mathFormulas: {
          type: 'STRING',
          description: 'KaTeX LaTeX math formulas (e.g. $$...$$). Leave empty if none.'
        },
        affiliateComparisonHtml: {
          type: 'STRING',
          description: 'Pre-styled responsive comparison card or Pros/Cons container if requested.'
        },
        mediaQuery: { type: 'STRING' },
        jsonLdSchema: { type: 'STRING' }
      },
      required: ['apiAction', 'title', 'metaDescription', 'labels', 'htmlContent', 'mediaQuery', 'jsonLdSchema']
    };

    const systemInstruction = `You are Viblogger for Blogger, an autonomous publishing workstation with direct control over Blogger API v3, Mermaid.js diagrams, KaTeX LaTeX math, and Search Console telemetry.
Synthesize deep, professional publications with semantic H2/H3 headings, code blocks, Mermaid diagrams, and valid JSON-LD schemas. Output strict JSON adhering to the schema.`;

    const contents = [
      {
        parts: [
          {
            text: `User Instruction: "${prompt}"\n${contextInfo ? `Context Info:\n${contextInfo}` : ''}`
          }
        ]
      }
    ];

    const requestBody = JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.25
      }
    });

    let fullAccumulatedText = '';

    // Attempt Live Streaming via SSE
    try {
      const res = await fetch(streamEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // keep the last incomplete chunk in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6).trim();
              if (jsonStr && jsonStr !== '[DONE]') {
                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  if (delta) {
                    fullAccumulatedText += delta;
                    if (onStreamChunk) {
                      onStreamChunk(delta, fullAccumulatedText);
                    }
                  }
                } catch {
                  // ignore intermediate parse errors in chunk
                }
              }
            }
          }
        }

        // Process any trailing buffer
        if (buffer.trim().startsWith('data: ')) {
          try {
            const jsonStr = buffer.trim().slice(6).trim();
            if (jsonStr && jsonStr !== '[DONE]') {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (delta) {
                fullAccumulatedText += delta;
                if (onStreamChunk) {
                  onStreamChunk(delta, fullAccumulatedText);
                }
              }
            }
          } catch {
            // safe ignore
          }
        }

        if (fullAccumulatedText.trim()) {
          // Parse candidate JSON
          return JSON.parse(fullAccumulatedText.trim()) as GeminiPlanPayload;
        }
      }
    } catch {
      // Stream failed or was interrupted, proceed to static fallback
    }

    // Fallback to standard non-streaming POST
    const staticRes = await fetch(staticEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody
    });

    if (!staticRes.ok) {
      const errText = await staticRes.text();
      throw new Error(`Gemini API Error [${staticRes.status}]: ${errText}`);
    }

    const data = await staticRes.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error('Gemini returned an empty response. Please retry.');
    }

    if (onStreamChunk) {
      onStreamChunk(candidate, candidate);
    }

    return JSON.parse(candidate) as GeminiPlanPayload;
  }
};
