import React, { useEffect, useState } from 'react';

interface StatusBarProps {
  statusText: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ statusText }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="statusBar" className="status-bar">
      <div id="footerStatus" className="status-segment grow">
        {statusText}
      </div>
      <div id="tokenClock" className="status-segment">
        Session: {formatTime(seconds)}
      </div>
      <div id="baudRate" className="status-segment">
        v1.0.5
      </div>
    </div>
  );
};
