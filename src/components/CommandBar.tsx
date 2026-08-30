import React, { useState } from 'react';

interface CommandBarProps {
  onTransmit: (prompt: string) => void;
  isBusy: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onTransmit, isBusy }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isBusy) return;
    onTransmit(inputValue.trim());
    setInputValue('');
  };

  return (
    <form id="commandForm" className="input-bar-container" onSubmit={handleSubmit}>
      <span className="prompt-prefix">&gt;</span>
      <input
        type="text"
        id="userPromptInput"
        className="input-field"
        placeholder="Type command (e.g. 'Review Top 5 AI tools with comparison table')..."
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isBusy}
      />
      <button
        type="submit"
        id="sendBtn"
        className="win-btn"
        disabled={isBusy || !inputValue.trim()}
      >
        <span style={{ color: '#0000aa' }}>►</span>
        <span>{isBusy ? 'Processing...' : 'Transmit'}</span>
      </button>
    </form>
  );
};
