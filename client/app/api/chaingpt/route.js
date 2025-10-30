import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Message } from '@/lib/models';

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Store user message
    await Message.create({
      sessionId,
      role: 'user',
      content: message,
    });

    // In a real implementation, you would call the ChainGPT API here
    // For now, we'll mock the response
    const mockResponse = await mockChainGPTCall(message);

    // Store assistant message
    await Message.create({
      sessionId,
      role: 'assistant',
      content: mockResponse,
    });

    return NextResponse.json({ message: mockResponse });
  } catch (error) {
    console.error('Error in ChainGPT API route:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// Mock function to simulate ChainGPT API call
// In production, replace with actual API call
async function mockChainGPTCall(message) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const responses = {
    hello: 'Hello! How can I help you with blockchain technology today?',
    blockchain: 'Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without central authority.',
    ethereum: 'Ethereum is a decentralized, open-source blockchain platform that enables the creation of smart contracts and decentralized applications (dApps).',
    bitcoin: 'Bitcoin is the first cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto.',
    nft: 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of items like art, collectibles, and in-game items on a blockchain.',
    defi: 'DeFi (Decentralized Finance) refers to financial applications built on blockchain technologies, typically using smart contracts.',
  };

  // Check if the message contains any keywords
  const lowerMessage = message.toLowerCase();
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // Default response
  return "I'm ChainGPT, your blockchain AI assistant. I can help you with information about cryptocurrencies, blockchain technology, smart contracts, and more. What would you like to know?";
}

// In a real implementation, you would have a function like this:
/*
async function callChainGPTAPI(message) {
  const apiKey = process.env.CHAINGPT_API_KEY;
  const apiUrl = process.env.CHAINGPT_API_URL || 'https://api.chaingpt.org/v1/chat';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    throw new Error(`ChainGPT API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.message || data.response;
}
*/
