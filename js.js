const margin = { top: 50, right: 50, bottom: 50, left: 30 };
const width = 960 - margin.left - margin.right - 80;
const height = 600 - margin.top - margin.bottom;

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
  .attr("width", width + margin.left + margin.right + 80)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => {
    const years = d3.map(data.monthlyVariance, (d) => d.year);
    const months = d3.map(data.monthlyVariance, (d) => d.month);

    // adding x and y axis
    let xAxis = d3
      .scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .domain(years);

    chart
      .append("g")
      .style("font-size", 12)
      .attr("transform", "translate(80," + height + ")")
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
      .attr("transform", "translate(80,0)")
      .call(d3.axisLeft(yAxis).tickFormat((d) => monthNames[d - 1]))
      .attr("id", "y-axis");
  })
  .catch((error) => {
    if (error) throw error;
  });
