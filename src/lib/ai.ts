"use client";

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generateText(prompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }
} 