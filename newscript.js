(async () => {
    // Step 1. Load the US map data.
    const us = await d3.json("https://d3js.org/us-10m.v2.json");
    const data = topojson.feature(us, us.objects.states).features;

    // Map of state names to their abbreviations
    const stateAbbreviations = {
        "Texas": "TX",
        "Arizona": "AZ",
        "Louisiana": "LA",
        "Idaho": "ID",
        "Minnesota": "MN",
        "North Dakota": "ND",
        "South Dakota": "SD",
        "New York": "NY",
        "Alaska": "AK",
        "Georgia": "GA",
        "Indiana": "IN",
        "Michigan": "MI",
        "Mississippi": "MS",
        "Ohio": "OH",
        "Nebraska": "NE",
        "Colorado": "CO",
        "Maryland": "MD",
        "Kansas": "KS",
        "Illinois": "IL",
        "Wisconsin": "WI",
        "California": "CA",
        "Iowa": "IA",
        "Pennsylvania": "PA",
        "Montana": "MT",
        "Missouri": "MO",
        "Florida": "FL",
        "Kentucky": "KY",
        "Maine": "ME",
        "Utah": "UT",
        "Oklahoma": "OK",
        "Tennessee": "TN",
        "Oregon": "OR",
        "West Virginia": "WV",
        "Arkansas": "AR",
        "Washington": "WA",
        "North Carolina": "NC",
        "Virginia": "VA",
        "Wyoming": "WY",
        "Alabama": "AL",
        "South Carolina": "SC",
        "New Mexico": "NM",
        "New Hampshire": "NH",
        "Vermont": "VT",
        "Nevada": "NV",
        "Hawaii": "HI",
        "Massachusetts": "MA",
        "Rhode Island": "RI",
        "New Jersey": "NJ",
        "Delaware": "DE",
        "Connecticut": "CT",
        "District of Columbia": "DC"
    };



    // Step 2. Draw the SVG.
    const width = 960;
    const height = 600;
    const svg = d3.select("#mapContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create an instance of geoPath.
    const path = d3.geoPath();

    // Use the path to plot the US map based on the geometry data.
    svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", (d) => d.properties.name.replace(/\s/g, ""))
        .style("fill", "lightgray")
        .style("stroke", "darkgray") // Border color
        .style("stroke-width", 1); // Border width;

    // Add text for state initials
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => path.centroid(d)[0])
        .attr("y", (d) => path.centroid(d)[1])
        .text((d) => {
            const stateName = d.properties.name;
            return stateAbbreviations[stateName] || stateName.substring(0, 2);
        });

    // Step 3. Add filters for department, employment type, and skill
    const departments = await d3.json("http://localhost:3000/departments");

    const departmentDropdown = d3.select("#departmentDropdown");
    departmentDropdown.append("option")
        .attr("value", "")
        .text("All"); // Set initial option to "All"
    departmentDropdown.selectAll("option:not(:first-child)")
        .data(departments)
        .enter()
        .append("option")
        .attr("value", (d) => d.replace(/\s|&/g, ""))
        .text((d) => d);


    // Initially load all employment types
    const allEmploymentTypes = await d3.json("http://localhost:3000/employmenttypes");

    // Append options to employment type dropdown
    const employmentTypeDropdown = d3.select("#employmentTypeDropdown");
    employmentTypeDropdown.append("option")
        .attr("value", "")
        .text("All"); // Set initial option to "All"
    employmentTypeDropdown.selectAll("option:not(:first-child)")
        .data(allEmploymentTypes)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d);

    // Step 4. Populating circles based on the count of employment type in each state
    const updateMap = async () => {
        const selectedDepartment = departmentDropdown.property("value") || "All"; // Get the selected department
        const selectedEmploymentType = employmentTypeDropdown.property("value") || "All"; // Get the selected employment type

        // Fetch data based on selected department and employment type
        jobsData = await d3.json(`http://localhost:3000/jobs/groupedDepartments?department=${selectedDepartment}&employmentType=${selectedEmploymentType}`);


        // Remove existing circles
        svg.selectAll(".bubble").remove();

        // Filter jobsData based on selected department and employment type
        let filteredJobsData;

        if (selectedDepartment === "All" && selectedEmploymentType === "All") {
            // If both department and employment type are "All", return all jobs
            filteredJobsData = jobsData;
        } else if (selectedEmploymentType === "All") {
            // If only employment type is "All", filter by department
            if (selectedDepartment !== "All") {
                filteredJobsData = jobsData.filter(job => job.department.replace(/\s|&/g, "") === selectedDepartment);
            } else {
                filteredJobsData = jobsData;
            }
        } else {
            // If employment type is specific, filter by both department and employment type
            if (selectedDepartment !== "All") {
                filteredJobsData = jobsData.filter(job => job.department.replace(/\s|&/g, "") === selectedDepartment && job.employmentType === selectedEmploymentType);
            } else {
                filteredJobsData = jobsData.filter(job => job.employmentType === selectedEmploymentType);
            }
        }

        const colorScale = d3.scaleOrdinal()
            .domain(departments) // Use the list of departments as the domain for the color scale
            .range(d3.schemeCategory10); // Use D3's categorical color scheme for colors

        // Iterate through each state
        // Append circles to the SVG
        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.states).features)
            .enter()
            .selectAll("circle") // Nest selection for each state
            .data((d) => {
                const stateName = d.properties.name;
                const stateAbbreviation = stateAbbreviations[stateName];
                // Find the corresponding data points for the current state based on state abbreviation
                const stateData = filteredJobsData.filter((job) => job.state === stateAbbreviation);

                return stateData.map((employmentType) => ({ state: d, employmentType: employmentType }));
            })
            .enter()
            .append("circle")
            .attr("transform", function (d) {
                return "translate(" + path.centroid(d.state) + ")";
            })
            .attr("r", (d) => {
                // Use square root of count for balanced radius
                return Math.sqrt(d.employmentType.count) * 4;
            })
            .style("fill", (d) => colorScale(d.employmentType.department)) // Assign color based on department
            .style("opacity", 0.5) // Set opacity to distinguish overlapping bubbles
            .on("click", (d, event ) => {
                console.log(d);
                // Handle click event on circles
                // Extract relevant details from 'd' and display them in a separate container
                const detailsContainer = document.getElementById("detailsContainer");
                detailsContainer.innerHTML = `
                 <h2>${d.employmentType.department}</h2>
                 <p>State: ${d.state.properties.name}</p>
                 <p>Employment Type: ${d.employmentType.employmentType}</p>
                 <p> ${d}</p>
             `;
            });
    };


    // Bind change event listeners to department and employment type dropdowns
    departmentDropdown.on("change", async () => {
        const selectedDepartment = departmentDropdown.property("value") || "All";
        const newEmploymentTypes = await d3.json(`http://localhost:3000/employmenttypes?department=${selectedDepartment}`);

        // Update employment type dropdown options based on the selected department
        employmentTypeDropdown.selectAll("option")
            .remove();
        employmentTypeDropdown.append("option")
            .attr("value", "")
            .text("All");
        employmentTypeDropdown.selectAll("option:not(:first-child)")
            .data(newEmploymentTypes)
            .enter()
            .append("option")
            .attr("value", (d) => d)
            .text((d) => d);

        // Update the map
        updateMap();
    });

    employmentTypeDropdown.on("change", updateMap);

    // Initially load map with "All" selected
    updateMap();

})();
