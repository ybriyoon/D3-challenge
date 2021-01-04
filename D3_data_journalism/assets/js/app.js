// @TODO: YOUR CODE HERE!
//width, height, margin
var width = 800;
var height = 500;
var margin = {
  top: 50,
  right: 50,
  bottom: 80,
  left: 80
};

// chart dimension
var c_width = width - margin.right - margin.left;
var c_height = height - margin.top - margin.bottom;

// graph profile
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Append a group area, then set its margins
var chartgroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load csv data
d3.csv("assets/data/data.csv")
  .then(function(statedata) {
      console.log(statedata);

// Convert each value to a number
statedata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
});

var xscale = d3.scaleLinear().domain([d3.min(statedata, d => d.healthcare) * 1.5,d3.max(statedata, d => d.poverty) * 1.2])
.range([0, c_width]);

var yscale = d3.scaleLinear().domain([0, d3.max(statedata, d => d.healthcare * 1.2)])
.range([c_height, 0]);

// axis
var bottomaxis = d3.axisBottom(xscale);
var leftaxis = d3.axisLeft(yscale);

chartgroup.append("g").attr("transform", `translate(0, ${c_height})`).call(bottomaxis);
chartgroup.append("g").call(leftaxis);

//circles
var circles = chartgroup.selectAll("g circle").data(statedata);
var r = 8;
var plot = circles.enter().append("g").attr("id", "plot");

plot
  .append("circle")
  .attr("cx", d => xscale(d.poverty))
  .attr("cy", d => yscale(d.healthcare))
  .attr("r", r)
  .classed("stateCircle", true);

plot
  .append("text")
  .attr("x", d => xscale(d.poverty))
  .attr("y", d => yscale(d.healthcare))
  .classed("stateText", true)
  .text(d => d.abbr)
  .attr("font-size", r * 0.9);

var toolTip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([40, -20])
  .html(function(d) {
      return `${d.state}<br>Poverty: ${d.poverty}% <br>Lacks Healthcare: ${d.healthcare}%`;
});

svg.call(toolTip);

plot.on("mouseover", function(data) {
    toolTip.show(data, this);}).on("mouseout", function(data, index) {
    toolTip.hide(data);
});

// labels
chartgroup
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (c_height - 100))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare(%)");

chartgroup
  .append("text")
  .attr("transform",`translate(${c_width / 2}, ${c_height + margin.top - 10})`)
  .attr("class", "axisText")
  .text("In Poverty(%)");
});