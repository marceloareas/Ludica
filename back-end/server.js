const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
