import React, { useEffect, useRef } from 'react';
import { MessageLine, StagedAction } from '../types';

interface TerminalOutputProps {
  messages: MessageLine[];
  stagedAction: StagedAction | null;
  onApproveAction: () => void;
  onRejectAction: () => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  messages,
  stagedAction,
  onApproveAction,
  onRejectAction
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, stagedAction]);

  return (
    <div id="terminalOutput" className="chat-container" ref={containerRef}>
      {/* Authentic VIBLOGGER ASCII Banner in Amber/Gold */}
      <div className="ascii-banner">
{` __      __ _____ ____  _        ____   ____  ____  ______ _____  
 \\ \\    / /|_   _|  _ \\| |      / __ \\ / ___|/ ___||  ____|  _ \\ 
  \\ \\  / /   | | | |_) | |     | |  | | |  _| |  _| | |__  | |_) |
   \\ \\/ /    | | |  _ <| |     | |  | | |_| | |_| |  __| |  _ <  
    \\  /    _| |_| |_) | |____ | |__| |\\____|\\____| |____| | \\ \\ 
     \\/    |_____|____/|______| \\____/             |______|_| \\_\\
==================================================================
 VIBLOGGER FOR BLOGGER - AUTONOMOUS CONTENT SYNTHESIS & DISPATCH`}
      </div>

      <div className="msg-line system">
        *** VIBLOGGER FOR BLOGGER INITIALIZED [ZERO-SERVER CLIENT ARCHITECTURE] ***
      </div>

      {/* PROMPT CAPABILITIES MANIFEST BOX (Green Border, Yellow Header, Cyan Bullets) */}
      <div className="prompt-manifest-box">
        <h4>&gt;&gt;&gt; YOU CAN PROMPT THIS AGENT FOR:</h4>
        
        <div className="manifest-item">
          <strong>&bull; 1. NEW POSTS &amp; IN-DEPTH ARTICLES</strong>
          <span>Long-form technical teardowns, essays, step-by-step coding guides, architecture comparisons.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 2. STATIC PAGES &amp; LANDING PAGES</strong>
          <span>Programmatic About Us, Terms of Service, Privacy Policies, Resource Hubs, Pillar Docs.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 3. LAYOUT &amp; TEMPLATE ENHANCEMENTS</strong>
          <span>Headless CSS styling, theme structural adjustments, callout wrappers, clean layout resets.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 4. TAGS &amp; TAXONOMY CLUSTERING</strong>
          <span>Automated label extraction, keyword categorization, inverted index tag mapping for Blogger.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 5. REVIEW ANALYSIS OF ANYTHING</strong>
          <span>Exhaustive product reviews, SaaS breakdowns, hardware specs, framework benchmarks, tool audits.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 6. SEO &amp; GENERATIVE ENGINE (GEO) OPTIMIZATION</strong>
          <span>JSON-LD schemas (BlogPosting, FAQPage), definition fragments (&lt;dfn&gt;), rich snippet anchors.</span>
        </div>

        <div className="manifest-item">
          <strong>&bull; 7. CONTENT ADDITIONS &amp; EXPANSIONS</strong>
          <span>Section expansions, adding FAQs, header updates, and programmatic blog series.</span>
        </div>
      </div>

      {/* Dynamic Log Lines */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`msg-line ${msg.type} ${msg.isStreaming ? 'is-streaming' : ''}`}
        >
          {msg.html ? (
            <div dangerouslySetInnerHTML={{ __html: msg.html }} />
          ) : (
            <span className="msg-content-text">
              {msg.text}
              {msg.isStreaming && (
                <span className="pacman-stream-runner" aria-label="Pac-Man running away from tokens">
                  <span className="pacman-sprite">
                    <span className="pacman-body-top"></span>
                    <span className="pacman-body-bottom"></span>
                    <span className="pacman-eye"></span>
                  </span>
                  <span className="pacman-pellets">
                    <span className="pellet"></span>
                    <span className="pellet"></span>
                    <span className="pellet"></span>
                    <span className="pellet"></span>
                  </span>
                </span>
              )}
            </span>
          )}
        </div>
      ))}

      {/* Approval Gate Box if action is pending */}
      {stagedAction && (
        <div className="approval-gate-box" id="activeApprovalGate">
          <h4>&#9888; [OPERATOR APPROVAL REQUIRED FOR {stagedAction.action}]</h4>
          <p>The agent has prepared the following Blogger mutation:</p>
          <div className="approval-details">
            &bull; <strong>Action:</strong> {stagedAction.action}
            <br />
            &bull; <strong>Resource ID:</strong> {stagedAction.resourceId}
            <br />
            &bull; <strong>Title:</strong> {stagedAction.payload.title}
          </div>
          <div className="approval-actions">
            <button
              id="btnApproveStaged"
              type="button"
              className="win-btn"
              style={{ color: '#008000', fontWeight: 'bold' }}
              onClick={onApproveAction}
            >
              &#10004; [APPROVE &amp; DEPLOY TO BLOGGER]
            </button>
            <button
              id="btnRejectStaged"
              type="button"
              className="win-btn"
              style={{ color: '#ff0000', fontWeight: 'bold' }}
              onClick={onRejectAction}
            >
              &#10006; [CANCEL / REJECT]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
