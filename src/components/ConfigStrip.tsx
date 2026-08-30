import React from 'react';
import { BlogItem } from '../types';

interface ConfigStripProps {
  onOpenKeysModal: () => void;
  geminiKey: string;
  clientId: string;
  blogId: string;
  userBlogs: BlogItem[];
  onAuthGIS: () => void;
  isDraftMode: boolean;
  onToggleDraftMode: (val: boolean) => void;
  isOnline: boolean;
}

export const ConfigStrip: React.FC<ConfigStripProps> = ({
  onOpenKeysModal,
  geminiKey,
  clientId,
  blogId,
  userBlogs,
  onAuthGIS,
  isDraftMode,
  onToggleDraftMode,
  isOnline
}) => {
  const currentBlog = userBlogs.find((b) => b.id === blogId);
  const blogLabel = currentBlog ? currentBlog.name : blogId ? `ID: ${blogId}` : '';

  return (
    <div id="configStrip" className="config-strip">
      <div className="config-row-compact">
        <div className="config-left-items">
          {/* Keys Dialog Trigger */}
          <button
            type="button"
            id="btnOpenKeysRibbon"
            className="win-btn config-btn"
            onClick={onOpenKeysModal}
            title="Configure Gemini API Key, Google Client ID, and Blogger Blog ID"
          >
            <span>&#128273;</span>
            <span>Keys...</span>
          </button>

          {/* Logon with Google */}
          <button
            type="button"
            id="authBtn"
            className="win-btn config-btn"
            onClick={onAuthGIS}
            title="Authenticate with Google Identity Services (GIS)"
          >
            <span>&#128273;</span>
            <span>Logon<span className="logon-extra-text"> with Google</span></span>
          </button>

          {/* Draft Checkbox */}
          <label
            className="checkbox-container config-draft-label"
            title="If checked, creations will be saved as drafts instead of publishing live immediately."
          >
            <input
              type="checkbox"
              id="draftModeCheckbox"
              checked={isDraftMode}
              onChange={(e) => onToggleDraftMode(e.target.checked)}
            />
            <span>Draft</span>
          </label>

          {/* Quick Active Blog Label (visible on medium+ screens) */}
          {blogId && (
            <span
              className="active-blog-badge"
              title={`Active Blogger Target: ${blogLabel || blogId}`}
            >
              Blog: <strong>{blogLabel || blogId}</strong>
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div
          id="connStatus"
          className={`status-pill ${isOnline ? 'online' : ''}`}
          title={`Network status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`}
        >
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>
    </div>
  );
};
