import axios from 'axios';

class ChainGPTService {
  constructor() {
    this.apiKey = process.env.CHAINGPT_API_KEY;
    this.baseURL = process.env.CHAINGPT_API_URL || 'https://api.chaingpt.org';

    if (!this.apiKey) {
      console.warn(
        'ChainGPT API key not found. Please set CHAINGPT_API_KEY in your environment variables.',
      );
    }

    // Create headers with or without API key
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if API key is available
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    // Create axios instance without custom adapter
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // Increased to 60 seconds
      headers,
    });

    this.conversationHistory = new Map();
  }

  async sendMessage(
    question,
    options = { chatHistory: 'off', sdkUniqueId: null, useStreaming: false },
  ) {
    const { chatHistory = 'off', sdkUniqueId = null, useStreaming = false } = options;

    try {
      if (useStreaming) {
        return await this.sendStreamingMessage(question, { chatHistory, sdkUniqueId });
      }
      return await this.sendBlobMessage(question, { chatHistory, sdkUniqueId });
    } catch (error) {
      console.error('ChainGPT API Error:', error);
      throw new Error('Failed to get response from ChainGPT');
    }
  }

  async sendBlobMessage(question, options = {}) {
    const { chatHistory, sdkUniqueId } = options;

    const requestData = {
      question,
      chatHistory: chatHistory || 'off',
      model: 'general_assistant',
    };

    // Only include sdkUniqueId if chatHistory is enabled
    if (sdkUniqueId && chatHistory && chatHistory !== 'off') {
      requestData.sdkUniqueId = sdkUniqueId;
    }

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await this.axiosInstance.post('/chat/stream', requestData);

        const botMessage =
          response.data?.bot ||
          response.data?.message ||
          response.data?.response ||
          response.data?.answer ||
          response.data?.content ||
          (typeof response.data === 'string' ? response.data : null);

        if (sdkUniqueId && botMessage && chatHistory && chatHistory !== 'off') {
          this.updateConversationHistory(sdkUniqueId, question, botMessage);
        }

        return {
          success: true,
          message: botMessage || 'No response received',
          fullResponse: response.data,
        };
      } catch (error) {
        attempt++;
        console.error(`ChainGPT API request failed (attempt ${attempt}/${maxRetries}):`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout,
          },
        });

        // Check if it's a network/timeout issue vs API error
        const isRetryableError =
          error.code === 'ECONNABORTED' || // timeout
          error.code === 'ENOTFOUND' || // DNS
          error.code === 'ECONNREFUSED' || // Connection refused
          (error.response?.status >= 500 && error.response?.status < 600); // Server errors

        if (attempt >= maxRetries || !isRetryableError) {
          if (!isRetryableError && error.response) {
            throw new Error(
              `ChainGPT API error (${error.response.status}): ${
                error.response.data?.message || error.message
              }`,
            );
          }
          throw new Error(
            `Failed to get response from ChainGPT after ${maxRetries} attempts: ${error.message}`,
          );
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async sendStreamingMessage(question, options = {}) {
    const { chatHistory, sdkUniqueId } = options;

    const requestData = {
      question,
      chatHistory: chatHistory || 'off',
      model: 'general_assistant',
    };

    // Only include sdkUniqueId if chatHistory is enabled
    if (sdkUniqueId && chatHistory && chatHistory !== 'off') {
      requestData.sdkUniqueId = sdkUniqueId;
    }

    try {
      const response = await this.axiosInstance.post('/chat/stream', requestData, {
        responseType: 'stream',
      });

      let fullMessage = '';
      const chunks = [];

      // For now, treat stream response as regular response since handling streams in browser is complex
      // You might want to implement proper streaming later
      if (response.data?.bot) {
        fullMessage = response.data.bot;
        chunks.push(fullMessage);
      }

      if (sdkUniqueId && fullMessage) {
        this.updateConversationHistory(sdkUniqueId, question, fullMessage);
      }

      return {
        success: true,
        message: fullMessage,
        chunks,
        isStreaming: true,
      };
    } catch (error) {
      console.error('ChainGPT streaming request failed:', error);
      throw new Error(`Failed to get streaming response from ChainGPT: ${error.message}`);
    }
  }

  updateConversationHistory(conversationId, question, answer) {
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, []);
    }

    const history = this.conversationHistory.get(conversationId);
    history.push({
      question,
      answer,
      timestamp: new Date().toISOString(),
    });

    if (history.length > 50) {
      history.shift();
    }
  }

  getConversationHistory(conversationId) {
    return this.conversationHistory.get(conversationId) || [];
  }

  clearConversationHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
  }

  generateConversationId() {
    // Generate a proper UUID v4 as required by ChainGPT API
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async testConnection() {
    try {
      console.log('Testing ChainGPT API connection...');
      console.log('API Key present:', !!this.apiKey);
      console.log('Base URL:', this.baseURL);

      // Test with a simple request
      const response = await this.axiosInstance.post('/chat/stream', {
        question: 'Hello',
        chatHistory: 'off',
        model: 'general_assistant',
      });

      console.log('Connection test successful:', response.status);
      return { success: true, status: response.status };
    } catch (error) {
      console.error('Connection test failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return { success: false, error: error.message };
    }
  }

  async askAboutCrypto(question, coinSymbol = null) {
    let enhancedQuestion = question;

    if (coinSymbol) {
      enhancedQuestion = `Regarding ${coinSymbol}: ${question}`;
    }

    return await this.sendMessage(enhancedQuestion);
  }

  async getMarketAnalysis(symbol) {
    const question = `Provide a detailed market analysis for ${symbol} including current trends, technical indicators, and market sentiment.`;
    return await this.sendMessage(question);
  }

  async explainConcept(concept) {
    const question = `Explain the following cryptocurrency/blockchain concept in simple terms: ${concept}`;
    return await this.sendMessage(question);
  }
}

// Create a singleton instance
const chainGPTService = new ChainGPTService();

export { chainGPTService };
export default ChainGPTService;
