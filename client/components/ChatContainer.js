import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize chat with greeting message
  useEffect(() => {
    const initialMessage = {
      role: 'assistant',
      content: '👋 Hey there! I\'m your ChainGPT assistant. Ask me anything!'
    };
    setMessages([initialMessage]);

    // Set up event listener to end session when navigating away
    const handleBeforeUnload = () => {
      if (sessionId) {
        // Use a synchronous approach for beforeunload
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/session/end', false); // false makes it synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ sessionId }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // End session when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (sessionId) {
        endSession();
      }
    };
  }, [sessionId]); // Add sessionId as dependency

  const startSession = async () => {
    try {
      // Try to start a session with the API
      try {
        const res = await fetch('/api/session/start', {
          method: 'POST',
        });
        const data = await res.json();
        setSessionId(data.sessionId);
      } catch (error) {
        // If API fails, create a local mock session ID
        console.error('Failed to start session with API, using local session:', error);
        setSessionId(`local-${Date.now()}`);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const endSession = async () => {
    // Only try to end session if it's not a local session
    if (!sessionId || sessionId.startsWith('local-')) {
      return;
    }
    
    try {
      await fetch('/api/session/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  // Mock responses for when API is not available
  const getMockResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm ChainGPT, your blockchain assistant. How can I help you today?";
    } else if (lowerMessage.includes('blockchain')) {
      return "Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without central authority.";
    } else if (lowerMessage.includes('ethereum')) {
      return "Ethereum is a decentralized, open-source blockchain platform that enables the creation of smart contracts and decentralized applications (dApps).";
    } else if (lowerMessage.includes('bitcoin')) {
      return "Bitcoin is the first cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto.";
    } else if (lowerMessage.includes('nft')) {
      return "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of items like art, collectibles, and in-game items on a blockchain.";
    } else if (lowerMessage.includes('defi')) {
      return "DeFi (Decentralized Finance) refers to financial applications built on blockchain technologies, typically using smart contracts.";
    } else if (lowerMessage.includes('smart contract')) {
      return "Smart contracts are self-executing contracts with the terms directly written into code. They automatically execute when predefined conditions are met, without requiring intermediaries.";
    } else {
      return "I'm ChainGPT, your blockchain AI assistant. I can help you with information about cryptocurrencies, blockchain technology, smart contracts, and more. What would you like to know?";
    }
  };

  const handleSendMessage = async (content) => {
    // Add user message to chat
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Start a session if this is the first user message
    if (!sessionId) {
      await startSession();
    }
    
    try {
      // Try to send message to API
      let botResponse;
      
      try {
        const response = await fetch('/api/chaingpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: content,
            sessionId 
          }),
        });
        
        const data = await response.json();
        botResponse = data.message;
      } catch (error) {
        console.error('API error, using mock response:', error);
        // If API fails, use mock response
        botResponse = getMockResponse(content);
      }
      
      // Add a small delay to simulate typing
      setTimeout(() => {
        setIsTyping(false);
        
        // Add bot response to chat
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: botResponse || 'Sorry, I encountered an error. Please try again.' 
        }]);
      }, 1500);
    } catch (error) {
      console.error('Error in message handling:', error);
      
      // Handle error with mock response
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: getMockResponse(content)
        }]);
      }, 1500);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col bg-black/40 backdrop-blur-sm rounded-xl border border-emerald-500/20 overflow-hidden glow-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {sessionId && (
          <div className="text-xs text-gray-400 mb-2 flex justify-between">
            <span>Session: {sessionId.substring(0, 8)}...</span>
            {/* <button 
              onClick={() => {
                if (sessionId) {
                  endSession();
                  // Redirect to analytics page after ending session
                  window.location.href = '/analytics';
                }
              }}
              className="text-emerald-400 hover:text-emerald-300"
            >
              End Session & View Stats
            </button> */}
          </div>
        )}
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <MessageBubble 
              key={index} 
              message={message} 
              isUser={message.role === 'user'} 
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-emerald-500/20 bg-black/60">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isTyping} 
        />
      </div>
    </motion.div>
  );
};

export default ChatContainer;
