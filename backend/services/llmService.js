import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export const analyzeEmotion = async (text) => {

  const prompt = `
You are an emotion analysis AI.

Analyze the following journal entry and return ONLY JSON.

Format:
{
 "emotion": "...",
 "keywords": ["...","..."],
 "summary": "..."
}

Journal:
${text}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  const result = response.choices[0].message.content;

  return result;
};