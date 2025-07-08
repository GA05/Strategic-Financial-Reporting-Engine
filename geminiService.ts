import { GoogleGenAI } from '@google/genai';
import { DataRow } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (text: string): any => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", e);
        throw new Error("The AI returned an invalid data format. Please try again.");
    }
};

export const generateForecast = async (historicalData: DataRow[], dateColumn: string, valueColumn: string): Promise<DataRow[]> => {
    const prompt = `
You are a financial data scientist. Based on the following historical time-series data, predict the next 5 data points.
The data represents '${valueColumn}' over time. The date or period is in the '${dateColumn}' column.

Historical Data:
${JSON.stringify(historicalData)}

Respond ONLY with a valid JSON array of objects for the next 5 periods. The objects must have the exact same keys: '${dateColumn}' and '${valueColumn}'.
Do not include any introductory text, explanations, or markdown code fences.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const forecastData = parseJsonResponse(response.text);
    if (!Array.isArray(forecastData)) {
        throw new Error("AI returned a non-array format for the forecast.");
    }

    return forecastData;
};

export const generateReport = async (data: DataRow[]): Promise<string> => {
    const prompt = `
You are a senior business strategist providing an analysis for an executive review.
Here is the data available for analysis:
--- DATA ---
${JSON.stringify(data, null, 2)}
--- END DATA ---

Please provide a concise but insightful business report based on this data. Your analysis should include:
1.  **Executive Summary:** A brief overview of the key findings.
2.  **Key Performance Indicators (KPIs):** Identify 2-3 important KPIs from the data, describe their trends, and explain their significance.
3.  **Opportunity:** Highlight one potential opportunity revealed by the data.
4.  **Risk:** Point out one potential risk or area for concern.
5.  **Recommendation:** A clear, actionable recommendation based on your analysis.

Format the entire response in Markdown for readability.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
    });
    
    return response.text;
};