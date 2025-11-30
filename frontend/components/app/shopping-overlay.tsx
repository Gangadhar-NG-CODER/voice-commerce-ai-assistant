'use client';

import React, { useEffect, useState } from 'react';
import { useVoiceAssistant } from '@livekit/components-react';

interface ShoppingOverlayProps {
  messages: any[];
}

export function ShoppingOverlay({ messages }: ShoppingOverlayProps) {
  const { state: agentState } = useVoiceAssistant();
  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    // Count user interactions
    const userMessages = messages.filter(m => m.from?.isLocal === true);
    setInteractionCount(userMessages.length);
  }, [messages]);

  const getStateText = () => {
    switch (agentState) {
      case 'speaking':
        return '🛍️ Assistant speaking...';
      case 'listening':
        return '👂 Listening...';
      case 'thinking':
        return '🤔 Processing...';
      default:
        return '⏸️ Ready';
    }
  };

  const getStateColor = () => {
    switch (agentState) {
      case 'speaking':
        return 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300';
      case 'listening':
        return 'bg-blue-600/20 border-blue-500/40 text-blue-300';
      case 'thinking':
        return 'bg-yellow-600/20 border-yellow-500/40 text-yellow-300';
      default:
        return 'bg-slate-600/20 border-slate-500/40 text-slate-300';
    }
  };

  return (
    <>
      {/* Top Right - Status Indicator */}
      <div className="fixed top-16 right-4 z-40 pointer-events-none">
        <div className="flex items-center justify-end">
          {/* Status Indicator */}
          <div className={`bg-slate-900/95 backdrop-blur-md rounded-full px-5 py-2.5 border-2 shadow-2xl transition-all duration-300 ${getStateColor()}`}>
            <div className="flex items-center gap-2.5">
              <div className="text-sm font-bold whitespace-nowrap">
                {getStateText()}
              </div>
              {agentState === 'speaking' && (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left - Shopping Info */}
      <div className="fixed bottom-24 left-4 z-40 pointer-events-none md:bottom-32">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Voice Commerce</div>
              <div className="text-sm font-bold text-emerald-300">AI Shopping Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
