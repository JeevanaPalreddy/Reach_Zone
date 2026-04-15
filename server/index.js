const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { getMongoUri } = require('./mongoUri');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",          // local development
    "https://reachzone.vercel.app"    // your vercel frontend URL
  ],
  credentials: true
}));
app.use(express.json());

mongoose
  .connect(getMongoUri())
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('DB Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/prep', require('./routes/prep'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
