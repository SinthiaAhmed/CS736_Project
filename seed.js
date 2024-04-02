const mongoose = require("mongoose");
const Job = require("./jobSchema");
const fs = require("fs");
const path = require("path");

// MongoDB connection URI
const uri =
  "mongodb+srv://kim:DgAMaFq6tR2HyYuB@cluster0.nyc5ntk.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Read the JSON file
    const data = fs.readFileSync(
      path.resolve(__dirname, "Main-Demo.json"),
      "utf8"
    );
    const jobs = JSON.parse(data);

    // Insert data into MongoDB
    Job.insertMany(jobs)
      .then(() => {
        console.log("Data inserted successfully");
        mongoose.disconnect();
      })
      .catch((err) => {
        console.error("Error inserting data:", err);
        mongoose.disconnect();
      });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
