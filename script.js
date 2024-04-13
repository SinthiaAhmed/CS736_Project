(async () => {
    // Step 4. Add filters for department, employment type, and skill
    const departments = await d3.json("http://localhost:3000/departments");
    const employmentTypes = await d3.json("http://localhost:3000/employmenttypes");
  
    // Load the US map data
    const us = await d3.json("https://d3js.org/us-10m.v2.json");
    // Convert TopoJSON to GeoJSON
    const data = topojson.feature(us, us.objects.states).features;
  
    // Draw the SVG container
    const width = 960;
    const height = 600;
    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
  
    // Create a projection
    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(1000);
  
    // Create a path generator
    const path = d3.geoPath().projection(projection);
  
    // Plot the map
    svg.selectAll("path")
      .data(data)
      .enter().append("path")
        .attr("d", path);
  
    // Step 5. Populating circles based on the count of employment type in each state
    const jobsData = await d3.json("http://localhost:3000/jobs/groupedEmploymentType");
  
    svg
      .append("g")
      .attr("class", "bubble")
      .selectAll("circle")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("circle")
      .attr("transform", function (d) {
        const centroid = path.centroid(d);
        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
          return "translate(0,0)"; // Handle NaN values gracefully
        }
        return "translate(" + centroid + ")";
      })
      .attr("r", (d) => {
        const stateData = jobsData.find(
          (job) => job._id.state === d.properties.name.replace(/\s/g, "")
        );
        return stateData ? Math.sqrt(stateData.count) * 2 : 0;
      });
  
    // Add an empty option as the default (not selected) state for department
    d3.select("#department")
      .append("option")
      .attr("value", "")
      .text("Select");
  
    // Append department options
    d3.select("#department")
      .selectAll("option:not(:first-child)")
      .data(departments)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);
  
    // Add an empty option as the default (not selected) state for employment type
    d3.select("#employmentType")
      .append("option")
      .attr("value", "")
      .text("Select");
  
    // Append employment type options
    d3.select("#employmentType")
      .selectAll("option:not(:first-child)")
      .data(employmentTypes)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);
  })();
  