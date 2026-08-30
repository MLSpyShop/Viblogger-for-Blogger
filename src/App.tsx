import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { ConfigStrip } from './components/ConfigStrip';
import { TerminalOutput } from './components/TerminalOutput';
import { CommandBar } from './components/CommandBar';
import { StatusBar } from './components/StatusBar';
import { Modals } from './components/Modals';
import { soundEngine } from './services/sound';
import { BloggerAPI } from './services/bloggerApi';
import { GeminiService } from './services/geminiService';
import { RenderingEngine } from './services/renderingEngine';
import { BlogItem, MessageLine, StagedAction, GeminiPlanPayload } from './types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: {
              access_token?: string;
              expires_in?: string;
              error?: string;
            }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export default function App() {
  const [geminiKey, setGeminiKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [blogId, setBlogId] = useState('');
  const [userBlogs, setUserBlogs] = useState<BlogItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeModal, setActiveModal] = useState<'keys' | 'serp' | 'guide' | 'faq' | 'examples' | null>(null);
  const [footerStatus, setFooterStatus] = useState('Ready. Awaiting operator input...');
  const [messages, setMessages] = useState<MessageLine[]>([]);
  const [stagedAction, setStagedAction] = useState<StagedAction | null>(null);
  const [lastPlan, setLastPlan] = useState<GeminiPlanPayload | null>(null);

  const addMessage = useCallback((text: string, type: 'user' | 'bot' | 'system' | 'error' | 'streaming' = 'bot', html?: string) => {
    const newMsg: MessageLine = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
      html,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, newMsg]);
    soundEngine.beep(type === 'error' ? 220 : 750, 25);
  }, []);

  const createStreamingMessage = useCallback((initialPrefix = '>>> [STREAMING ANSWER] ') => {
    const streamId = Math.random().toString(36).substring(2, 9);
    const streamMsg: MessageLine = {
      id: streamId,
      type: 'streaming',
      text: initialPrefix,
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, streamMsg]);
    return streamId;
  }, []);

  const updateStreamingMessage = useCallback((streamId: string, updatedText: string, isDone = false) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === streamId) {
          return {
            ...msg,
            text: updatedText,
            isStreaming: !isDone
          };
        }
        return msg;
      })
    );
  }, []);

  const hasInitializedRef = useRef(false);

  // Load credentials on mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    try {
      const envKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || '';
      const savedKey = localStorage.getItem('viblogger_gemini_key') || envKey;
      const savedClientId = localStorage.getItem('viblogger_client_id') || '';
      const savedBlogId = localStorage.getItem('viblogger_blog_id') || '';

      if (savedKey) setGeminiKey(savedKey);
      if (savedClientId) setClientId(savedClientId);
      if (savedBlogId) setBlogId(savedBlogId);

      addMessage('Agent: Ready for your command. Configure [Keys] or click [Logon with Google]. You can prompt for ANY creation, modification, GSC analytics check, or RSS analysis below.', 'bot');
    } catch {
      // LocalStorage access safe
    }
  }, [addMessage]);

  const saveCredentials = (k: string, c: string, b: string) => {
    try {
      if (k) localStorage.setItem('viblogger_gemini_key', k);
      if (c) localStorage.setItem('viblogger_client_id', c);
      if (b) localStorage.setItem('viblogger_blog_id', b);
    } catch {
      // Safe catch
    }
  };

  const handleClearCredentials = () => {
    try {
      localStorage.removeItem('viblogger_gemini_key');
      localStorage.removeItem('viblogger_client_id');
      localStorage.removeItem('viblogger_blog_id');
      setGeminiKey('');
      setClientId('');
      setBlogId('');
      setUserBlogs([]);
      setAccessToken(null);
      setIsOnline(false);
      addMessage('Agent: Local credential storage cleared.', 'system');
    } catch {
      // Safe catch
    }
  };

  const handleClearTerminal = () => {
    setMessages([{
      id: 'clear-notice',
      type: 'system',
      text: '*** SCREEN BUFFER CLEARED ***',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleToggleSound = () => {
    const isMuted = soundEngine.toggleMute();
    setSoundMuted(isMuted);
  };

  const handleOpenBloggerTab = () => {
    const cleanId = blogId.trim();
    const url = cleanId ? `https://www.blogger.com/blog/posts/${cleanId}` : 'https://www.blogger.com';
    window.open(url, '_blank');
  };

  // Google Identity Services (GIS) OAuth Token Client
  const handleAuthGIS = async () => {
    const cleanClientId = clientId.trim();
    const cleanApiKey = geminiKey.trim();
    const cleanBlogId = blogId.trim();

    saveCredentials(cleanApiKey, cleanClientId, cleanBlogId);

    if (!cleanClientId) {
      addMessage('ERROR: Please enter your Google OAuth 2.0 Web Client ID in the toolbar.', 'error');
      return;
    }

    addMessage('>>> INITIATING GIS OAUTH 2.0 TOKEN HANDSHAKE...', 'system');
    soundEngine.connectionChime();

    try {
      if (!window.google?.accounts?.oauth2) {
        addMessage('GIS SDK is loading. Please wait 2 seconds and click [Logon with Google] again.', 'error');
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: cleanClientId,
        scope: 'https://www.googleapis.com/auth/blogger https://www.googleapis.com/auth/webmasters.readonly',
        callback: async (tokenResponse) => {
          if (tokenResponse.error || !tokenResponse.access_token) {
            addMessage(`AUTH FAILED: ${tokenResponse.error || 'Token acquisition rejected'}`, 'error');
            return;
          }

          const token = tokenResponse.access_token;
          setAccessToken(token);
          setIsOnline(true);
          addMessage('>>> AUTHENTICATION SUCCESSFUL. BEARER TOKEN ACQUIRED.', 'system');
          setFooterStatus('GIS OAuth Connected. Discovering user blogs...');

          // Discover user blogs
          try {
            const blogs = await BloggerAPI.discoverBlogs(token);
            if (blogs.length > 0) {
              setUserBlogs(blogs);
              if (!cleanBlogId || !blogs.some((b) => b.id === cleanBlogId)) {
                setBlogId(blogs[0].id);
                saveCredentials(cleanApiKey, cleanClientId, blogs[0].id);
              }
              addMessage(`Agent: Auto-discovered <strong>${blogs.length}</strong> blog(s) from your account:`, 'system');
              blogs.forEach((b, idx) => {
                addMessage(`  [${idx + 1}] <strong>${b.name}</strong> (Posts: ${b.posts?.totalItems || 0}, Pages: ${b.pages?.totalItems || 0})`, 'bot');
              });
              setFooterStatus(`Active Blog: ${blogs[0].name}`);
            } else {
              addMessage('Agent: No blogs found under this Google account.', 'system');
            }
          } catch (blogErr: unknown) {
            const msg = blogErr instanceof Error ? blogErr.message : String(blogErr);
            addMessage(`Blog Discovery Error: ${msg}`, 'error');
          }
        }
      });

      client.requestAccessToken({ prompt: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addMessage(`GIS INIT ERROR: ${msg}`, 'error');
    }
  };

  // Quick action runner
  const handleQuickAction = async (actionType: string) => {
    const cleanBlogId = blogId.trim();
    if (!accessToken) {
      addMessage('Agent: Please click [Auth GIS] to authenticate first.', 'error');
      return;
    }
    if (!cleanBlogId && actionType !== 'GSC_QUERY') {
      addMessage('Agent: Please specify or select a Blog ID in the toolbar.', 'error');
      return;
    }

    soundEngine.beep(750, 40);
    setFooterStatus(`Executing ${actionType}...`);
    setIsBusy(true);

    try {
      if (actionType === 'LIST_POSTS') {
        addMessage('>>> QUERYING BLOGGER API: GET /blogs/{blogId}/posts ...', 'system');
        const posts = await BloggerAPI.listPosts(cleanBlogId, accessToken);
        if (posts.length === 0) {
          addMessage('Agent: No posts found for this blog.', 'bot');
        } else {
          let tableHtml = `<table class="term-table"><thead><tr><th>Status</th><th>Title</th><th>Post ID</th></tr></thead><tbody>`;
          posts.forEach((p) => {
            tableHtml += `<tr><td>${p.status}</td><td><a href="${p.url}" target="_blank" rel="noreferrer">${p.title}</a></td><td>${p.id}</td></tr>`;
          });
          tableHtml += `</tbody></table>`;
          addMessage('', 'bot', `Agent: Found <strong>${posts.length}</strong> post(s):<br/>${tableHtml}`);
        }
      } else if (actionType === 'LIST_PAGES') {
        addMessage('>>> QUERYING BLOGGER API: GET /blogs/{blogId}/pages ...', 'system');
        const pages = await BloggerAPI.listPages(cleanBlogId, accessToken);
        if (pages.length === 0) {
          addMessage('Agent: No static pages found for this blog.', 'bot');
        } else {
          let tableHtml = `<table class="term-table"><thead><tr><th>Status</th><th>Title</th><th>Page ID</th></tr></thead><tbody>`;
          pages.forEach((p) => {
            tableHtml += `<tr><td>${p.status}</td><td><a href="${p.url}" target="_blank" rel="noreferrer">${p.title}</a></td><td>${p.id}</td></tr>`;
          });
          tableHtml += `</tbody></table>`;
          addMessage('', 'bot', `Agent: Found <strong>${pages.length}</strong> static page(s):<br/>${tableHtml}`);
        }
      } else if (actionType === 'LIST_COMMENTS') {
        addMessage('>>> QUERYING BLOGGER API: GET /blogs/{blogId}/comments ...', 'system');
        const comments = await BloggerAPI.listBlogComments(cleanBlogId, accessToken);
        if (comments.length === 0) {
          addMessage('Agent: No comments found.', 'bot');
        } else {
          let tableHtml = `<table class="term-table"><thead><tr><th>Author</th><th>Content</th><th>Post ID</th></tr></thead><tbody>`;
          comments.forEach((c) => {
            tableHtml += `<tr><td>${c.author?.displayName || 'Anon'}</td><td>${c.content}</td><td>${c.post?.id || 'N/A'}</td></tr>`;
          });
          tableHtml += `</tbody></table>`;
          addMessage('', 'bot', `Agent: Found <strong>${comments.length}</strong> comment(s):<br/>${tableHtml}`);
        }
      } else if (actionType === 'GSC_QUERY') {
        const blog = await BloggerAPI.getBlog(cleanBlogId, accessToken);
        if (!blog.url) {
          throw new Error('Blog URL not found on active blog.');
        }
        addMessage(`>>> QUERYING GOOGLE SEARCH CONSOLE FOR: ${blog.url} ...`, 'system');
        const gscRows = await BloggerAPI.querySearchConsole(blog.url, accessToken);
        if (gscRows.length === 0) {
          addMessage('Agent: No Search Console telemetry recorded for this domain in the past 28 days.', 'bot');
        } else {
          let tableHtml = `<table class="term-table"><thead><tr><th>Search Query</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Avg Rank</th></tr></thead><tbody>`;
          gscRows.forEach((r) => {
            tableHtml += `<tr><td><strong>${r.keys[0]}</strong></td><td>${r.clicks}</td><td>${r.impressions}</td><td>${(r.ctr * 100).toFixed(1)}%</td><td>${r.position.toFixed(1)}</td></tr>`;
          });
          tableHtml += `</tbody></table>`;
          addMessage('', 'bot', `Agent: Top Search Performance (Last 28 Days):<br/>${tableHtml}`);
        }
      } else if (actionType === 'EXPORT_BACKUP') {
        addMessage('>>> GENERATING FULL BACKUP ARCHIVE (.JSON) ...', 'system');
        const posts = await BloggerAPI.listPosts(cleanBlogId, accessToken);
        const pages = await BloggerAPI.listPages(cleanBlogId, accessToken);
        const backupData = {
          blogId: cleanBlogId,
          exportedAt: new Date().toISOString(),
          posts,
          pages
        };
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `viblogger-backup-${cleanBlogId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addMessage('Agent: Full backup .JSON generated and downloaded to your computer.', 'bot');
      }
      setFooterStatus('Action complete.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addMessage(`Agent: [ERROR] ${msg}`, 'error');
      setFooterStatus('Operation failed.');
    } finally {
      setIsBusy(false);
    }
  };

  // Master Prompt Execution Pipeline
  const handleTransmit = async (prompt: string) => {
    if (isBusy) return;

    const cleanApiKey = geminiKey.trim();
    const cleanClientId = clientId.trim();
    const cleanBlogId = blogId.trim();

    saveCredentials(cleanApiKey, cleanClientId, cleanBlogId);
    addMessage(`Operator: ${prompt}`, 'user');

    if (!cleanApiKey || !accessToken || !cleanBlogId) {
      addMessage('Agent: [ERROR] Please verify Gemini Key, Google GIS Auth, and Blog ID.', 'error');
      return;
    }

    setIsBusy(true);
    setFooterStatus('SYNTHESIZING & ROUTING...');

    try {
      // Step A: Competitor RSS Feed Ingestion Bridge if present
      let contextInfo = '';
      if (prompt.toLowerCase().includes('rss') && prompt.includes('http')) {
        const feedUrlMatch = prompt.match(/https?:\/\/[^\s]+/);
        if (feedUrlMatch) {
          addMessage(`Agent: Ingesting competitor RSS feed: ${feedUrlMatch[0]} ...`, 'system');
          const headlines = await BloggerAPI.fetchRssFeed(feedUrlMatch[0]);
          if (headlines) {
            contextInfo = `Competitor Recent Articles:\n${headlines}`;
            addMessage(`Agent: Ingested competitor articles from feed.`, 'system');
          }
        }
      }

      // Step 1: Gemini Universal Router & Synthesis (Live Streamed)
      addMessage('Agent: [1/5] Synthesizing payload via Gemini Flash (Live Streaming)...', 'system');
      const streamMsgId = createStreamingMessage('>>> [GEMINI LIVE STREAM] Connecting to model...');
      let lastAudioTick = 0;

      const plan = await GeminiService.routeAndSynthesize(
        cleanApiKey,
        prompt,
        contextInfo,
        (_chunk, accumulated) => {
          const now = Date.now();
          if (now - lastAudioTick > 80) {
            soundEngine.typewriterTick();
            lastAudioTick = now;
          }

          let display = accumulated;
          const titleMatch = accumulated.match(/"title"\s*:\s*"([^"]+)/);
          const htmlMatch = accumulated.match(/"htmlContent"\s*:\s*"((?:[^"\\]|\\.)*)/);
          if (titleMatch || htmlMatch) {
            const titleStr = titleMatch ? titleMatch[1] : 'Synthesizing...';
            let htmlSnippet = htmlMatch
              ? htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/<[^>]+>/g, ' ')
              : '';
            if (htmlSnippet.length > 320) {
              htmlSnippet = '...' + htmlSnippet.slice(-320);
            }
            display = `ACTION TARGET: ${titleStr}\nLIVE DRAFT PREVIEW:\n${htmlSnippet}`;
          } else {
            if (display.length > 320) {
              display = '...' + display.slice(-320);
            }
          }

          updateStreamingMessage(streamMsgId, `>>> [GEMINI LIVE STREAM]\n${display}`, false);
        }
      );

      updateStreamingMessage(
        streamMsgId,
        `>>> [GEMINI LIVE STREAM COMPLETE] Action: ${plan.apiAction} | Title: "${plan.title}" | Labels: [${plan.labels.join(', ')}]`,
        true
      );
      setLastPlan(plan);

      // Check if plan is an API query action
      if (['POST_LIST', 'POST_SEARCH'].includes(plan.apiAction)) {
        await handleQuickAction('LIST_POSTS');
        setFooterStatus('Ready. Awaiting next command.');
        return;
      } else if (['PAGE_LIST'].includes(plan.apiAction)) {
        await handleQuickAction('LIST_PAGES');
        setFooterStatus('Ready. Awaiting next command.');
        return;
      } else if (['COMMENTS_LIST'].includes(plan.apiAction)) {
        await handleQuickAction('LIST_COMMENTS');
        setFooterStatus('Ready. Awaiting next command.');
        return;
      } else if (['GSC_QUERY', 'BLOG_STATS'].includes(plan.apiAction)) {
        await handleQuickAction('GSC_QUERY');
        setFooterStatus('Ready. Awaiting next command.');
        return;
      } else if (plan.apiAction === 'EXPORT_BACKUP') {
        await handleQuickAction('EXPORT_BACKUP');
        setFooterStatus('Ready. Awaiting next command.');
        return;
      }

      // Step 2: Media Resolution (Wikimedia Commons / Openverse)
      let mediaHtml = '';
      if (plan.mediaQuery) {
        addMessage(`Agent: [2/5] Resolving licensed media for "${plan.mediaQuery}"...`, 'system');
        mediaHtml = (await BloggerAPI.fetchMediaAsset(plan.mediaQuery)) || '';
      }

      // Step 3: Mermaid Vector Diagram Compilation
      let mermaidSvg = '';
      if (plan.mermaidDiagramCode) {
        addMessage('Agent: [3/5] Compiling Mermaid.js vector diagram...', 'system');
        mermaidSvg = await RenderingEngine.renderMermaidDiagram(plan.mermaidDiagramCode);
      }

      // Step 4: KaTeX Formulas, Affiliate Cards, and Dynamic Table of Contents
      addMessage('Agent: [4/5] Formatting KaTeX formulas, Affiliate Cards & Table of Contents...', 'system');
      let articleBody = plan.htmlContent;
      if (plan.affiliateComparisonHtml) {
        articleBody += `\n${plan.affiliateComparisonHtml}`;
      }
      if (mermaidSvg) {
        articleBody += `\n${mermaidSvg}`;
      }
      articleBody = RenderingEngine.renderKaTeXFormulas(articleBody);
      articleBody = RenderingEngine.injectTableOfContents(articleBody);

      const compiledHtml = `
<!-- [VIBLOGGER_CORE_START] -->
<script type="application/ld+json">
${plan.jsonLdSchema}
<\/script>
<div class="viblogger-root" style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; color: #1e293b;">
  ${mediaHtml}
  <article class="viblogger-content">
    ${articleBody}
  </article>
  <hr style="margin: 2rem 0; border: 0; border-top: 1px solid #e2e8f0;" />
  <footer style="font-size: 12px; color: #64748b;">
    Published autonomously via <strong>Viblogger for Blogger</strong>.
  </footer>
</div>
<!-- [VIBLOGGER_CORE_END] -->`;

      const audit = RenderingEngine.executeAudit(compiledHtml);

      // Step 5: Route to Mutation Approval Gate or Direct Creation
      const targetId = plan.targetResourceId || prompt.match(/\b\d{10,22}\b/)?.[0] || '';
      const isMutation = ['POST_UPDATE', 'POST_DELETE', 'PAGE_UPDATE', 'PAGE_DELETE'].includes(plan.apiAction);

      if (isMutation && targetId) {
        setStagedAction({
          action: plan.apiAction,
          blogId: cleanBlogId,
          token: accessToken,
          resourceId: targetId,
          payload: {
            title: plan.title,
            compiledHtml,
            labels: plan.labels,
            metaDescription: plan.metaDescription
          }
        });
        soundEngine.beep(800, 100);
        addMessage(`Operator approval requested for mutation: ${plan.apiAction} on Resource #${targetId}`, 'system');
      } else if (plan.apiAction === 'POST_CREATE') {
        const dispatchMode = isDraftMode ? 'DRAFT' : 'LIVE';
        addMessage(`Agent: [5/5] Transmitting new post as [${dispatchMode}] to Blogger API v3...`, 'system');

        const postResult = await BloggerAPI.createPost(
          cleanBlogId,
          accessToken,
          {
            title: plan.title,
            compiledHtml,
            labels: plan.labels,
            metaDescription: plan.metaDescription
          },
          isDraftMode
        );

        soundEngine.connectionChime();

        // Auto-ping IndexNow if published Live
        if (!isDraftMode && postResult.url) {
          try {
            const host = new URL(postResult.url).hostname;
            await BloggerAPI.pingIndexNow(postResult.url, host);
            addMessage('Agent: [IndexNow] Pinged indexnow.org for immediate search engine indexing.', 'system');
          } catch {
            // IndexNow ignore
          }
        }

        const receiptHtml = `
<div class="work-receipt">
  <strong>*** POST CREATED: DISPATCHED TO BLOGGER (${dispatchMode}) ***</strong><br/>
  &bull; <strong>Title:</strong> ${postResult.title}<br/>
  &bull; <strong>Post ID:</strong> ${postResult.id}<br/>
  &bull; <strong>Labels:</strong> ${plan.labels.join(', ')}<br/>
  &bull; <strong>Words:</strong> ${audit.wordCount} | <strong>Audit Score:</strong> ${audit.confidence}<br/>
  &bull; <strong>Live URL:</strong> ${
    postResult.url
      ? `<a href="${postResult.url}" target="_blank" rel="noreferrer">${postResult.url}</a>`
      : 'Saved as Draft'
  }<br/>
  &bull; <strong>Blogger Editor:</strong> <a href="https://www.blogger.com/blog/post/edit/${cleanBlogId}/${postResult.id}" target="_blank" rel="noreferrer">Open Editor &#8599;</a>
</div>
Agent: Creation complete. Click <strong>[SERP Preview]</strong> in the menu to inspect search snippets.`;

        addMessage('', 'bot', receiptHtml);
      } else if (plan.apiAction === 'PAGE_CREATE') {
        const dispatchMode = isDraftMode ? 'DRAFT' : 'LIVE';
        addMessage(`Agent: [5/5] Transmitting new static page as [${dispatchMode}] to Blogger API v3...`, 'system');
        const pageResult = await BloggerAPI.createPage(
          cleanBlogId,
          accessToken,
          {
            title: plan.title,
            compiledHtml
          },
          isDraftMode
        );
        soundEngine.connectionChime();
        const receiptHtml = `
<div class="work-receipt">
  <strong>*** STATIC PAGE CREATED: DISPATCHED TO BLOGGER (${dispatchMode}) ***</strong><br/>
  &bull; <strong>Title:</strong> ${pageResult.title}<br/>
  &bull; <strong>Page ID:</strong> ${pageResult.id}<br/>
  &bull; <strong>Live URL:</strong> ${
    pageResult.url
      ? `<a href="${pageResult.url}" target="_blank" rel="noreferrer">${pageResult.url}</a>`
      : 'Saved as Draft'
  }
</div>`;
        addMessage('', 'bot', receiptHtml);
      }

      setFooterStatus('Ready. Awaiting next command.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addMessage(`Agent: [EXECUTION ERROR] ${msg}`, 'error');
      setFooterStatus('Execution failed.');
    } finally {
      setIsBusy(false);
    }
  };

  // Staged Action Approval Handlers
  const handleApproveStagedAction = async () => {
    if (!stagedAction) return;
    const { action, blogId: stagedBlogId, token, resourceId, payload } = stagedAction;

    soundEngine.beep(950, 60);
    addMessage(`Agent: Executing approved [${action}] on Blogger API v3...`, 'system');
    setFooterStatus(`EXECUTING ${action}...`);
    setIsBusy(true);

    try {
      if (action === 'POST_UPDATE') {
        const res = await BloggerAPI.updatePost(stagedBlogId, token, resourceId, payload);
        addMessage(
          '',
          'bot',
          `Agent: [SUCCESS] Post ID ${resourceId} updated: <a href="${res.url}" target="_blank" rel="noreferrer">${res.title}</a>`
        );
      } else if (action === 'POST_DELETE') {
        await BloggerAPI.deletePost(stagedBlogId, token, resourceId);
        addMessage(`Agent: [SUCCESS] Post ID ${resourceId} permanently deleted.`, 'system');
      } else if (action === 'PAGE_UPDATE') {
        const res = await BloggerAPI.updatePage(stagedBlogId, token, resourceId, {
          title: payload.title,
          compiledHtml: payload.compiledHtml
        });
        addMessage(
          '',
          'bot',
          `Agent: [SUCCESS] Page ID ${resourceId} updated: <a href="${res.url}" target="_blank" rel="noreferrer">${res.title}</a>`
        );
      } else if (action === 'PAGE_DELETE') {
        await BloggerAPI.deletePage(stagedBlogId, token, resourceId);
        addMessage(`Agent: [SUCCESS] Page ID ${resourceId} permanently deleted.`, 'system');
      }

      soundEngine.connectionChime();
      setFooterStatus(`Action ${action} completed.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addMessage(`Agent: [ACTION FAILED] ${msg}`, 'error');
      setFooterStatus('Operation aborted on error.');
    } finally {
      setStagedAction(null);
      setIsBusy(false);
    }
  };

  const handleRejectStagedAction = () => {
    soundEngine.beep(300, 80);
    addMessage('Agent: Mutation cancelled by operator. No changes made.', 'system');
    setStagedAction(null);
    setFooterStatus('Action cancelled.');
  };

  return (
    <div id="retroAppWindow" className="retro-window">
      <TitleBar
        onMinimize={() => addMessage('Window minimized to retro taskbar.', 'system')}
        onMaximize={() => addMessage('Workstation layout maximized.', 'system')}
        onClose={() => addMessage('Session active.', 'system')}
      />

      <MenuBar
        onQuickAction={handleQuickAction}
        onOpenModal={(modalName) => {
          soundEngine.beep(850, 40);
          setActiveModal(modalName);
        }}
        onOpenBlogger={handleOpenBloggerTab}
        onClearTerminal={handleClearTerminal}
        onResetCredentials={handleClearCredentials}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      <ConfigStrip
        onOpenKeysModal={() => setActiveModal('keys')}
        geminiKey={geminiKey}
        clientId={clientId}
        blogId={blogId}
        userBlogs={userBlogs}
        onAuthGIS={handleAuthGIS}
        isDraftMode={isDraftMode}
        onToggleDraftMode={setIsDraftMode}
        isOnline={isOnline}
      />

      <TerminalOutput
        messages={messages}
        stagedAction={stagedAction}
        onApproveAction={handleApproveStagedAction}
        onRejectAction={handleRejectStagedAction}
      />

      <CommandBar onTransmit={handleTransmit} isBusy={isBusy} />

      <StatusBar statusText={footerStatus} />

      <Modals
        activeModal={activeModal}
        onClose={() => {
          soundEngine.beep(450, 40);
          setActiveModal(null);
        }}
        lastPlan={lastPlan}
        geminiKey={geminiKey}
        onGeminiKeyChange={setGeminiKey}
        clientId={clientId}
        onClientIdChange={setClientId}
        blogId={blogId}
        onBlogIdChange={setBlogId}
        userBlogs={userBlogs}
        onSelectBlog={(selectedId) => {
          setBlogId(selectedId);
          const sel = userBlogs.find((b) => b.id === selectedId);
          if (sel) {
            addMessage(`Agent: Selected active blog: <strong>${sel.name}</strong>`, 'system');
          }
        }}
        onSaveField={(field) => {
          const names = {
            gemini: 'Gemini API Key',
            clientId: 'Google Client ID',
            blogId: 'Blogger Blog ID'
          };
          setFooterStatus(`Saved ${names[field]} to local storage.`);
          addMessage(`Agent: Saved ${names[field]} to local configuration.`, 'system');
        }}
        onUsePrompt={(promptText) => {
          addMessage(`Operator (via Guide): ${promptText}`, 'user');
          handleTransmit(promptText);
        }}
      />
    </div>
  );
}
