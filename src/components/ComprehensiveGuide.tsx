import React, { useState } from 'react';

interface ComprehensiveGuideProps {
  onUsePrompt?: (promptText: string) => void;
}

export const ComprehensiveGuide: React.FC<ComprehensiveGuideProps> = ({ onUsePrompt }) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'architecture' | 'syntax' | 'visuals' | 'seo' | 'pages' | 'gsc' | 'prompts' | 'cli'
  >('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUsePrompt = (text: string) => {
    if (onUsePrompt) {
      onUsePrompt(text);
    }
  };

  return (
    <div className="guide-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Guide Header Ribbon */}
      <div
        style={{
          background: '#000080',
          color: '#ffffff',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #808080'
        }}
      >
        <div>
          <strong style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
            📖 VIBLOGGER FOR BLOGGER — MASTER OPERATOR MANUAL &amp; COMMAND GUIDE
          </strong>
          <div style={{ fontSize: '11px', color: '#c0c0ff', marginTop: '2px' }}>
            Comprehensive 2000+ Word Technical Reference &bull; Gemini 2.5 Flash Autonomous Synthesis Engine
          </div>
        </div>
        <div style={{ fontSize: '11px', background: '#000040', padding: '2px 8px', border: '1px solid #0080ff' }}>
          DOCUMENT VERSION: 2.4.0-PRO
        </div>
      </div>

      {/* Guide Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          background: '#d4d0c8',
          padding: '4px',
          border: '1px solid #808080'
        }}
      >
        <button
          type="button"
          className={`win-btn ${activeTab === 'all' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'all' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('all')}
        >
          [View All Chapters]
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'architecture' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'architecture' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('architecture')}
        >
          1. Architecture
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'syntax' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'syntax' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('syntax')}
        >
          2. Prompt Syntax
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'visuals' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'visuals' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('visuals')}
        >
          3. Mermaid &amp; Math
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'seo' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'seo' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('seo')}
        >
          4. SEO &amp; AI Overviews
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'pages' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'pages' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('pages')}
        >
          5. Static Pages
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'gsc' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'gsc' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('gsc')}
        >
          6. GSC &amp; IndexNow
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'prompts' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'prompts' ? 'bold' : 'normal', fontSize: '11px', color: '#800000' }}
          onClick={() => setActiveTab('prompts')}
        >
          7. Example Prompts (15+)
        </button>
        <button
          type="button"
          className={`win-btn ${activeTab === 'cli' ? 'active' : ''}`}
          style={{ fontWeight: activeTab === 'cli' ? 'bold' : 'normal', fontSize: '11px' }}
          onClick={() => setActiveTab('cli')}
        >
          8. CLI Reference
        </button>
      </div>

      {/* Quick Search Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Filter Guide Content:</span>
        <input
          type="text"
          className="input-field"
          style={{ flex: 1, padding: '3px 6px', fontSize: '11px' }}
          placeholder="Type keyword to filter (e.g., 'Mermaid', 'KaTeX', 'Affiliate', 'GSC', 'JSON-LD', 'Privacy Policy')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="win-btn" style={{ fontSize: '10px' }} onClick={() => setSearchQuery('')}>
            Clear
          </button>
        )}
      </div>

      {/* CHAPTER 1: WORKSTATION ARCHITECTURE & OPERATIONAL PHILOSOPHY */}
      {(activeTab === 'all' || activeTab === 'architecture') && (
        <div className="doc-section">
          <h3>CHAPTER 1: SYSTEM ARCHITECTURE &amp; OPERATIONAL PHILOSOPHY</h3>
          <p>
            <strong>Viblogger for Blogger</strong> is a high-throughput, autonomous command-line publishing workstation designed specifically for technical writers, affiliate marketers, developer advocates, and SEO engineers. Operating entirely within a high-speed browser client, Viblogger pairs Google DeepMind's <strong>Gemini 2.5 Flash</strong> generative intelligence engine with direct, client-side REST orchestration of the <strong>Blogger API v3</strong>, <strong>Google Identity Services (GIS) OAuth 2.0</strong>, <strong>IndexNow protocol</strong>, and <strong>Google Search Console (GSC)</strong> telemetry.
          </p>
          <p>
            Unlike conventional content management interfaces that require tedious manual formatting, switching between markdown editors, converting mathematical notation, and manually configuring search meta tags, Viblogger executes an end-to-end autonomous synthesis loop:
          </p>
          <ol>
            <li>
              <strong>Natural Language Intent Parsing:</strong> The operator enters any instruction in natural language. Viblogger analyzes the semantic goal, determines whether the request requires an API query (e.g., listing posts, searching drafts, fetching comments, analyzing GSC performance) or a content mutation (e.g., creating a 3,000-word post, building a programmatic landing page, updating an existing document, or deleting obsolete content).
            </li>
            <li>
              <strong>Structured Multi-Modal Generation:</strong> Powered by Gemini 2.5 Flash, the engine emits a strict structured JSON payload adhering to a comprehensive schema. This payload encapsulates semantic HTML5 article markup, meta descriptions, hierarchical taxonomy labels, reactive Mermaid.js diagram code, KaTeX mathematical formulas, responsive comparison tables, and schema.org JSON-LD scripts.
            </li>
            <li>
              <strong>Live Server-Sent Event (SSE) Streaming:</strong> Responses stream into the retro CRT terminal token-by-token in real-time, allowing operators to observe the synthesis process immediately as it generates rather than waiting for a bulk payload.
            </li>
            <li>
              <strong>Autonomous Media &amp; Asset Resolution:</strong> When an article requires visual figures, Viblogger automatically interrogates the Openverse and Wikimedia Commons APIs to retrieve high-resolution, CC-licensed assets, complete with verified attribution tags and responsive caption wrappers.
            </li>
            <li>
              <strong>Universal Rendering &amp; Compilation:</strong> Before dispatching to Blogger, the engine compiles dynamic elements: Mermaid syntax is embedded into self-initializing SVG containers, KaTeX formulas are validated, and responsive inline styles are applied to prevent theme collisions with custom Blogger XML templates.
            </li>
            <li>
              <strong>Operator Approval Safeguards:</strong> In compliance with security standards, all destructive or state-modifying operations (such as updating or deleting existing live articles) trigger an interactive yellow confirmation dialog where the human operator inspects the proposed mutation before execution.
            </li>
            <li>
              <strong>Instant Search Engine Dispatch:</strong> Upon successful publication of new articles, Viblogger automatically sends real-time IndexNow push notifications to Bing, Yandex, and participating search engines, ensuring your content is queued for indexing within seconds of creation.
            </li>
          </ol>
        </div>
      )}

      {/* CHAPTER 2: MASTER PROMPT ENGINEERING & SYNTAX PROTOCOL */}
      {(activeTab === 'all' || activeTab === 'syntax') && (
        <div className="doc-section">
          <h3>CHAPTER 2: MASTER PROMPT SYNTAX &amp; COMMAND ROUTING</h3>
          <p>
            Viblogger features an intuitive natural language command parser. You do not need to learn esoteric programming parameters; simply state your objective in clear technical or editorial terms. The autonomous router categorizes your prompt into one of three execution modes:
          </p>
          <ul>
            <li>
              <strong>Creation Mode (Posts &amp; Pages):</strong> Prompts containing words like <code>write</code>, <code>synthesize</code>, <code>create</code>, <code>review</code>, <code>generate</code>, <code>draft</code>, or <code>build landing page</code> trigger the complete writing and compilation engine.
            </li>
            <li>
              <strong>Query &amp; Telemetry Mode:</strong> Prompts like <code>list posts</code>, <code>show drafts</code>, <code>search posts for [keyword]</code>, <code>list pages</code>, <code>fetch recent comments</code>, or <code>show search analytics</code> interact directly with the live Blogger API and Google Search Console to retrieve structured data tables directly onto your terminal.
            </li>
            <li>
              <strong>Maintenance &amp; Mutation Mode:</strong> Prompts like <code>update post [ID] with [changes]</code>, <code>delete page [ID]</code>, <code>revert post [ID] to draft</code>, or <code>export blog backup</code> trigger staged modifications with operator verification.
            </li>
          </ul>
          <p>
            <strong>Key Modifiers You Can Append to Any Prompt:</strong>
          </p>
          <ul>
            <li>
              <code>with Mermaid flowchart</code> &mdash; Instructs Gemini to synthesize a custom <code>graph TD</code>, <code>sequenceDiagram</code>, or <code>stateDiagram</code> modeling the process discussed in the post.
            </li>
            <li>
              <code>with KaTeX LaTeX math</code> &mdash; Demands rigorous mathematical notation for machine learning, physics, finance, or algorithmic proofs.
            </li>
            <li>
              <code>with interactive Table of Contents</code> &mdash; Embeds a sticky, clickable navigation widget linking directly to all H2 and H3 anchors.
            </li>
            <li>
              <code>with affiliate comparison cards</code> &mdash; Injects high-converting product evaluation boxes featuring star ratings, pros &amp; cons bullet points, and highlighted CTA buttons.
            </li>
            <li>
              <code>with JSON-LD TechArticle schema</code> &mdash; Generates rich structured metadata formatted for Google Rich Snippets and AI Overview citations.
            </li>
            <li>
              <code>draft mode</code> vs <code>publish live</code> &mdash; Governs whether the output is saved as a hidden draft in your Blogger backend or published instantly to your public URL.
            </li>
          </ul>
        </div>
      )}

      {/* CHAPTER 3: INTERACTIVE VISUALS, MERMAID DIAGRAMS & KATEX MATH */}
      {(activeTab === 'all' || activeTab === 'visuals') && (
        <div className="doc-section">
          <h3>CHAPTER 3: INTERACTIVE VISUALS, MERMAID DIAGRAMS &amp; KATEX TYPESETTING</h3>
          <p>
            Standard Blogger posts are traditionally limited to plain text and basic images. Viblogger modernizes your blog by compiling cutting-edge developer documentation primitives directly into semantic, self-contained HTML:
          </p>
          <p>
            <strong>1. Mermaid.js Vector Diagrams:</strong><br />
            Mermaid syntax enables you to generate professional diagrams programmatically without using Photoshop or Figma. Viblogger automatically wraps generated Mermaid definitions in an isolated JavaScript loader that pulls <code>mermaid.min.js</code> from Cloudflare CDN upon page load and compiles diagrams into scalable vector graphics (SVG) that look crisp on Retina and mobile screens.
          </p>
          <div style={{ background: '#f5f5f5', padding: '8px', border: '1px solid #cccccc', margin: '6px 0', fontFamily: 'monospace', fontSize: '11px' }}>
            {`Supported Mermaid Diagram Types:
• flowchart TD / LR (Architecture pipelines, decision trees, workflow steps)
• sequenceDiagram (API request lifecycles, OAuth handshake protocols)
• stateDiagram-v2 (FSM states, transaction lifecycles)
• classDiagram (Object-oriented models, schema structures)
• gitGraph (Branching strategies, CI/CD deployment pipelines)`}
          </div>
          <p>
            <strong>2. KaTeX Mathematical Typography:</strong><br />
            For data science, quantitative finance, cryptography, and computer engineering articles, Viblogger compiles LaTeX math expressions into ultra-fast KaTeX markup. The compiled post includes the lightweight KaTeX stylesheet and auto-render extension, rendering inline equations (e.g. <code>$O(N \log N)$</code>) and display equations (e.g. <code>{`$$\\mathcal{L}_{\\text{total}} = \\alpha \\cdot \\text{MSE} + \\beta \\cdot \\text{KL}$$`}</code>) with typographic precision.
          </p>
          <p>
            <strong>3. Responsive Affiliate &amp; Comparison UI Components:</strong><br />
            To maximize conversion rates on affiliate reviews, Viblogger formats comparison cards with clean inline styling that is completely immune to Blogger CSS overrides. Components include highlighted verdict badges, pros and cons side-by-side matrices, feature checkmarks, and responsive button containers that adapt effortlessly across mobile phones and desktop displays.
          </p>
        </div>
      )}

      {/* CHAPTER 4: GENERATIVE ENGINE OPTIMIZATION (GEO) & SEARCH SCHEMAS */}
      {(activeTab === 'all' || activeTab === 'seo') && (
        <div className="doc-section">
          <h3>CHAPTER 4: GENERATIVE ENGINE OPTIMIZATION (GEO) &amp; SEARCH SCHEMAS</h3>
          <p>
            Modern search engine visibility is no longer just about classic keyword density. With the advent of <strong>Google AI Overviews</strong>, <strong>Perplexity AI</strong>, and <strong>Bing Copilot</strong>, technical content must be structured for machine comprehension and retrieval-augmented generation (RAG).
          </p>
          <p>
            Viblogger implements state-of-the-art <strong>Generative Engine Optimization (GEO)</strong> principles across every generated article:
          </p>
          <ul>
            <li>
              <strong>Direct Fact Extraction Density:</strong> Articles open with high-density summary definitions and direct answers formatted specifically for ingestion by LLM retrieval crawlers.
            </li>
            <li>
              <strong>Hierarchical Semantic Taxonomy:</strong> Content utilizes precise H2 and H3 heading hierarchies with descriptive keyword nouns rather than vague prose, enabling search spiders to map subtopic clusters accurately.
            </li>
            <li>
              <strong>Embedded Schema.org JSON-LD:</strong> Every article includes customized JSON-LD structured data injected into a <code>&lt;script type="application/ld+json"&gt;</code> block. Depending on the content type, the engine automatically chooses between:
              <ul>
                <li><code>BlogPosting</code> &mdash; Standard editorial articles with author, datePublished, and headline tags.</li>
                <li><code>TechArticle</code> &mdash; In-depth code walkthroughs and engineering architectures with dependencies and proficiencyLevel fields.</li>
                <li><code>Product / Review</code> &mdash; Product evaluations with itemReviewed, reviewRating, and publisher markup.</li>
                <li><code>FAQPage</code> &mdash; Q&amp;A sections formatted to trigger collapsible rich snippets in Google SERPs.</li>
              </ul>
            </li>
            <li>
              <strong>Open Graph &amp; Twitter Card Fallbacks:</strong> Meta titles and concise, click-worthy meta descriptions are generated and calibrated within the optimal 150-160 character window to prevent search result truncation.
            </li>
          </ul>
        </div>
      )}

      {/* CHAPTER 5: PROGRAMMATIC STATIC PAGES & PILLAR DOCS */}
      {(activeTab === 'all' || activeTab === 'pages') && (
        <div className="doc-section">
          <h3>CHAPTER 5: PROGRAMMATIC STATIC PAGES &amp; PILLAR HUBS</h3>
          <p>
            In Blogger, <strong>Pages</strong> differ fundamentally from chronological <strong>Posts</strong>. Pages serve as permanent, standalone navigational landmarks (such as your <em>About Us</em>, <em>Privacy Policy</em>, <em>Affiliate Earnings Disclaimer</em>, <em>Terms of Service</em>, or central <em>Topic Resource Hubs</em>).
          </p>
          <p>
            Viblogger provides dedicated routing for Blogger Pages:
          </p>
          <ul>
            <li>
              <strong>Creating Standalone Legal &amp; Compliance Pages:</strong> Generating complete legal disclosures that comply with GDPR, CCPA, and FTC guidelines is as simple as typing <code>Create Privacy Policy static page for [My Website Name]</code>. Viblogger automatically targets the <code>PAGE_CREATE</code> API route rather than creating a dated blog post.
            </li>
            <li>
              <strong>Topic Pillar Hubs &amp; Documentation Directories:</strong> Build comprehensive index pages that organize your blog's core archives, featured guides, tool recommendations, and downloadable assets with structured grid cards and internal anchor links.
            </li>
            <li>
              <strong>Listing &amp; Managing Existing Pages:</strong> Run <code>list pages</code> or use the <strong>[Query] &rarr; [List Static Pages]</strong> menu item to view all active pages on your Blogger site along with their permanent URLs and page IDs.
            </li>
          </ul>
        </div>
      )}

      {/* CHAPTER 6: GOOGLE SEARCH CONSOLE & COMPETITOR RSS INGESTION */}
      {(activeTab === 'all' || activeTab === 'gsc') && (
        <div className="doc-section">
          <h3>CHAPTER 6: GOOGLE SEARCH CONSOLE &amp; COMPETITOR RSS INGESTION</h3>
          <p>
            Data-driven publishing requires continuous feedback on which search queries are driving traffic and what competitors are publishing. Viblogger integrates two powerful intelligence channels directly into your terminal:
          </p>
          <p>
            <strong>1. Google Search Console (GSC) Performance Audits:</strong><br />
            When authenticated via Google Identity Services with search console scopes, you can query your search analytics directly from the terminal. Type <code>fetch search analytics</code> or <code>show top search queries</code> to generate a real-time table displaying your top organic keywords, impressions, total clicks, average click-through rate (CTR), and average SERP position over the last 30 days.
          </p>
          <p>
            <strong>2. Competitor RSS Feed Ingestion &amp; Gap Analysis:</strong><br />
            Stay ahead of industry trends by analyzing competitor feeds. When you enter a command like <code>analyze competitor rss https://competitor.com/feed.xml</code>, Viblogger fetches the remote RSS XML feed, extracts the latest published headlines, categories, and summaries, identifies topical gaps, and automatically crafts a counter-article outline designed to outrank the competition with deeper analysis and superior diagrams.
          </p>
          <p>
            <strong>3. Automated IndexNow Submission:</strong><br />
            Whenever you publish an article to a live blog, Viblogger constructs an IndexNow API payload containing your host, API key, and published article URL, dispatching it immediately to Bing and Yandex endpoints to bypass typical multi-day indexing delays.
          </p>
        </div>
      )}

      {/* CHAPTER 7: 15+ PRODUCTION EXAMPLE PROMPTS */}
      {(activeTab === 'all' || activeTab === 'prompts') && (
        <div className="doc-section">
          <h3 style={{ color: '#800000' }}>CHAPTER 7: PRODUCTION PROMPT BLUEPRINTS (15+ EXHAUSTIVE PROMPTS)</h3>
          <p>
            Below are 15+ comprehensive, production-ready prompts spanning every domain of technical blogging, affiliate marketing, data science, and web architecture. Click <strong>[📋 Copy Prompt]</strong> to copy to your clipboard, or <strong>[🚀 Transmit to Agent]</strong> to run the prompt immediately in Viblogger.
          </p>

          {/* BLUEPRINT 1 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #1: Distributed Systems &amp; Vector Indexing Teardown</span>
              <span className="example-badge">Mermaid + KaTeX + TechArticle Schema</span>
            </h4>
            <p>
              Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include:
              1. An interactive Table of Contents at the top.
              2. A Mermaid.js flowchart (graph TD) illustrating multi-layer graph traversals during cosine similarity search.
              3. KaTeX display formulas ($$ ... $$) for L2 Euclidean Distance and Cosine Similarity equations.
              4. A clean HTML comparison table detailing query latency (p99), memory consumption (RAM per 1M vectors), recall accuracy, and index build time.
              5. Production Python code snippets demonstrating index initialization with FAISS.
              6. Complete JSON-LD TechArticle structured data schema.
              7. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include an interactive Table of Contents, a Mermaid flowchart illustrating multi-layer graph traversals, KaTeX formulas for Euclidean distance and Cosine similarity, a responsive HTML comparison table of throughput/latency benchmarks, Python FAISS code snippets, and complete JSON-LD TechArticle structured data. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.`,
                    1
                  )
                }
              >
                {copiedIndex === 1 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include an interactive Table of Contents, a Mermaid flowchart illustrating multi-layer graph traversals, KaTeX formulas for Euclidean distance and Cosine similarity, a responsive HTML comparison table of throughput/latency benchmarks, Python FAISS code snippets, and complete JSON-LD TechArticle structured data. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 2 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #2: Full-Stack Affiliate Review &amp; Comparison Matrix</span>
              <span className="example-badge">Affiliate Cards + Rating Badges + FAQ Schema</span>
            </h4>
            <p>
              Write a comprehensive, high-converting buyer's guide and review titled 'Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown'.
              Structure requirements:
              1. An upfront 'Executive Summary' box recommending the #1 overall winner and best budget pick.
              2. Individual review sections for Hetzner Cloud, DigitalOcean, Vultr, Linode (Akamai), and AWS Lightsail.
              3. For each provider, include a stylized affiliate comparison card with: Star Rating (e.g. 4.8/5.0), Key Specifications list, 'Pros &amp; Cons' dual-column bullet matrix, and a prominent 'Visit Official Site' CTA button.
              4. A comprehensive feature comparison table comparing Geekbench 6 multi-core scores, bandwidth pricing per TB, NVMe read/write speeds, and DDoS mitigation options.
              5. A collapsible FAQ section answering 4 common questions with embedded FAQPage JSON-LD schema.
              6. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Write a comprehensive, high-converting buyer's guide and review titled 'Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown'. Include an upfront Executive Summary box, individual review sections with stylized affiliate comparison cards (star ratings, pros/cons, CTA buttons), a Geekbench/pricing comparison table, and an FAQ section with embedded FAQPage JSON-LD schema. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.`,
                    2
                  )
                }
              >
                {copiedIndex === 2 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Write a comprehensive, high-converting buyer's guide and review titled 'Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown'. Include an upfront Executive Summary box, individual review sections with stylized affiliate comparison cards (star ratings, pros/cons, CTA buttons), a Geekbench/pricing comparison table, and an FAQ section with embedded FAQPage JSON-LD schema. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 3 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #3: Quantum Computing &amp; Shor&apos;s Algorithm Math Deep-Dive</span>
              <span className="example-badge">KaTeX Math ($$...$$) + Mermaid Sequence + Qiskit</span>
            </h4>
            <p>
              Create an advanced mathematical treatise on &apos;Breaking RSA with Shor&apos;s Algorithm: Quantum Period Finding in Practice&apos;.
              Include:
              1. Rigorous KaTeX formulas for Quantum Fourier Transform (QFT), modular exponentiation, and state superposition probability amplitudes ({`$$\\frac{1}{\\sqrt{N}} \\sum |x\\rangle$$`}).
              2. A Mermaid sequenceDiagram illustrating the quantum circuit execution flow between classical control hardware, quantum register gates, and measurement collapse.
              3. Executable Python code using Qiskit demonstrating circuit construction and simulation.
              4. A breakdown of Post-Quantum Cryptography (PQC) standards including CRYSTALS-Kyber and Dilithium.
              5. JSON-LD TechArticle schema and meta description.
              6. Labels: Quantum Computing, Cryptography, Math, Qiskit, Security.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Create an advanced mathematical treatise on 'Breaking RSA with Shor's Algorithm: Quantum Period Finding in Practice'. Include rigorous KaTeX formulas for Quantum Fourier Transform and modular exponentiation, a Mermaid sequenceDiagram of quantum register state collapse, Qiskit Python code, a Post-Quantum Cryptography breakdown, and JSON-LD TechArticle schema. Labels: Quantum Computing, Cryptography, Math, Qiskit, Security.`,
                    3
                  )
                }
              >
                {copiedIndex === 3 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Create an advanced mathematical treatise on 'Breaking RSA with Shor's Algorithm: Quantum Period Finding in Practice'. Include rigorous KaTeX formulas for Quantum Fourier Transform and modular exponentiation, a Mermaid sequenceDiagram of quantum register state collapse, Qiskit Python code, a Post-Quantum Cryptography breakdown, and JSON-LD TechArticle schema. Labels: Quantum Computing, Cryptography, Math, Qiskit, Security.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 4 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #4: Zero-Trust Kubernetes CI/CD Pipeline Architecture</span>
              <span className="example-badge">Mermaid GitGraph + Security Matrices + YAML</span>
            </h4>
            <p>
              Synthesize a 2200-word production guide titled 'Implementing Zero-Trust Architecture in Kubernetes with Istio Service Mesh, mTLS &amp; Cilium eBPF'.
              Requirements:
              1. A Mermaid flowchart (graph TD) illustrating ingress gateway authentication, mTLS encryption handshake between pods, and SPIFFE/SPIRE identity token verification.
              2. Production-ready Kubernetes YAML manifests for Istio PeerAuthentication and CiliumNetworkPolicy.
              3. A step-by-step hardened verification procedure with terminal curl commands.
              4. A threat model matrix covering MITM attacks, pod lateral movement, and egress DNS exfiltration.
              5. JSON-LD TechArticle metadata and optimized GEO summary paragraph.
              6. Labels: Kubernetes, DevSecOps, Istio, eBPF, Cloud Native.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Synthesize a 2200-word production guide titled 'Implementing Zero-Trust Architecture in Kubernetes with Istio Service Mesh, mTLS & Cilium eBPF'. Include a Mermaid flowchart of the mTLS/SPIFFE handshake, production Kubernetes YAML manifests, a threat model security matrix, and JSON-LD TechArticle metadata. Labels: Kubernetes, DevSecOps, Istio, eBPF, Cloud Native.`,
                    4
                  )
                }
              >
                {copiedIndex === 4 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Synthesize a 2200-word production guide titled 'Implementing Zero-Trust Architecture in Kubernetes with Istio Service Mesh, mTLS & Cilium eBPF'. Include a Mermaid flowchart of the mTLS/SPIFFE handshake, production Kubernetes YAML manifests, a threat model security matrix, and JSON-LD TechArticle metadata. Labels: Kubernetes, DevSecOps, Istio, eBPF, Cloud Native.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 5 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #5: Programmatic Privacy Policy &amp; GDPR Static Page</span>
              <span className="example-badge">PAGE_CREATE Route + Legal Compliance + Table</span>
            </h4>
            <p>
              Create a permanent static page (PAGE_CREATE) for our technical blog titled 'Privacy Policy, Cookie Notice &amp; Data Rights (GDPR / CCPA Compliance)'.
              Include:
              1. Clear sections detailing what log data, analytics metrics, and local storage variables are stored.
              2. An explicit third-party service disclosure table listing Google Analytics 4, Google AdSense, Cloudflare CDN, and Affiliate Partner networks with their respective privacy policy links.
              3. Instructions on how users can request data deletion or opt-out of cookie tracking under GDPR Article 17 and CCPA.
              4. Complete legal disclaimer that this policy is maintained in accordance with standard web guidelines.
              5. Clean semantic HTML with clean table and callout box formatting.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Create a permanent static page for our technical blog titled 'Privacy Policy, Cookie Notice & Data Rights (GDPR / CCPA Compliance)'. Include clear sections detailing data storage, a third-party service disclosure table (GA4, AdSense, Cloudflare, Affiliates), GDPR/CCPA user data rights, and clean HTML table formatting.`,
                    5
                  )
                }
              >
                {copiedIndex === 5 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Create a permanent static page for our technical blog titled 'Privacy Policy, Cookie Notice & Data Rights (GDPR / CCPA Compliance)'. Include clear sections detailing data storage, a third-party service disclosure table (GA4, AdSense, Cloudflare, Affiliates), GDPR/CCPA user data rights, and clean HTML table formatting.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 6 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #6: Programmatic FTC Affiliate Disclosure &amp; Editorial Ethics Page</span>
              <span className="example-badge">PAGE_CREATE Route + Transparency Hub</span>
            </h4>
            <p>
              Create a permanent static page titled 'Affiliate Disclosure, Editorial Standards &amp; Review Policy'.
              Structure:
              1. Explicit declaration of compliance with Federal Trade Commission (FTC) 16 CFR § 255 regarding endorsements and testimonials.
              2. Editorial integrity charter explaining how hardware and software products are benchmarked independently regardless of sponsorship.
              3. Explanation of affiliate tracking cookies, referral commissions, and how pricing remains identical for the consumer.
              4. Contact form or operator email instructions for reporting inaccuracies or corrections.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Create a permanent static page titled 'Affiliate Disclosure, Editorial Standards & Review Policy'. Include explicit FTC 16 CFR § 255 compliance declaration, independent benchmarking charter, explanation of affiliate tracking cookies, and editorial contact details.`,
                    6
                  )
                }
              >
                {copiedIndex === 6 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Create a permanent static page titled 'Affiliate Disclosure, Editorial Standards & Review Policy'. Include explicit FTC 16 CFR § 255 compliance declaration, independent benchmarking charter, explanation of affiliate tracking cookies, and editorial contact details.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 7 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #7: Competitor RSS Feed Ingestion &amp; Counter-Article Strategy</span>
              <span className="example-badge">RSS Feed Analyzer + Gap Strategy Synthesis</span>
            </h4>
            <p>
              Analyze the latest articles from this technical engineering RSS feed: https://blog.cloudflare.com/rss/.
              Identify the most prominent new feature announcement regarding Serverless Edge Functions or AI Inference at the Edge, extract the key competitive weaknesses, and draft a 2000-word comprehensive counter-guide detailing an open-source, multi-cloud alternative using Rust, WebAssembly (Wasm), and self-hosted Fastly Compute@Edge. Include an architectural Mermaid flowchart and JSON-LD metadata.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Analyze the latest articles from the Cloudflare Blog RSS feed: https://blog.cloudflare.com/rss/. Identify their latest Edge AI announcement, extract architectural tradeoffs, and synthesize an in-depth 2000-word counter-article detailing an open-source Rust and WebAssembly multi-cloud alternative with Mermaid diagrams and TechArticle schema.`,
                    7
                  )
                }
              >
                {copiedIndex === 7 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Analyze the latest articles from the Cloudflare Blog RSS feed: https://blog.cloudflare.com/rss/. Identify their latest Edge AI announcement, extract architectural tradeoffs, and synthesize an in-depth 2000-word counter-article detailing an open-source Rust and WebAssembly multi-cloud alternative with Mermaid diagrams and TechArticle schema.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 8 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #8: Google Search Console (GSC) Performance Audit &amp; Content Optimization</span>
              <span className="example-badge">GSC Analytics Query + CTR Optimization</span>
            </h4>
            <p>
              Fetch search console analytics for my connected Blogger property over the last 30 days. List the top 10 keywords by impressions that currently have a click-through rate (CTR) below 3.5%, and propose 3 high-converting, click-worthy H1 headlines and meta descriptions engineered to boost our organic SERP click volume.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Fetch search console analytics for my connected Blogger property over the last 30 days. Identify high-impression queries with CTR under 3.5%, and synthesize improved title tags and meta descriptions for SEO optimization.`,
                    8
                  )
                }
              >
                {copiedIndex === 8 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Fetch search console analytics for my connected Blogger property over the last 30 days. Identify high-impression queries with CTR under 3.5%, and synthesize improved title tags and meta descriptions for SEO optimization.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 9 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #9: Post-Mortem Incident Report &amp; Reliability Engineering</span>
              <span className="example-badge">StateDiagram-v2 + Timeline Table + SRE Metrics</span>
            </h4>
            <p>
              Write an in-depth, transparent SRE Engineering Post-Mortem titled 'Incident Report: 47-Minute Global API Outage Caused by Redis Cluster Split-Brain'.
              Structure:
              1. Executive Incident Summary with Total Downtime, Root Cause, and Financial Impact.
              2. Chronological minute-by-minute timeline table of detection, escalation, failover attempts, and resolution.
              3. A Mermaid stateDiagram-v2 illustrating the split-brain state transition between master and replica nodes under network partition.
              4. Deep technical root cause analysis exploring TCP keepalive timeouts and Sentinel quorum misconfigurations.
              5. Actionable Prevention Backlog with P0, P1, and P2 architectural remediation items.
              6. Labels: SRE, DevOps, Distributed Systems, Redis, Post-Mortem.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Write an in-depth SRE Engineering Post-Mortem titled 'Incident Report: 47-Minute Global API Outage Caused by Redis Cluster Split-Brain'. Include executive summary, chronological incident timeline table, a Mermaid stateDiagram-v2 of the split-brain network partition, deep root cause analysis, and actionable remediation items. Labels: SRE, DevOps, Distributed Systems, Redis, Post-Mortem.`,
                    9
                  )
                }
              >
                {copiedIndex === 9 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Write an in-depth SRE Engineering Post-Mortem titled 'Incident Report: 47-Minute Global API Outage Caused by Redis Cluster Split-Brain'. Include executive summary, chronological incident timeline table, a Mermaid stateDiagram-v2 of the split-brain network partition, deep root cause analysis, and actionable remediation items. Labels: SRE, DevOps, Distributed Systems, Redis, Post-Mortem.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 10 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #10: Headless CSS Reset &amp; Blogger Template Dark Mode Script</span>
              <span className="example-badge">CSS Code Snippet + Blogger Theme Wrapper</span>
            </h4>
            <p>
              Synthesize a technical tutorial titled 'Customizing Blogger XML Themes: Adding Headless Responsive CSS, Dynamic Dark Mode &amp; Prism.js Syntax Highlighting'.
              Include:
              1. Clean CSS styling that fixes standard Blogger font sizing and removes default container borders.
              2. Lightweight JavaScript (under 2KB) to toggle dark mode with localStorage persistence.
              3. Step-by-step instructions for injecting custom assets via Blogger's 'Theme' &rarr; 'Edit HTML' template editor.
              4. Live interactive preview card within the post demonstrating the dark mode toggle.
              5. Labels: Blogger, CSS, Web Design, JavaScript, Tutorials.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Synthesize a technical tutorial titled 'Customizing Blogger XML Themes: Adding Headless Responsive CSS, Dynamic Dark Mode & Prism.js Syntax Highlighting'. Include clean CSS overrides, lightweight vanilla JS dark mode toggle script with localStorage, step-by-step theme injection instructions, and JSON-LD HowTo schema. Labels: Blogger, CSS, Web Design, JavaScript, Tutorials.`,
                    10
                  )
                }
              >
                {copiedIndex === 10 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Synthesize a technical tutorial titled 'Customizing Blogger XML Themes: Adding Headless Responsive CSS, Dynamic Dark Mode & Prism.js Syntax Highlighting'. Include clean CSS overrides, lightweight vanilla JS dark mode toggle script with localStorage, step-by-step theme injection instructions, and JSON-LD HowTo schema. Labels: Blogger, CSS, Web Design, JavaScript, Tutorials.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 11 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #11: Machine Learning Transformer Attention Math Breakdown</span>
              <span className="example-badge">KaTeX ($$...$$) + Multi-Head Attention Flowchart</span>
            </h4>
            <p>
              Write a 2600-word university-grade educational post titled &apos;Deconstructing Multi-Head Scaled Dot-Product Attention: From Vector Math to CUDA Kernels&apos;.
              Include:
              1. Mathematical derivation of the Softmax Attention equation ({`$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$`}) using KaTeX notation.
              2. A Mermaid flowchart (graph TD) illustrating Query, Key, and Value linear projections, matrix multiplication, causal masking, and output concatenation.
              3. PyTorch module implementation code with batch tensor dimension annotations.
              4. A breakdown of FlashAttention-2 memory tiling optimizations on modern NVIDIA GPUs.
              5. Labels: Deep Learning, PyTorch, Transformers, AI, Mathematics.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Write a 2600-word university-grade educational post titled 'Deconstructing Multi-Head Scaled Dot-Product Attention: From Vector Math to CUDA Kernels'. Include KaTeX mathematical derivations of Softmax Attention and QKV projections, a Mermaid flowchart of the Multi-Head projection pipeline, PyTorch tensor code, FlashAttention-2 memory analysis, and TechArticle schema. Labels: Deep Learning, PyTorch, Transformers, AI, Mathematics.`,
                    11
                  )
                }
              >
                {copiedIndex === 11 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Write a 2600-word university-grade educational post titled 'Deconstructing Multi-Head Scaled Dot-Product Attention: From Vector Math to CUDA Kernels'. Include KaTeX mathematical derivations of Softmax Attention and QKV projections, a Mermaid flowchart of the Multi-Head projection pipeline, PyTorch tensor code, FlashAttention-2 memory analysis, and TechArticle schema. Labels: Deep Learning, PyTorch, Transformers, AI, Mathematics.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>

          {/* BLUEPRINT 12 */}
          <div className="example-card">
            <h4>
              <span>Blueprint #12: SaaS Pricing Model &amp; Unit Economics Financial Analysis</span>
              <span className="example-badge">KaTeX LTV/CAC + Interactive Tables + ROI Calculator</span>
            </h4>
            <p>
              Synthesize a financial teardown titled &apos;B2B SaaS Pricing Architectures: Seat-Based vs. Consumption vs. Hybrid Billing Models&apos;.
              Structure:
              1. Mathematical formulas for Customer Lifetime Value ({`$$\\text{LTV} = \\frac{\\text{ARPU} \\times \\text{Gross Margin}}{\\text{Churn Rate}}$$`}) and CAC Payback Period using KaTeX.
              2. Detailed comparison table analyzing Snowflake, Stripe, and Datadog consumption models with revenue retention benchmarks.
              3. Pro-and-Con breakdown of billing migration pitfalls and invoice forecasting errors.
              4. Complete JSON-LD Article metadata.
              5. Labels: SaaS, Pricing, Finance, Business Models, Startups.
            </p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button
                type="button"
                className="win-btn"
                onClick={() =>
                  handleCopy(
                    `Synthesize a financial teardown titled 'B2B SaaS Pricing Architectures: Seat-Based vs. Consumption vs. Hybrid Billing Models'. Include KaTeX mathematical formulas for LTV and CAC payback calculations, a detailed comparison table of billing models (Snowflake, Stripe, Datadog), unit economics analysis, and JSON-LD Article schema. Labels: SaaS, Pricing, Finance, Business Models, Startups.`,
                    12
                  )
                }
              >
                {copiedIndex === 12 ? 'Copied ✓' : '📋 Copy Prompt'}
              </button>
              <button
                type="button"
                className="win-btn"
                style={{ fontWeight: 'bold', color: '#000080' }}
                onClick={() =>
                  handleUsePrompt(
                    `Synthesize a financial teardown titled 'B2B SaaS Pricing Architectures: Seat-Based vs. Consumption vs. Hybrid Billing Models'. Include KaTeX mathematical formulas for LTV and CAC payback calculations, a detailed comparison table of billing models (Snowflake, Stripe, Datadog), unit economics analysis, and JSON-LD Article schema. Labels: SaaS, Pricing, Finance, Business Models, Startups.`
                  )
                }
              >
                🚀 Transmit to Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAPTER 8: TERMINAL CLI CHEAT SHEET & KEYBOARD SHORTCUTS */}
      {(activeTab === 'all' || activeTab === 'cli') && (
        <div className="doc-section">
          <h3>CHAPTER 8: TERMINAL COMMAND LINE REFERENCE &amp; SHORTCUTS</h3>
          <p>
            The Viblogger terminal accepts quick shorthand commands for immediate workstation control:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="term-table">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Command / Keyword</th>
                  <th style={{ width: '180px' }}>Target API Endpoint</th>
                  <th>Functional Execution &amp; Operator Effect</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>list posts</code> or <code>show drafts</code></td>
                  <td>Blogger Posts.list</td>
                  <td>Retrieves all recent blog posts and drafts into an interactive terminal table.</td>
                </tr>
                <tr>
                  <td><code>list pages</code></td>
                  <td>Blogger Pages.list</td>
                  <td>Displays all permanent standalone static pages with their direct URLs and Page IDs.</td>
                </tr>
                <tr>
                  <td><code>fetch comments</code></td>
                  <td>Blogger Comments.list</td>
                  <td>Scans the blog for recent visitor comments, authors, and approval statuses.</td>
                </tr>
                <tr>
                  <td><code>fetch search analytics</code></td>
                  <td>Google Search Console API</td>
                  <td>Queries 30-day organic impressions, clicks, CTR, and keyword rankings.</td>
                </tr>
                <tr>
                  <td><code>export blog backup</code></td>
                  <td>Blogger Batch Exporter</td>
                  <td>Generates and downloads a complete JSON archive of all posts, pages, and metadata.</td>
                </tr>
                <tr>
                  <td><code>clear</code> or <code>cls</code></td>
                  <td>Workstation Memory</td>
                  <td>Clears the CRT terminal viewport while keeping credentials active.</td>
                </tr>
                <tr>
                  <td><code>reset credentials</code></td>
                  <td>Local Storage API</td>
                  <td>Purges cached API keys, tokens, and Blog IDs from browser memory.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '8px' }}>
            <strong>Workstation Tips:</strong><br />
            &bull; <strong>Draft Mode Toggle:</strong> Keep <code>[☑ Draft]</code> checked in the ribbon if you want newly synthesized articles stored safely in your Blogger backend before public release.<br />
            &bull; <strong>Sound Synthesis:</strong> Click <code>[Sound: ON/OFF]</code> in the top menu bar to toggle retro mechanical keyboard and relay chime effects.<br />
            &bull; <strong>Direct Blogger Access:</strong> Click <code>[Launch Blogger ↗]</code> in the menu bar to jump directly into your official Google Blogger dashboard in a new tab.
          </p>
        </div>
      )}
    </div>
  );
};
