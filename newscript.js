(async () => {
    // Step 2. Load the US map data.
    const us = await d3.json("https://d3js.org/us-10m.v2.json");
    const data = topojson.feature(us, us.objects.states).features;

    // Step 3. Draw the SVG.
    // First let's create an empty SVG with 960px width and 600px height.
    const width = 960;
    const height = 600;
    const svg = d3
      .select("#mapContainer")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create an instance of geoPath.
    const path = d3.geoPath();
    // console.log("path", path);

    // Use the path to plot the US map based on the geometry data.
    svg
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => d.properties.name.replace(/\s/g, ""))
      .style("fill", "lightgray")
      .style("stroke", "black") // Border color
      .style("stroke-width", 1); // Border width;

    // Add text for state initials
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .text((d) => d.properties.name.substring(0, 2));

    // Step 4. Add filters for department, employment type, and skill
    const departments = await d3.json("http://localhost:3000/departments");
    const employmentTypes = await d3.json("http://localhost:3000/employmenttypes");

    d3.select("#departmentDropdown")
      .append("option")
      .attr("value", "")
      .text("Select");

    // Append department options
    d3.select("#departmentDropdown")
      .selectAll("option:not(:first-child)")
      .data(departments)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Add an empty option as the default (not selected) state
    d3.select("#employmentTypeDropdown")
      .append("option")
      .attr("value", "")
      .text("Select");

    // Append employment type options
    d3.select("#employmentTypeDropdown")
      .selectAll("option:not(:first-child)")
      .data(employmentTypes)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Step 5. Populating circles based on the count of employment type in each state
    const jobsData = await d3.json("http://localhost:3000/jobs/groupedEmploymentType");

    // Iterate through each state
    svg.append("g")
      .attr("class", "bubble")
      .selectAll("circle")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .selectAll("circle") // Nest selection for each state
      .data((d) => {
        console.log("d", d.properties.name, d.properties.name.substring(0, 2).toUpperCase());
        // Find the corresponding data points for the current state based on state abbreviation
        const stateData = jobsData.filter((job) => job.state === d.properties.name.substring(0, 2).toUpperCase());
        console.log("stateData", stateData);
        return stateData.map((employmentType) => ({ state: d, employmentType: employmentType }));
      })
      .enter()
      .append("circle")
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d.state) + ")";
      })
      .attr("r", (d) => {
        // Use square root of count for balanced radius
        return Math.sqrt(d.employmentType.count) * 2;
      })
      .style("fill", "steelblue") // You can set different colors for each employment type
      .style("opacity", 0.5); // Set opacity to distinguish overlapping bubbles
})();
