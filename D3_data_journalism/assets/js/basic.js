// // You need to create a scatter plot between two of the data variables such as
// `Healthcare vs. Poverty` or `Smokers vs. Age`.

// // Using the D3 techniques we taught you in class,
// create a scatter plot that represents each state with circle elements.
// You'll code this graphic in the `app.js` file of your homework directory—make sure
// you pull in the data from `data.csv` by using the `d3.csv` function.
// Your scatter plot should ultimately appear like the image at the top of this section.

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Chart AREA
    var svgWidth = 800;
    var svgHeight = 600;

    // Margins
    var margin = {
        top: 20,
        right: 100,
        bottom: 100,
        left: 100
    };

    // Set up actual chart dimensions, reference margins
    var chart_width = svgWidth - margin.left - margin.right;
    var chart_height = svgHeight - margin.top - margin.bottom;

    // Using d3, reference html line 22, scatter
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append group element
    var chart_group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Pull in the data from `data.csv` by using the `d3.csv` function
    d3.csv('./assets/data/data.csv').then(function (health_data) {
        console.log(health_data);

        // Parse data
        health_data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        });

        // Create scales
        // +2 to domain to match sample
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(health_data, d => d.poverty) + 2])
            .range([0, chart_width]);

        var yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(health_data, d => d.healthcare) + 2])
            .range([chart_height, 0]);

        // Create axes
        // Set tick values to match sample
        var xAxis = d3.axisBottom(xLinearScale).tickValues([10, 12, 14, 16, 18, 20, 22]);
        var yAxis = d3.axisLeft(yLinearScale).tickValues([6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26]);

        // Append axes
        chart_group.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(xAxis);

        chart_group.append("g")
            .call(yAxis);

        // `Healthcare vs. Poverty`
        // Append circles
        var circlesGrp = chart_group.selectAll("circle")
            .data(health_data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "lightblue")
            .attr("opacity", "1");

        // * Create and situate your axes and labels to the left and bottom of the chart.
        // x-axis label
        chart_group.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 15})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "black")
            .attr("font-weight", "500")
            .text("In Poverty (%)");

        // y-axis label
        chart_group.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 2 + margin.top))
            .attr("dy", "1em")
            .attr("font-size", "16px")
            .attr("font-weight", "500")
            .classed("axis-text", true)
            .text("Lacks Healthcare (%)");

        // * Include state abbreviations in the circles.
        var circlesGroup = chart_group.selectAll("label")
            .data(health_data)
            .enter()
            .append("text")
            .attr("font-size", "8px")
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr("font-weight", "500")
            .attr("dominant-baseline", "central")
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("x", d => xLinearScale(d.poverty))
            .classed("state-abbr", true)
            .text(d => d.abbr);

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                return (`Poverty: ${(d.poverty)}%<br>Healthcare ${(d.healthcare)}%`);
            });

        // Step 2: Create the tooltip in chartGroup.
        chart_group.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function (d) {
                toolTip.show(d, this);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function (d) {
                toolTip.hide(d);
            });
    }).catch(function (error) {
        console.log(error);
    });

}
// Run function on load
makeResponsive();

// Tried looking for dynamic resize based on window on bootstrap
// Also tried looking for dynamic d3 chart on window resize
// This is the only thing I could come up with close to what's shown in gif
// I could only get it to work when resizing from inspector window
window.addEventListener('resize', makeResponsive);