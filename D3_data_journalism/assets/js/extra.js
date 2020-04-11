// Using the D3 techniques we taught you in class,
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

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

  // Function used for updating x-scale and y-scale var upon click on axis label
  function xScale(health_data, chosenXAxis) {
    // Create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(health_data, d => d[chosenXAxis]) * 0.8,
        d3.max(health_data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, chart_width]);
    return xLinearScale;
  }

  function yScale(health_data, chosenYAxis) {
    // Create Scale Functions for the Chart (chosenYAxis)
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(health_data, d => d[chosenYAxis]) * 0.8,
        d3.max(health_data, d => d[chosenYAxis]) * 1.2
      ])
      .range([chart_height, 0]);
    return yLinearScale;
  }

  // Function used for updating xAxis and yAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  // Function used for updating circles group with a transition to
  // new text
  function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");

    return textGroup;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    var xLabel;
    var ylabel;

    if (chosenXAxis === "poverty") {
      var xLabel = "In Poverty";
    } else if (chosenXAxis === "age") {
      var xLabel = "Age";
    } else {
      var xLabel = "Household Income";
    }
    if (chosenYAxis === "healthcare") {
      var yLabel = "Lacks Healthcare";
    } else if (chosenYAxis === "smokes") {
      var yLabel = "Smokes";
    } else {
      var yLabel = "Obese";
    }

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 120])

      .html(function (d) {

        if (chosenXAxis === "poverty") {
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>${d[chosenXAxis]}%<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        } else if (chosenXAxis === "age") {
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>${d[chosenXAxis]} years old<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        } else {
          //     var formatComma = d3.format(","),
          // formatDecimal = d3.format(".1f"), 
          // formatDecimalComma = d3.format(",.2f"),
          // formatSuffix = d3.format("s"),
          // formatSuffixDecimal1 = d3.format(".1s"),
          // formatSuffixDecimal2 = d3.format(".2s"),
          // formatMoney = function(d) { return "$" + formatDecimalComma(d); },
          // formatPercent = d3.format(",.2%")
          //     var number = d[chosenXAxis];
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>$${d[chosenXAxis]}.00<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        }
        if (chosenYAxis === "healthcare") {
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>${d[chosenXAxis]}%<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        } else if (chosenYAxis === "smokes") {
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>${d[chosenXAxis]}%<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        } else {
          return (`<strong>${d.abbr}</strong><br>${xLabel}<br>${d[chosenXAxis]}%<br><br>${yLabel}<br>${d[chosenYAxis]}%`);
        }

      });

    // Step 2: Create the tooltip in circlesGroup.
    circlesGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function (d) {
        toolTip.hide(d);
      });

    return circlesGroup;

  };

  // Pull in the data from `data.csv` by using the `d3.csv` function
  d3.csv('./D3_data_journalism/assets/data/data.csv').then(function (health_data, err) {
    if (err) throw err;
    //console.log(health_data);

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
    var xLinearScale = xScale(health_data, chosenXAxis);
    var yLinearScale = yScale(health_data, chosenYAxis);

    // Create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Append axes
    var xAxis = chart_group.append("g")
      .attr("transform", `translate(0, ${chart_height})`)
      .call(xAxis);

    var yAxis = chart_group.append("g")
      .call(yAxis);

    // Append circles 
    var circlesGroup = chart_group.selectAll("circle")
      .data(health_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", "1");

    // * Include state abbreviations in the circles.
    var textGroup = chart_group.selectAll("label")
      .data(health_data)
      .enter()
      .append("text")
      .attr("font-size", "8px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("font-weight", "600")
      .attr("dominant-baseline", "central")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      //.classed("state-abbr", true)
      .text(d => d.abbr);

    // Create group for 3 x-axis labels
    var xLabelsGroup = chart_group.append("g")
      .attr("transform", `translate(${chart_width / 2}, ${chart_height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    // Create group for 3 y-axis labels
    var yLabelsGroup = chart_group.append("g")
      .attr("transform", `translate(-25, ${chart_height / 2})`);

    var healthcareLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", 0)
      .attr("value", "healthcare") // value to grab for event listener
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .attr("value", "smokes") // value to grab for event listener
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", 0)
      .attr("value", "obesity") // value to grab for event listener
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;
          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(health_data, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new y values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function () {

        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenYAxis with value
          chosenYAxis = value;
          // console.log(chosenYAxis)

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(health_data, chosenYAxis);

          // Updates yAxis with Transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          // updates tooltips with new y values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          } else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
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
window.addEventListener('resize', drawChart);