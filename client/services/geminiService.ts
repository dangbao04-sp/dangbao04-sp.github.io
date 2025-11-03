import { GoogleGenAI } from "@google/genai";

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
// The API key is assumed to be available and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
You are a friendly and helpful virtual assistant for Anh Thơ Spa, a beauty and wellness center in Vietnam.
Your name is Thơ.
Your role is to answer customer questions about services, bookings, and general spa information.
Keep your answers concise, friendly, and professional. Always communicate in Vietnamese.

Here is some information about Anh Thơ Spa:
- Services: We offer facials, massages, body treatments, and hair removal.
- Booking: Customers can book through the app or call our hotline.
- Location: 123 Beauty St, Hanoi, Vietnam.
- Opening hours: 9 AM - 8 PM, Monday to Sunday.

Do not provide medical advice. For complex questions, advise the user to contact the spa directly at 098-765-4321.
`;

export const getChatbotResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // FIX: Simplify contents for a single text prompt.
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting response from Gemini API:", error);
        return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.";
    }
};