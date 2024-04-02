const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  employmenttype_jobstatus: String,
  jobdescription: String,
  joblocation_address: String,
  city: String,
  state: String,
  jobtitle: String,
  department: String,
  skills: String,
  uniq_id: String,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
