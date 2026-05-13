const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const avatarRoutes = require('./src/routes/avatarRoutes');
const gamesRoutes = require('./src/routes/gamesRoutes');
const scoreRoutes = require('./src/routes/scoreRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const friendsRoutes = require('./src/routes/friendsRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/avatars', avatarRoutes);
app.use('/games', gamesRoutes);
app.use('/score', scoreRoutes);
app.use('/history', historyRoutes);

app.use('/friends', friendsRoutes);
app.listen(3000, () => {
    console.log('Servidor rodando');
});
