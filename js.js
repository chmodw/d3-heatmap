const margin = { top: 50, right: 70, bottom: 50, left: 80 };
const width = 1800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chart = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => {
    const years = d3.map(data.monthlyVariance, (d) => d.year);
    const months = d3.map(data.monthlyVariance, (d) => d.month);
    const temps = data.monthlyVariance.map(
      (d) => data.baseTemperature + d.variance
    );

    // adding x and y axis
    let xAxis = d3.scaleBand().range([0, width]).domain(years);

    chart
      .append("g")
      .style("font-size", 12)
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom(xAxis)
          .tickValues(xAxis.domain().filter((d) => d % 10 === 0))
      )
      .attr("id", "x-axis");

    let yAxis = d3.scaleBand().range([height, 0]).domain(months);
    chart
      .append("g")
      .style("font-size", 12)
      .call(d3.axisLeft(yAxis).tickFormat((d) => monthNames[d - 1]))
      .attr("id", "y-axis");

    // Adding the data to the chart
    chart
      .selectAll()
      .data(data.monthlyVariance, (d) => d.year + ":" + d.month)
      .enter()
      .append("rect")
      .attr("data-month", (d) => d.month)
      .attr("data-year", (d) => d.month)
      .attr("data-temp", (d) => data.baseTemperature + d.variance)
      .attr("class", "cell")
      .attr("x", (d) => xAxis(d.year))
      .attr("y", (d) => yAxis(d.month))
      .attr("width", xAxis.bandwidth())
      .attr("height", yAxis.bandwidth())
      .style("fill", (d) => colorSelect(data.baseTemperature + d.variance))
      .on("mouseover", (e, d) => {
        // d3.select(this).style("stroke", "black");
        d3.select("#tooltip")
          .style("opacity", 1)
          .style("top", yAxis(d.month) + 75 + "px")
          .style("left", xAxis(d.year) + 50 + "px");

        d3.select("#tooltip-year").text(d.year);
        d3.select("#tooltip-month").text(d.month);
        d3.select("#tooltip-temp").text(
          Number(Math.round(data.baseTemperature + d.variance + "e1") + "e-1")
        );
        d3.select("#tooltip-variance").text(
          Number(Math.round(d.variance + "e1") + "e-1")
        );
      })
      .on("mouseleave", (e, d) => {
        d3.select("#tooltip").style("opacity", 0);
      });

    // adding the years and base temp to the title
    d3.select("#start-year").text(d3.min(years));
    d3.select("#end-year").text(d3.max(years));
    d3.select("#base-temp").text(data.baseTemperature);
  })
  .catch((error) => {
    if (error) throw error;
  });

function colorSelect(temp) {
  let colors = [
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
  ];
  if (temp < 3.9) return colors[0];
  if (temp < 5.0) return colors[1];
  if (temp < 6.1) return colors[2];
  if (temp < 7.2) return colors[3];
  if (temp < 8.3) return colors[4];
  if (temp < 9.5) return colors[5];
  if (temp < 10.6) return colors[6];
  if (temp < 11.7) return colors[7];
  if (temp > 11.7) return colors[8];
}
