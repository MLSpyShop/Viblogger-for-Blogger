import React, { useState } from 'react';
import { GeminiPlanPayload, BlogItem } from '../types';
import { soundEngine } from '../services/sound';
import { ComprehensiveGuide } from './ComprehensiveGuide';

interface ModalsProps {
  activeModal: 'keys' | 'serp' | 'guide' | 'faq' | 'examples' | null;
  onClose: () => void;
  lastPlan: GeminiPlanPayload | null;
  geminiKey?: string;
  onGeminiKeyChange?: (val: string) => void;
  clientId?: string;
  onClientIdChange?: (val: string) => void;
  blogId?: string;
  onBlogIdChange?: (val: string) => void;
  userBlogs?: BlogItem[];
  onSelectBlog?: (selectedBlogId: string) => void;
  onSaveField?: (fieldName: 'gemini' | 'clientId' | 'blogId') => void;
  onUsePrompt?: (promptText: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  lastPlan,
  geminiKey = '',
  onGeminiKeyChange,
  clientId = '',
  onClientIdChange,
  blogId = '',
  onBlogIdChange,
  userBlogs = [],
  onSelectBlog,
  onSaveField,
  onUsePrompt
}) => {
  const [savedStatus, setSavedStatus] = useState<{ [key: string]: boolean }>({});

  const handleSave = (fieldName: 'gemini' | 'clientId' | 'blogId') => {
    try {
      if (fieldName === 'gemini') {
        localStorage.setItem('viblogger_gemini_key', geminiKey.trim());
      } else if (fieldName === 'clientId') {
        localStorage.setItem('viblogger_client_id', clientId.trim());
      } else if (fieldName === 'blogId') {
        localStorage.setItem('viblogger_blog_id', blogId.trim());
      }
    } catch {
      // safe
    }

    soundEngine.beep(1000, 50);
    setSavedStatus((prev) => ({ ...prev, [fieldName]: true }));
    setTimeout(() => {
      setSavedStatus((prev) => ({ ...prev, [fieldName]: false }));
    }, 1800);

    if (onSaveField) {
      onSaveField(fieldName);
    }
  };

  if (!activeModal) return null;

  return (
    <>
      {/* MODAL: KEYS MANAGEMENT */}
      {activeModal === 'keys' && (
        <div className="modal-overlay" id="keysModalOverlay">
          <div className="modal-window" style={{ maxWidth: '580px' }}>
            <div className="title-bar">
              <span className="title-bar-text">&#128273; API Keys &amp; Credentials Configuration</span>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  id="btnCloseKeys"
                  className="title-btn"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            <div className="modal-content">
              {/* 1. Gemini API Key */}
              <div className="doc-section">
                <h3>1. Gemini API Key (Google AI Studio)</h3>
                <p>Required for synthesis, long-form post generation, and automated HTML formatting.</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                  <input
                    type="password"
                    id="modalGeminiApiKey"
                    className="input-field"
                    style={{ flex: 1 }}
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => onGeminiKeyChange && onGeminiKeyChange(e.target.value)}
                  />
                  <button
                    type="button"
                    id="btnModalSaveGemini"
                    className="win-btn"
                    onClick={() => handleSave('gemini')}
                  >
                    {savedStatus.gemini ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>

              {/* 2. Google Client ID */}
              <div className="doc-section">
                <h3>2. Google OAuth 2.0 Web Client ID</h3>
                <p>Required for Google Identity Services (GIS) browser authorization to read and write to Blogger.</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                  <input
                    type="text"
                    id="modalGoogleClientId"
                    className="input-field"
                    style={{ flex: 1 }}
                    placeholder="xyz.apps.googleusercontent.com"
                    value={clientId}
                    onChange={(e) => onClientIdChange && onClientIdChange(e.target.value)}
                  />
                  <button
                    type="button"
                    id="btnModalSaveClientId"
                    className="win-btn"
                    onClick={() => handleSave('clientId')}
                  >
                    {savedStatus.clientId ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>

              {/* 3. Blogger Blog ID */}
              <div className="doc-section">
                <h3>3. Blogger Blog ID</h3>
                <p>The numerical Blog ID from your Blogger dashboard URL (or select from authenticated blogs).</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                  {userBlogs && userBlogs.length > 0 ? (
                    <select
                      id="modalBloggerBlogSelect"
                      className="input-field"
                      style={{ flex: 1 }}
                      value={blogId}
                      onChange={(e) => onSelectBlog && onSelectBlog(e.target.value)}
                    >
                      <option value="">Select Blog...</option>
                      {userBlogs.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.id})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="modalBloggerBlogId"
                      className="input-field"
                      style={{ flex: 1 }}
                      placeholder="892837..."
                      value={blogId}
                      onChange={(e) => onBlogIdChange && onBlogIdChange(e.target.value)}
                    />
                  )}
                  <button
                    type="button"
                    id="btnModalSaveBlogId"
                    className="win-btn"
                    onClick={() => handleSave('blogId')}
                  >
                    {savedStatus.blogId ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: '#c0c0c0',
                borderTop: '1px solid #808080',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <button
                type="button"
                className="win-btn"
                onClick={() => {
                  handleSave('gemini');
                  handleSave('clientId');
                  handleSave('blogId');
                  onClose();
                }}
              >
                Save All &amp; Close
              </button>
              <button
                type="button"
                id="btnDismissKeys"
                className="win-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SERP & AI OVERVIEW PREVIEWER */}
      {activeModal === 'serp' && (
        <div className="modal-overlay" id="serpPreviewModal">
          <div className="modal-window">
            <div className="title-bar">
              <span className="title-bar-text">&#128065; Search Engine &amp; AI Overview SERP Previewer</span>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  id="btnCloseSerp"
                  className="title-btn"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            <div className="modal-content">
              <h3 style={{ color: '#000080', marginBottom: '8px' }}>1. Google Search Desktop Result Preview</h3>
              <div className="serp-card">
                <div className="serp-url" id="serpPreviewUrl">
                  https://yourblog.blogspot.com/2026/08/sample-post.html
                </div>
                <div className="serp-title" id="serpPreviewTitle">
                  {lastPlan?.title || 'Comprehensive Architecture Guide - Viblogger for Blogger'}
                </div>
                <div className="serp-desc" id="serpPreviewDesc">
                  {lastPlan?.metaDescription ||
                    'Learn deep distributed systems architecture with state diagrams, performance comparison benchmarks, and implementation guidelines.'}
                </div>
              </div>

              <h3 style={{ color: '#000080', marginTop: '14px', marginBottom: '8px' }}>
                2. Gemini AI Search Overview Preview
              </h3>
              <div className="ai-overview-card">
                <div className="ai-overview-badge">&#10024; AI Overview (Generative Engine Optimization)</div>
                <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: 1.5 }} id="aiOverviewSnippet">
                  {lastPlan
                    ? `${lastPlan.metaDescription} ${lastPlan.title} structured for LLM generative engine retrieval.`
                    : 'This technical article provides an in-depth breakdown of system architectures, highlighting throughput tradeoffs, state transition workflows, and automated schema indexing.'}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: '6px',
                background: 'var(--win-gray)',
                borderTop: '1px solid var(--win-dark-gray)',
                textAlign: 'right'
              }}
            >
              <button
                type="button"
                id="btnDismissSerp"
                className="win-btn"
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: USER GUIDE */}
      {activeModal === 'guide' && (
        <div className="modal-overlay" id="guideModalOverlay">
          <div className="modal-window" style={{ maxWidth: '860px', height: '90%' }}>
            <div className="title-bar">
              <span className="title-bar-text">&#128214; Master Operator Manual &amp; Comprehensive Command Guide (2000+ Words)</span>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  id="btnCloseGuide"
                  className="title-btn"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            <div className="modal-content" style={{ padding: '12px 14px' }}>
              <ComprehensiveGuide
                onUsePrompt={(promptText) => {
                  if (onUsePrompt) {
                    onUsePrompt(promptText);
                    onClose();
                  }
                }}
              />
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: 'var(--win-gray)',
                borderTop: '1px solid var(--win-dark-gray)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '11px', color: '#000080' }}>
                💡 Click &apos;🚀 Transmit to Agent&apos; on any prompt blueprint to load directly into terminal.
              </span>
              <button
                type="button"
                id="btnDismissGuide"
                className="win-btn"
                onClick={onClose}
              >
                Close Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FAQ */}
      {activeModal === 'faq' && (
        <div className="modal-overlay" id="faqModalOverlay">
          <div className="modal-window">
            <div className="title-bar">
              <span className="title-bar-text">&#10067; Frequently Asked Questions</span>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  id="btnCloseFaq"
                  className="title-btn"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            <div className="modal-content">
              <div className="doc-section">
                <h3>Q: How does the Google Logon (GIS) authentication work?</h3>
                <p>
                  Viblogger uses Google Identity Services (GIS) OAuth 2.0 token client directly in your browser. No secrets or tokens are stored on any backend server. Your browser communicates directly with <code>blogger.googleapis.com</code>.
                </p>
              </div>

              <div className="doc-section">
                <h3>Q: What is Operator Approval Mode?</h3>
                <p>
                  Before any mutation (creating, updating, or deleting a post or page) is executed against the Blogger API, Viblogger stages the action in a yellow confirmation box. You have complete control to approve or cancel the change.
                </p>
              </div>

              <div className="doc-section">
                <h3>Q: Where are my Gemini API key and credentials stored?</h3>
                <p>
                  Credentials are saved in your local browser storage (<code>localStorage</code>) on your own device and are never shared or sent to any external server.
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '6px',
                background: 'var(--win-gray)',
                borderTop: '1px solid var(--win-dark-gray)',
                textAlign: 'right'
              }}
            >
              <button
                type="button"
                id="btnDismissFaq"
                className="win-btn"
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXAMPLES */}
      {activeModal === 'examples' && (
        <div className="modal-overlay" id="examplesModalOverlay">
          <div className="modal-window" style={{ maxWidth: '780px', maxHeight: '88%' }}>
            <div className="title-bar">
              <span className="title-bar-text">&#128196; Full Integration Prompt Blueprints &amp; Production Templates</span>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  id="btnCloseExamples"
                  className="title-btn"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            <div className="modal-content">
              <p style={{ marginBottom: '10px', fontSize: '11.5px', color: '#000080' }}>
                Select any verified prompt template below to launch automated synthesis in the terminal:
              </p>

              <div className="example-card">
                <h4>
                  <span>1. HNSW vs IVF-PQ Vector Databases Teardown</span>
                  <span className="example-badge">Mermaid + KaTeX + TechArticle</span>
                </h4>
                <p>
                  Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include an interactive Table of Contents, a Mermaid flowchart illustrating multi-layer graph traversals, KaTeX formulas for Euclidean distance and Cosine similarity, a responsive HTML comparison table of throughput/latency benchmarks, Python FAISS code snippets, and complete JSON-LD TechArticle structured data. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="win-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include an interactive Table of Contents, a Mermaid flowchart illustrating multi-layer graph traversals, KaTeX formulas for Euclidean distance and Cosine similarity, a responsive HTML comparison table of throughput/latency benchmarks, Python FAISS code snippets, and complete JSON-LD TechArticle structured data. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.`
                      );
                      soundEngine.beep(1000, 40);
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    type="button"
                    className="win-btn"
                    style={{ fontWeight: 'bold', color: '#000080' }}
                    onClick={() => {
                      if (onUsePrompt) {
                        onUsePrompt(
                          `Synthesize an exhaustive, 2500-word technical engineering guide comparing HNSW (Hierarchical Navigable Small World) graphs against IVF-PQ (Inverted File with Product Quantization) vector indexing algorithms for LLM RAG pipelines. Include an interactive Table of Contents, a Mermaid flowchart illustrating multi-layer graph traversals, KaTeX formulas for Euclidean distance and Cosine similarity, a responsive HTML comparison table of throughput/latency benchmarks, Python FAISS code snippets, and complete JSON-LD TechArticle structured data. Labels: Vector Database, Machine Learning, RAG, Architecture, Python.`
                        );
                        onClose();
                      }
                    }}
                  >
                    🚀 Transmit to Agent
                  </button>
                </div>
              </div>

              <div className="example-card">
                <h4>
                  <span>2. Top 5 Cloud VPS Providers Buyer&apos;s Guide</span>
                  <span className="example-badge">Affiliate Cards + Rating Badges + TOC</span>
                </h4>
                <p>
                  Write a comprehensive, high-converting buyer&apos;s guide and review titled &apos;Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown&apos;. Include an upfront Executive Summary box, individual review sections with stylized affiliate comparison cards (star ratings, pros/cons, CTA buttons), a Geekbench/pricing comparison table, and an FAQ section with embedded FAQPage JSON-LD schema. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="win-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Write a comprehensive, high-converting buyer's guide and review titled 'Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown'. Include an upfront Executive Summary box, individual review sections with stylized affiliate comparison cards (star ratings, pros/cons, CTA buttons), a Geekbench/pricing comparison table, and an FAQ section with embedded FAQPage JSON-LD schema. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.`
                      );
                      soundEngine.beep(1000, 40);
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    type="button"
                    className="win-btn"
                    style={{ fontWeight: 'bold', color: '#000080' }}
                    onClick={() => {
                      if (onUsePrompt) {
                        onUsePrompt(
                          `Write a comprehensive, high-converting buyer's guide and review titled 'Top 5 Cloud VPS Providers for Developers in 2026: Benchmark Teardown'. Include an upfront Executive Summary box, individual review sections with stylized affiliate comparison cards (star ratings, pros/cons, CTA buttons), a Geekbench/pricing comparison table, and an FAQ section with embedded FAQPage JSON-LD schema. Labels: Cloud Hosting, VPS, DevOps, Server Benchmarks, Web Development.`
                        );
                        onClose();
                      }
                    }}
                  >
                    🚀 Transmit to Agent
                  </button>
                </div>
              </div>

              <div className="example-card">
                <h4>
                  <span>3. Privacy Policy &amp; GDPR Static Page</span>
                  <span className="example-badge">PAGE_CREATE + Legal Compliance</span>
                </h4>
                <p>
                  Create a permanent static page for our technical blog titled &apos;Privacy Policy, Cookie Notice &amp; Data Rights (GDPR / CCPA Compliance)&apos;. Include clear sections detailing data storage, a third-party service disclosure table (GA4, AdSense, Cloudflare, Affiliates), GDPR/CCPA user data rights, and clean HTML table formatting.
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="win-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Create a permanent static page for our technical blog titled 'Privacy Policy, Cookie Notice & Data Rights (GDPR / CCPA Compliance)'. Include clear sections detailing data storage, a third-party service disclosure table (GA4, AdSense, Cloudflare, Affiliates), GDPR/CCPA user data rights, and clean HTML table formatting.`
                      );
                      soundEngine.beep(1000, 40);
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    type="button"
                    className="win-btn"
                    style={{ fontWeight: 'bold', color: '#000080' }}
                    onClick={() => {
                      if (onUsePrompt) {
                        onUsePrompt(
                          `Create a permanent static page for our technical blog titled 'Privacy Policy, Cookie Notice & Data Rights (GDPR / CCPA Compliance)'. Include clear sections detailing data storage, a third-party service disclosure table (GA4, AdSense, Cloudflare, Affiliates), GDPR/CCPA user data rights, and clean HTML table formatting.`
                        );
                        onClose();
                      }
                    }}
                  >
                    🚀 Transmit to Agent
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: 'var(--win-gray)',
                borderTop: '1px solid var(--win-dark-gray)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '11px', color: '#000080' }}>
                📖 For all 15+ prompt blueprints and chapters, open the <strong>[Help] &rarr; [Operator Manual &amp; Guide]</strong> dialog.
              </span>
              <button
                type="button"
                id="btnDismissExamples"
                className="win-btn"
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
