const fs = require("fs");
const mongoose = require("mongoose");

// Replace with your connection string and collection name
// const uri =  "mongodb+srv://sinthiaahmed904:p%+chvYZ4+tC_$2@cluster0.nyc5ntk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri =
  "mongodb+srv://kim:DgAMaFq6tR2HyYuB@cluster0.nyc5ntk.mongodb.net/?retryWrites=true&w=majority";

const collectionName = "job_postings";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting:", err));

fs.readFile("Main-Demo.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
  } else {
    const jsonData = JSON.parse(data);
    const model = mongoose.model(
      collectionName,
      new mongoose.Schema({
        /* define schema if needed */
      })
    );

    // Insert each document from jsonData into the collection using model.insertMany() or a loop
    model.insertMany(jsonData, (err, result) => {
      if (err) {
        console.error("Error importing data:", err);
      } else {
        console.log("Data imported successfully!");
      }
      mongoose.connection.close();
    });
  }
});
