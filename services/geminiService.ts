import { GoogleGenAI } from "@google/genai";
import type { TradeWithPL } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getTradeAnalysis = async (trade: TradeWithPL, language: 'en' | 'fa'): Promise<string> => {
  if (!process.env.API_KEY) {
    return language === 'fa' 
        ? "تحلیل هوش مصنوعی در دسترس نیست. لطفاً کلید API خود را پیکربندی کنید."
        : "AI analysis is unavailable. Please configure your API key.";
  }
  
  const { 
    symbol, tradeType, pl, notes, strategy, session, stopLoss, takeProfit,
    entryPrice, emotions, preTradeAnalysis, postTradeAnalysis 
  } = trade;

  const outcome = pl >= 0 ? 'profit' : 'loss';
  const languageInstruction = language === 'fa' 
    ? "Respond in Persian (Farsi)." 
    : "Respond in English.";

  let riskRewardRatio = 'N/A';
  if (stopLoss > 0 && takeProfit > 0) {
      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(takeProfit - entryPrice);
      if (risk > 0) {
          riskRewardRatio = `1:${(reward / risk).toFixed(2)}`;
      }
  }

  const prompt = `
    You are a professional trading coach providing concise, actionable feedback.
    Analyze the following trade and provide constructive insights. Focus on potential psychological biases, risk management (like R:R ratio), and strategy consistency.
    Do not give financial advice. Keep the response under 150 words.
    ${languageInstruction}

    Trade Details:
    - Symbol: ${symbol}
    - Type: ${tradeType}
    - Session: ${session}
    - Strategy: ${strategy || 'Not specified'}
    - Planned R:R Ratio: ${riskRewardRatio}
    - Outcome: A ${outcome} of $${Math.abs(pl).toFixed(2)}
    - Trader's Emotions: "${emotions || 'Not specified'}"
    - Pre-Trade Analysis: "${preTradeAnalysis || 'Not provided.'}"
    - Post-Trade Analysis: "${postTradeAnalysis || 'Not provided.'}"
    - Trader's Notes: "${notes || 'No notes provided.'}"

    Provide your analysis:
  `;

  try {
    // FIX: The `contents` property should be a string for a simple text prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return language === 'fa'
        ? "خطایی در تحلیل معامله رخ داد. لطفاً بعداً دوباره امتحان کنید."
        : "There was an error analyzing the trade. Please try again later.";
  }
};
