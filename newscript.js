(async () => {
    // Fetch department data
    const departments = await d3.json("http://localhost:3000/departments");
  
    // Define width and height
    const width = 960;
    const height = 600;
  
    // Create a path generator
    const path = d3.geoPath()
      .projection(null);
  
    // Create an SVG element
    const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // Append an empty option as default state for department
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
  
    // Fetch map data from departments
    d3.json("http://localhost:3000/departments", function(error, mapData) {
      if (error) return console.error(error);
  
      // Append path to SVG
      svg.append("path")
        .datum(mapData)
        .attr("d", path);
    });
  })();
  