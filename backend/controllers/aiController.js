const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Gemini API key is missing. Developer please check .env file.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Hidden system instructions
        const systemPrompt = `You are "Agri-Bot", a highly knowledgeable agricultural expert from India. 
You offer advice to farmers using the AgriSmart-AI platform. 
Keep your answers brief, friendly, practical, and highly relevant to Indian farming conditions (e.g. Rabi/Kharif seasons). 
Respond in "Hinglish". Use formatting (bullet points, emojis) to make reading easy on a small screen.

User asks: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (err) {
        console.error('AI Error:', err);
        res.status(500).json({ error: 'Sorry, Agri-Bot abhi offline hai. Kripya thodi der mein try karein.' });
    }
};
