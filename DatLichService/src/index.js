const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  release();
});

// Routes
app.use('/api/appointments', appointmentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Appointment Service' });
});

// Start server
app.listen(port, () => {
  console.log(`Appointment service is running on port ${port}`);
}); 