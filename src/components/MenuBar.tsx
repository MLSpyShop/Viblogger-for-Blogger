import React from 'react';

interface MenuBarProps {
  onQuickAction: (action: string) => void;
  onOpenModal: (modalName: 'keys' | 'serp' | 'guide' | 'faq' | 'examples') => void;
  onOpenBlogger: () => void;
  onClearTerminal: () => void;
  onResetCredentials: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onQuickAction,
  onOpenModal,
  onOpenBlogger,
  onClearTerminal,
  onResetCredentials,
  soundMuted,
  onToggleSound
}) => {
  return (
    <div id="menuBar" className="menu-bar">
      <div className="menu-line">
        <span
          id="menuKeys"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={() => onOpenModal('keys')}
        >
          [Keys]
        </span>
        <span
          id="menuUserGuide"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={() => onOpenModal('guide')}
        >
          [Guide]
        </span>
        <span
          id="menuFaq"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={() => onOpenModal('faq')}
        >
          [FAQ]
        </span>
        <span
          id="menuExamples"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={() => onOpenModal('examples')}
        >
          [Examples]
        </span>
        <span
          id="menuBloggerDashboard"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={onOpenBlogger}
        >
          [Dashboard]
        </span>
      </div>

      <div className="menu-line">
        <span
          id="menuClearTerminal"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={onClearTerminal}
        >
          [Clear Screen]
        </span>
        <span
          id="menuResetCredentials"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={onResetCredentials}
        >
          [Reset Credentials]
        </span>
        <span
          id="menuSoundToggle"
          className="menu-item"
          role="button"
          tabIndex={0}
          onClick={onToggleSound}
        >
          [Sound: {soundMuted ? 'OFF' : 'ON'}]
        </span>
      </div>
    </div>
  );
};
