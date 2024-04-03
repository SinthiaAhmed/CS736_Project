const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Job = require("./jobSchema");

const app = express();
app.use(cors());

// Connect to MongoDB Atlas
require("./mongoConnect");

// Define routes
/*app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/departments", async (req, res) => {
  try {
    const departments = await Job.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
