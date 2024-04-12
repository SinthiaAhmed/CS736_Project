const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Job = require("./jobSchema");

const app = express();
app.use(cors());

// Connect to MongoDB Atlas
require("./mongoConnect");

// Define routes
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
    console.log(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch unique department names
app.get("/departments", async (req, res) => {
  try {
    const departments = await Job.distinct("department");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch unique employment types
app.get("/employmenttypes", async (req, res) => {
  try {
    const employmentTypes = await Job.distinct("employmenttype_jobstatus");
    res.json(employmentTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch grouped employment types based on state
app.get("/jobs/groupedEmploymentType", async (req, res) => {
  try {
    const jobsData = await Job.aggregate([
      {
        $group: {
          _id: { state: "$state", employmentType: "$employmenttype_jobstatus" },
          count: { $sum: 1 }, // Count occurrences for each state and employment type combination
        },
      },
    ]);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
