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
    console.log(res.json(jobs));
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
    const formattedTypes = employmentTypes.map(type => type.replace(/\s+/g, '_'));
    res.json(formattedTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch grouped employment types based on state
app.get("/jobs/groupedEmploymentType", async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 1000000); // Generate a random integer between 0 and 999999
    const timestamp = Date.now(); // Get the current timestamp

    const jobsData = await Job.aggregate([
      {
        $group: {
          _id: {
            id: { $concat: [randomId.toString(), "-", timestamp.toString(), "-", "$state"] },
            state: "$state",
            employmentType: "$employmenttype_jobstatus"
          },
          state: { $first: "$state" }, // Retrieve the state
          employmentType: { $first: "$employmenttype_jobstatus" }, // Retrieve the employment type
          count: { $sum: 1 } // Count occurrences for each state and employment type combination
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          id: "$_id.id",
          state: 1,
          employmentType: {
            $replaceAll: { input: "$_id.employmentType", find: " ", replacement: "_" }
          },
          count: 1
        }
      }
    ]);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch grouped departments based on state
app.get("/jobs/groupedDepartments", async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 1000000); // Generate a random integer between 0 and 999999
    const timestamp = Date.now(); // Get the current timestamp

    const jobsData = await Job.aggregate([
      {
        $group: {
          _id: {
            id: { $concat: [randomId.toString(), "-", timestamp.toString(), "-", "$state"] },
            state: "$state",
            department: "$department",
            employmentType: "$employmenttype_jobstatus"
          },
          state: { $first: "$state" }, // Retrieve the state
          department: { $first: "$department" }, // Retrieve the department
          employmentType: { $first: "$employmenttype_jobstatus" }, // Retrieve the employment type
          company: { $first: "$company" }, // Retrieve the company
          skills: { $first: "$skills" }, // Retrieve the skills
          jobDescription: { $first: "$jobdescription" }, // Retrieve the job description
          jobTitle: { $first: "$jobtitle" }, // Retrieve the job title
          count: { $sum: 1 } // Count occurrences for each state, department, and employment type combination
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          id: "$_id.id",
          state: 1,
          department: 1,
          employmentType: {
            $replaceAll: { input: "$_id.employmentType", find: " ", replacement: "_" }
          },
          company: 1,
          skills: 1,
          jobDescription: 1,
          jobTitle: 1,
          count: 1
        }
      }
    ]);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch skills data for each department
app.get("/departments/skills", async (req, res) => {
  try {
    const jobsData = await Job.aggregate([
      {
        $unwind: "$skills" // Unwind the skills array
      },
      {
        $group: {
          _id: "$department",
          skills: { $addToSet: "$skills" } // Collect unique skills for each department
        }
      }
    ]);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
