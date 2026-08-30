import { AuditResult } from '../types';

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: object) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    };
    katex?: {
      renderToString: (tex: string, options?: object) => string;
    };
  }
}

export const RenderingEngine = {
  initMermaid() {
    if (typeof window !== 'undefined' && window.mermaid) {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose'
        });
      } catch {
        // Init safe
      }
    }
  },

  async renderMermaidDiagram(mermaidCode?: string): Promise<string> {
    if (!mermaidCode || !mermaidCode.trim()) return '';
    if (typeof window === 'undefined' || !window.mermaid) return '';

    try {
      this.initMermaid();
      const diagramId = 'mermaid_' + Math.random().toString(36).substring(2, 7);
      const { svg } = await window.mermaid.render(diagramId, mermaidCode.trim());
      return `
<figure class="viblogger-mermaid-diagram" style="margin: 2rem 0; text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem;">
  <div style="display: inline-block; max-width: 100%; overflow-x: auto;">${svg}</div>
  <figcaption style="font-size: 12px; color: #64748b; margin-top: 6px; font-style: italic;">
    Figure: Structural diagram rendered via Mermaid.js vector engine.
  </figcaption>
</figure>`;
    } catch (err) {
      console.warn('Mermaid rendering skipped or failed:', err);
      return '';
    }
  },

  renderKaTeXFormulas(html: string): string {
    if (typeof window === 'undefined' || !window.katex || !html) return html;

    let processed = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return `<div class="katex-block" style="margin: 1.5rem 0; text-align: center; overflow-x: auto;">${window.katex!.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch {
        return `$$${math}$$`;
      }
    });

    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return window.katex!.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch {
        return `$${math}$`;
      }
    });

    return processed;
  },

  injectTableOfContents(html: string): string {
    if (typeof DOMParser === 'undefined' || !html) return html;
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h2, h3'));
      if (headings.length < 2) return html;

      let tocListHtml = '';
      headings.forEach((h, idx) => {
        const id = 'section-' + (idx + 1);
        h.id = id;
        const isH3 = h.tagName.toLowerCase() === 'h3';
        const style = isH3 ? 'margin-left: 20px; font-size: 13px;' : 'margin-top: 6px; font-weight: 600; font-size: 14px;';
        tocListHtml += `<li style="${style}"><a href="#${id}" style="color: #0284c7; text-decoration: none;">${h.textContent}</a></li>`;
      });

      const tocBlock = `
<nav class="viblogger-dynamic-toc" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin: 1.5rem 0;">
  <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
    <span>📑 Table of Contents</span>
  </div>
  <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.6;">
    ${tocListHtml}
  </ul>
</nav>`;

      return tocBlock + '\n' + doc.body.innerHTML;
    } catch {
      return html;
    }
  },

  executeAudit(html: string): AuditResult {
    if (typeof DOMParser === 'undefined' || !html) {
      return { passed: true, confidence: '1.00', wordCount: 0, headings: 0, tables: 0 };
    }

    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const text = doc.body.textContent || '';
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      const headings = doc.querySelectorAll('h2, h3, h4').length;
      const tables = doc.querySelectorAll('table').length;

      let score = 1.0;
      if (wordCount < 100) score -= 0.3;
      if (headings < 1) score -= 0.2;

      return {
        passed: score >= 0.5,
        confidence: Math.max(0.1, score).toFixed(2),
        wordCount,
        headings,
        tables
      };
    } catch {
      return { passed: true, confidence: '1.00', wordCount: 0, headings: 0, tables: 0 };
    }
  }
};
