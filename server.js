const express = require('express');
const mongoose = require('mongoose');
const Job = require('./jobSchema');
const app = express();

// Connect to MongoDB Atlas
require('./mongoConnect');

// Define routes
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
