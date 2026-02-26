import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ModelMode, ToneSelection } from "../types";

// Define the response schema for structured output
const suggestionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Very brief context summary (1 sentence).",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "The tone (e.g., Casual, Flirty) or Title of the Plan" },
          reply: { type: Type.STRING, description: "The suggested reply text or Date Plan Details." },
          explanation: { type: Type.STRING, description: "Short reason why." },
        },
        required: ["tone", "reply", "explanation"],
      },
    },
  },
  required: ["summary", "suggestions"],
};

/**
 * Generates Rizz suggestions based on text and optional image input.
 */
export const generateRizz = async (
  apiKey: string,
  promptText: string,
  imageBase64: string | undefined,
  mode: ModelMode,
  tone: ToneSelection,
  iteration: number = 0
): Promise<AnalysisResult> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Default to Gemini 3 Flash
  let modelName = 'gemini-3-flash-preview';
  let tools: any[] = [];
  let thinkingConfig: any = undefined;
  
  // Configuration based on Mode
  if (mode === ModelMode.DEEP) {
    modelName = 'gemini-3-pro-preview';
    thinkingConfig = { thinkingBudget: 2048 }; 
  } else if (mode === ModelMode.SEARCH) {
    // Switch to Pro for better tool use and reasoning
    modelName = 'gemini-3-pro-preview'; 
    tools = [{ googleSearch: {} }];
  } else if (mode === ModelMode.FAST) {
    modelName = 'gemini-3-flash-preview';
  }

  const parts: any[] = [];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: imageBase64,
      },
    });
    parts.push({ text: "MEDIA ANALYSIS: Identify the Partner's last message. Use previous messages only for context." });
  }

  let toneInstruction = "";
  if (mode === ModelMode.SEARCH) {
      toneInstruction = "You are a world-class Dating Concierge and Event Planner. Your goal is to create IMPRESSIVE, SPECIFIC date ideas based on the user's request. Use Google Search to find real, currently open places or events if location is implied.";
  } else {
      if (iteration === 0) {
        toneInstruction = "Provide 3 initial options: 1. Casual/Low-key (safe), 2. Playful (medium risk), 3. Direct (higher risk). Keep them short.";
      } else {
        toneInstruction = "The user wants MORE options. Go deeper, wittier, or more specific. Increase the 'Rizz' level. Give 3 new unique options.";
      }
      if (tone !== 'Mixed') {
         toneInstruction += ` Focus specifically on the ${tone} vibe.`;
      }
  }

  const systemInstruction = `
    You are 'RizzMaster'.
    
    CRITICAL INSTRUCTION - SMART HANDLING:
    1. **Scenario Detection**: If the user says "She said X but I am Y" (e.g., "She wants to meet but I'm busy"), your replies MUST solve the problem.
    2. **Simple Starts**: If the input is just "hey", DO NOT over-analyze. Give chill, short replies.
    
    MODE: ${mode === ModelMode.SEARCH ? "DATE PLANNER / FACT CHECKER" : "RIZZ GENERATOR"}
    ${toneInstruction}
    
    OUTPUT FORMAT:
    You must output strictly compatible JSON matching the schema.
    For Date Plans (Search Mode):
    - 'tone': Use this field for the "Title" of the date idea (e.g., "Sunset Drinks @ The Roof").
    - 'reply': Use this field for the "Details" (Time, Activity, Logistics). Format nicely with line breaks if needed.
    - 'explanation': Why this date works.
  `;

  parts.push({ text: `User Input: ${promptText || "Analyze the image"}.` });

  try {
    const config: any = {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: suggestionSchema,
    };

    if (thinkingConfig) config.thinkingConfig = thinkingConfig;

    if (tools.length > 0) {
      config.tools = tools;
      // When using tools, sometimes enforcing schema + tools + thinking causes issues or is ignored.
      // We keep responseMimeType to try to force JSON, but handle text fallbacks below.
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config
      });
    } catch (primaryError) {
      // Fallback logic for Free Tier / Model Unavailability
      if (modelName !== 'gemini-3-flash-preview') {
        console.warn(`Primary model ${modelName} failed. Attempting fallback to Flash.`);
        
        // Create a simplified config for the fallback
        const fallbackConfig = { ...config };
        delete fallbackConfig.tools;
        delete fallbackConfig.thinkingConfig;
        
        // Retry with Flash
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts },
          config: fallbackConfig
        });
      } else {
        throw primaryError;
      }
    }

    // Special handling for Search Mode results
    if (mode === ModelMode.SEARCH) {
       const text = response.text || "";
       const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
       const links = groundingChunks.map((c: any) => c.web ? { title: c.web.title, url: c.web.uri } : null).filter(Boolean);

       // 1. Try to find JSON in the text
       try {
         const cleanJson = text.replace(/```json|```/g, "").trim();
         const firstBrace = cleanJson.indexOf('{');
         const lastBrace = cleanJson.lastIndexOf('}');
         
         if (firstBrace !== -1 && lastBrace !== -1) {
            const parsed = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
            // Inject links if valid
            if (parsed.suggestions) return { ...parsed, groundingLinks: links };
         }
       } catch (e) {
           // JSON parse failed, proceed to fallback
       }

       // 2. Fallback: Formatting raw text into a nice card
       // If the model returned a wall of text, we try to make it look like a plan.
       return {
         summary: "Date Plan Results",
         suggestions: [
             { 
                 tone: "Date Plan", 
                 reply: text, // ResultCard will handle markdown/newlines
                 explanation: "Generated based on real-time search data." 
             }
         ],
         groundingLinks: links
       };
    }

    // Standard Rizz Generation Parsing
    const jsonText = response.text || "{}";
    const cleanJson = jsonText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("404")) {
      throw new Error(`Model ${modelName} unavailable. Please check API key/permissions.`);
    }
    // Fallback error result to prevent app crash
    return {
        summary: "Error generating response",
        suggestions: [{
            tone: "System Error",
            reply: "I had a brain freeze. Try asking again?",
            explanation: "API request failed."
        }]
    };
  }
};