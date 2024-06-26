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

// Endpoint to fetch unique skills data for each department
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
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          department: "$_id", // Rename _id to department
          skills: 1 // Include the skills array
        }
      }
    ]);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/departments/mostCommonSkills", async (req, res) => {

  try {
    console.log("req", req);
    const departmentName = req.replace(/\s|&/g, ""); // Extract department name from query parameters

    //  aggregation pipeline 
    const pipeline = [
      {
        $match: { department: departmentName } // Match documents with the specified department
      },
      {
        $unwind: "$skills" // Unwind the skills array
      },
      {
        $group: {
          _id: { department: "$department", skill: "$skills" }, // Group by department and skill
          count: { $sum: 1 } // Count occurrences of each skill in the department
        }
      },
      {
        $sort: { count: -1 } // Sort by count in descending order
      },
      {
        $group: {
          _id: "$_id.department", // Group by department
          mostCommonSkills: { $push: { skill: "$_id.skill", count: "$count" } } // Push the most common skills into an array
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          department: "$_id", // Rename _id to department
          mostCommonSkills: { $slice: ["$mostCommonSkills", 5] } // Limit to the top 5 most common skills
        }
      }
    ];

    const jobsData = await Job.aggregate(pipeline);
    res.json(jobsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
