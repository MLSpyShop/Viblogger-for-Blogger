import React from 'react';
import { soundEngine } from '../services/sound';

interface TitleBarProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ onMinimize, onMaximize, onClose }) => {
  return (
    <div id="titleBar" className="title-bar">
      <span className="title-bar-text">&#128187; Viblogger for Blogger (v1.0.5)</span>
      <div className="title-bar-buttons">
        <button
          id="btnTitleMin"
          className="title-btn"
          type="button"
          onClick={() => {
            soundEngine.beep(800, 50);
            if (onMinimize) onMinimize();
          }}
          title="Minimize"
        >
          _
        </button>
        <button
          id="btnTitleMax"
          className="title-btn"
          type="button"
          onClick={() => {
            soundEngine.beep(900, 50);
            if (onMaximize) onMaximize();
          }}
          title="Maximize"
        >
          &#9633;
        </button>
        <button
          id="btnTitleClose"
          className="title-btn"
          type="button"
          onClick={() => {
            soundEngine.beep(400, 80);
            if (onClose) onClose();
          }}
          title="Close"
        >
          X
        </button>
      </div>
    </div>
  );
};
