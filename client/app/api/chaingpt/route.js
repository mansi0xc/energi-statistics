import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User, Session, Message } from '@/lib/models';
import { chainGPTService } from '@/lib/chainGPTService';

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Handle missing or invalid sessionId
    const validSessionId = sessionId && !sessionId.startsWith('temp-') 
      ? sessionId 
      : `temp-${Date.now()}`;

    // Connect to the database
    await dbConnect();

    // Store user message
    await Message.create({
      sessionId: validSessionId,
      role: 'user',
      content: message,
    });
    
    // Find the session to get the user's encrypted IP
    const session = await Session.findOne({ sessionId: validSessionId });
    if (session) {
      // Update the session's question count
      await Session.updateOne(
        { sessionId: validSessionId },
        { $inc: { questionCount: 1 } }
      );
      
      // Find and update the user's question count
      await User.updateOne(
        { encryptedIp: session.encryptedIp },
        { $inc: { totalQuestions: 1 } }
      );
    } else if (!validSessionId.startsWith('temp-')) {
      // Log warning for missing session that should exist
      console.warn(`Session not found: ${validSessionId}`);
    }

    // Send message to ChainGPT API
    let response;
    try {
      // Check if API key is available
      if (!process.env.CHAINGPT_API_KEY) {
        console.warn('No ChainGPT API key found. Using mock response.');
        throw new Error('ChainGPT API key not configured');
      }
      
      // Generate a valid UUID for this conversation
      // For persistent conversations across sessions, we would need to store this UUID
      const conversationId = chainGPTService.generateConversationId();
      
      // Call ChainGPT API
      response = await chainGPTService.sendMessage(message, {
        chatHistory: 'off', // We're not using history for now
        useStreaming: false
      });

      if (!response.success) {
        throw new Error('ChainGPT API returned an unsuccessful response');
      }
    } catch (error) {
      console.error('Error calling ChainGPT API:', error);
      
      // Log more detailed error information if available
      if (error.response) {
        console.error('ChainGPT API response error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // Fallback to mock response if API fails
      response = {
        success: true,
        message: getMockResponse(message)
      };
    }

    // Store assistant message
    await Message.create({
      sessionId: validSessionId,
      role: 'assistant',
      content: response.message,
    });

    return NextResponse.json({ message: response.message });
  } catch (error) {
    console.error('Error in ChainGPT API route:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// Mock function to provide responses when ChainGPT API is unavailable
function getMockResponse(message) {
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
  } else if (lowerMessage.includes('reentrancy') || lowerMessage.includes('reentry') || lowerMessage.includes('re-entry')) {
    return "A reentrancy attack in blockchain is a vulnerability where an external contract calls back into the calling contract before the first execution is complete. This can happen when a contract sends funds to another contract before updating its own state. The recipient contract can then recursively call back into the original function, potentially draining funds. The 2016 DAO hack was a famous example, resulting in a $60 million theft. To prevent reentrancy attacks, developers use patterns like Checks-Effects-Interactions and reentrancy guards.";
  } else {
    return "I'm ChainGPT, your blockchain AI assistant. I can help you with information about cryptocurrencies, blockchain technology, smart contracts, and more. What would you like to know?";
  }
}