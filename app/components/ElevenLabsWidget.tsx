"use client";
import React, { useEffect } from 'react';

/**
 * ElevenLabs ConvAI Widget Component
 * 
 * This component integrates the ElevenLabs ConvAI chatbot widget into the dashboard.
 * The widget provides real-time AI assistance for agricultural queries and guidance.
 * 
 * Setup Instructions:
 * 1. Replace "your-agent-id" with your actual ElevenLabs agent ID
 * 2. Configure the agent with agriculture-specific knowledge
 * 3. The widget will appear as a floating chat button on the dashboard
 * 
 * To get your agent ID:
 * 1. Visit https://elevenlabs.io/
 * 2. Create an account and set up a ConvAI agent
 * 3. Configure it with agricultural knowledge and multilingual support
 * 4. Copy the agent ID from your dashboard
 */

interface ElevenLabsWidgetProps {
  agentId: string;
  className?: string;
}

const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  agentId, 
  className = "" 
}) => {
  useEffect(() => {
    // Ensure the script is loaded before trying to use the widget
    const script = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
    if (!script) {
      const newScript = document.createElement('script');
      newScript.src = 'https://elevenlabs.io/convai-widget/index.js';
      newScript.async = true;
      document.head.appendChild(newScript);
    }
  }, []);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`
      }}
    />
  );
};

export default ElevenLabsWidget;
