const margin = { top: 50, right: 70, bottom: 50, left: 80 };
const width = 1200 - margin.left - margin.right;
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

    var colors = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([d3.min(temps), d3.max(temps)]);

    // Adding the data to the chart
    chart
      .selectAll()
      .data(data.monthlyVariance, (d) => d.year + ":" + d.month)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => xAxis(d.year))
      .attr("y", (d) => yAxis(d.month))
      .attr("width", xAxis.bandwidth())
      .attr("height", yAxis.bandwidth())
      .style("fill", (d) => colors(data.baseTemperature + d.variance));
  })
  .catch((error) => {
    if (error) throw error;
  });
