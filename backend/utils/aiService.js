const axios = require('axios');

const callGrokAI = async (prompt) => {
    try {
        const response = await axios.post(process.env.GROK_ENDPOINT, {
            model: process.env.GROK_MODEL,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Groq AI Error:', error.response ? error.response.data : error.message);
        throw new Error('AI Service Error');
    }
};

module.exports = { callGrokAI };
