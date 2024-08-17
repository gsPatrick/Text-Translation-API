const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const translationRoutes = require('./routes/translationRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', translationRoutes);
app.use('/api/User', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const sequelize = require('./config/database');

sequelize.sync({ force: true }).then(() => {
    console.log('Banco de dados sincronizado com sucesso!');
}).catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});
