import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const reviewCode = async (code: string, language: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    As an expert code reviewer, please analyze the following ${language} code.
    Provide constructive feedback focusing on:
    1.  **Bugs and Errors**: Identify any potential bugs or logical errors.
    2.  **Best Practices**: Suggest improvements based on language-specific best practices and conventions.
    3.  **Performance**: Point out any potential performance bottlenecks and suggest optimizations.
    4.  **Readability and Style**: Comment on code style, clarity, and maintainability.
    5.  **Security**: Highlight any potential security vulnerabilities.

    Format your response in clear, easy-to-read Markdown. Use headings, lists, and code blocks for examples.
    Provide a final summary of your findings.

    Here is the code to review:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while reviewing the code: ${error.message}`;
    }
    return "An unknown error occurred while reviewing the code.";
  }
};