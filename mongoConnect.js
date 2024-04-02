const mongoose = require("mongoose");

const uri =
  "mongodb+srv://kim:DgAMaFq6tR2HyYuB@cluster0.nyc5ntk.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));
