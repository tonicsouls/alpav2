import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// This check is for cloud-based models. Local models won't need it.
if (!process.env.API_KEY) {
  console.warn("Gemini API key not found. Cloud-based models will fail. Local models are simulated.");
}

// FIX: Per coding guidelines, initialize with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    "fileType": { 
      "type": Type.STRING, 
      "description": "The determined type of the document (e.g., Invoice, Tax Form, Loan Application, Other)." 
    },
    "hasCustomerData": { 
      "type": Type.BOOLEAN, 
      "description": "True if customer identifying fields (Name, Address, or Account ID) are present." 
    },
    "customerIdentifier": { 
      "type": Type.STRING, 
      "description": "The primary customer identifier found (e.g., customer name, account number). 'N/A' if not found." 
    },
    "containsPII": {
      "type": Type.BOOLEAN,
      "description": "True if the document contains sensitive Personally Identifiable Information (PII) like social security numbers or bank details."
    }
  },
  required: ["fileType", "hasCustomerData", "customerIdentifier", "containsPII"]
};

const simulateLocalModel = (content: string): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let result: AnalysisResult;
            if (content.toLowerCase().includes("invoice")) {
                result = {
                    fileType: 'Invoice',
                    hasCustomerData: true,
                    customerIdentifier: 'INV-001',
                    containsPII: false
                };
            } else if (content.toLowerCase().includes("tax")) {
                result = {
                    fileType: 'Tax Form',
                    hasCustomerData: true,
                    customerIdentifier: 'TAXID-555-1234',
                    containsPII: true // Simulate PII for tax docs
                };
            } else {
                 result = {
                    fileType: 'Other',
                    hasCustomerData: false,
                    customerIdentifier: 'N/A',
                    containsPII: false
                };
            }
            resolve(result);
        }, 1200 + Math.random() * 600);
    });
};

export async function analyzeDocument(
  content: string, 
  systemInstruction: string,
  modelName: string
): Promise<AnalysisResult> {

  // If a local model is selected, use the simulation function
  if (modelName.startsWith('local-')) {
    console.log(`Using simulated local model: ${modelName}`);
    return simulateLocalModel(content);
  }
  
  // Otherwise, proceed with the cloud-based API call
  try {
    // FIX: Per coding guidelines, check process.env.API_KEY directly.
    if (!process.env.API_KEY) throw new Error("API_KEY is not set for cloud-based model request.");

    const response = await ai.models.generateContent({
      model: modelName,
      // FIX: Per coding guidelines, for single text prompts, `contents` should be a string.
      contents: `Analyze the following file content: \n\n---START---\n${content}\n---END---`,
      config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("API returned an empty response.");
    }
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing document with Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown API error occurred.";
    throw new Error(`AI analysis failed: ${errorMessage}`);
  }
}