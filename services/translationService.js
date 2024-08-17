const axios = require('axios');

const translateText = async (text, targetLanguage) => {
    try {
        const response = await axios.post('https://translation.googleapis.com/language/translate/v2', {
            q: text,
            target: targetLanguage
        }, {
            params: {
                key: process.env.GOOGLE_API_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Erro na tradução');
    }
};

module.exports = { translateText };

