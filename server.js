function aggregateLocations(jobs) {
    const locationMap = {};
  
    for (const job of jobs) {
      const location = `${job.city}, ${job.state}`;
      locationMap[location] = (locationMap[location] || 0) + 1; // Count jobs per location
    }
  
    // Convert the map to an array for easier use in visualization
    const locationData = Object.entries(locationMap).map(([location, count]) => ({ location, count }));
  
    return locationData;
  }

  function aggregateSkills(jobs) {
    const skillMap = {};
  
    for (const job of jobs) {
      if (job.skills) { // Check if skills exist for the job
        for (const skill of job.skills) {
          skillMap[skill] = (skillMap[skill] || 0) + 1; // Count occurrences of each skill
        }
      }
    }
  
    // Sort skills by count in descending order
    const skills = Object.entries(skillMap).sort((a, b) => b[1] - a[1]);
  
    // Select top N skills (adjust N as needed)
    const topSkills = skills.slice(0, 10); // Choose top 10 skills (replace 10 with your desired number)
  
    return topSkills;
  }

  function aggregateDepartments(jobs) {
    const departmentMap = {};
  
    for (const job of jobs) {
      const department = job.department;
      const employmentType = job.employmenttype_jobstatus;
  
      departmentMap[department] = departmentMap[department] || {};
      departmentMap[department][employmentType] = (departmentMap[department][employmentType] || 0) + 1;
    }
  
    // Convert the map to an array for easier use in visualization
    const departmentData = Object.entries(departmentMap).map(([department, employmentTypes]) => ({
      department,
      employmentTypes: Object.entries(employmentTypes).map(([type, count]) => ({ type, count }))
    }));
  
    return departmentData;
  }