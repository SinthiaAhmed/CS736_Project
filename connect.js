const mongoose = require('mongoose');

// Replace with your actual connection string
// const uri = "mongodb+srv://sinthiaahmed904:p%+chvYZ4+tC_$2@<cluster-name>.mongodb.net/test?retryWrites=true&w=majority";
const uri = "mongodb+srv://kim:DgAMaFq6tR2HyYuB@cluster0.nyc5ntk.mongodb.net/?retryWrites=true&w=majority";
// mongodb+srv://<username>:<password>@cluster0.nyc5ntk.mongodb.net/
// const uri = "mongodb+srv://kimeyaorin2:YUKErFtcorwh9EMO@cluster0.nyc5ntk.mongodb.net/mydatabase?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Error connecting:", err));

const Job = require('./models/Job'); // Assuming your model file

// Retrieve all jobs (or use specific queries for filtering)
Job.find({})
  .then(jobs => {
    // Now you have an array of job documents retrieved from MongoDB
    // Use this data for your D3.js visualizations and aggregation logic
    console.log(jobs); // This will log the retrieved documents for now
  })
  .catch(err => console.error("Error retrieving jobs:", err))
  .finally(() => mongoose.connection.close()); // Close connection after processing
