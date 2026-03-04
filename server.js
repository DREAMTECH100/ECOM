
// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('Public'));
app.use('/uploads', express.static('uploads')); // Serve images


// Routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'ECOM backend is alive 🔥' });
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

