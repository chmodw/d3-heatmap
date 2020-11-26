const margin = { top: 50, right: 70, bottom: 50, left: 80 };
const width = 980 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const legendHeight = 100;

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
  .attr("height", height + margin.top + margin.bottom + legendHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((data) => {
    const years = d3.map(data.monthlyVariance, (d) => d.year);
    const months = d3.map(data.monthlyVariance, (d) => d.month);

    // adding the years and base temp to the title
    d3.select("#start-year").text(d3.min(years));
    d3.select("#end-year").text(d3.max(years));
    d3.select("#base-temp").text(data.baseTemperature);

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

    // generating the color band
    const minTemp = d3.min(
      data.monthlyVariance.map((item) => data.baseTemperature + item.variance)
    );

    const maxTemp = d3.max(
      data.monthlyVariance.map((item) => data.baseTemperature + item.variance)
    );

    const colors = d3
      .scaleThreshold()
      .domain(
        ((min, max, count) => {
          let array = [];
          let step = (max - min) / count;
          let base = min;
          for (let i = 1; i < count; i++) {
            array.push(base + i * step);
          }
          return array;
        })(minTemp, maxTemp, colorbrewer.RdYlBu[11].length)
      )
      .range(colorbrewer.RdYlBu[11].reverse());

    // add 1.1 to the min until the max
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
      .style("fill", (d) => colors(data.baseTemperature + d.variance))
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

    var legendX = d3.scaleLinear().domain([minTemp, maxTemp]).range([0, 250]);

    var legendXAxis = d3
      .axisBottom()
      .scale(legendX)
      .tickSize(10, 0)
      .tickValues(colors.domain())
      .tickFormat(d3.format(".1f"));

    var legend = d3.select("#legend");

    legend
      .append("g")
      .selectAll("rect")
      .data(
        colors.range().map(function (color) {
          var d = colors.invertExtent(color);
          if (d[0] === null) {
            d[0] = legendX.domain()[0];
          }
          if (d[1] === null) {
            d[1] = legendX.domain()[1];
          }
          return d;
        })
      )
      .enter()
      .append("rect")
      .style("fill", function (d) {
        return colors(d[0]);
      })
      .attr({
        x: function (d) {
          return legendX(d[0]);
        },
        y: 0,
        width: function (d) {
          return legendX(d[1]) - legendX(d[0]);
        },
        height: legendHeight,
      });

    legend.append("g").call(legendXAxis);
  })
  .catch((error) => {
    if (error) throw error;
  });
