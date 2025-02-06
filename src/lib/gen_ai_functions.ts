import { GoogleGenerativeAI } from "@google/generative-ai";

const api_key = process.env.GEN_AI_KEY || "";

// Initialize genAI *once* with the API key
const genAI = new GoogleGenerativeAI(api_key);

// Get both models, using the same genAI instance
const model = genAI.getGenerativeModel({
  model: "text-embedding-004",
});
const text_model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const __getUserEmbedding = async (data: string[]) => {
  try {
    const result = await model.embedContent(data.join(", "));
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating user embedding:", error); // Use console.error for errors
    return [];
  }
};

export const __getCurrentTechTrends = async (
  prompt: string | string[]
): Promise<string> => {
  try {
    const result = await text_model.generateContent(prompt);
    // console.log(result.response.text());
    return result.response.text(); // Return the text content
  } catch (err: any) {
    console.error("Error generating tech trends:", err); // Use console.error
    return ""; // Or handle the error as appropriate
  }
};
