const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'senhaLegal';
const { translateText } = require('../services/translationService'); // Importe a função aqui


// Middleware para autenticar e verificar token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Assumindo formato "Bearer TOKEN"

    if (token == null) {
        req.user = null; // Se não há token, define o usuário como null
        return next(); // Continua para o próximo middleware (checkTranslationLimit)
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user; // Adiciona usuário à requisição
        next(); // Continua para o próximo middleware (checkTranslationLimit)
    });
};

const MAX_TRANSLATIONS_UNAUTHENTICATED = 5;
const translationsCounter = {}; // Armazena o contador de traduções por IP

// Middleware para aplicar limite de traduções para usuários não autenticados
const checkTranslationLimit = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Se o usuário estiver autenticado (com token válido), não aplica limite
    if (req.user) {
        return next();
    }

    // Se o usuário não estiver autenticado, verifica o contador de traduções por IP
    if (!translationsCounter[ip]) {
        translationsCounter[ip] = 0;
    }

    if (translationsCounter[ip] >= MAX_TRANSLATIONS_UNAUTHENTICATED) {
        return res.status(403).json({ error: 'Limite de traduções atingido' });
    }

    translationsCounter[ip]++;
    next();
};

// Rota para tradução
router.post('/translate', authenticateToken, checkTranslationLimit, async (req, res) => {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'É necessário um texto e uma linguagem desejada para traduzir' });
    }

    try {
        const translation = await translateText(text, targetLanguage);
        res.status(200).json(translation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;