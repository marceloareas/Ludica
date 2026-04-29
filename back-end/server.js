const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando');
});