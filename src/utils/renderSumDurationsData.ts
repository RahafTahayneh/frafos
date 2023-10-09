import * as d3 from "d3";
import { SumOverTimeType } from "../types";
import { DateRangeFilterType } from "../types/dateFilterTypes";

export function renderSumOverTimeData(
  data: SumOverTimeType[],
  selectedFilter: DateRangeFilterType
) {
  const svg = d3.select("#sumOverTimeSVG");
  svg.selectAll("*").remove();

  const margin = { top: 20, right: 35, bottom: 50, left: 50 };
  const svgWidth =
    (svg.node() as SVGElement)?.getBoundingClientRect().width || 600;
  // Default to 600 if width cannot be determined
  const width = svgWidth - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  let minDate: Date;
  let maxDate: Date = new Date();
  let timeFormat: string;

  switch (selectedFilter) {
    case "last-5-mins":
      minDate = new Date(maxDate.getTime() - 5 * 60 * 1000);
      timeFormat = "%H:%M:%S";
      break;
    case "last-1-hour":
      minDate = new Date(maxDate.getTime() - 60 * 60 * 1000);
      timeFormat = "%H:%M";
      break;
    case "last-6-hours":
      minDate = new Date(maxDate.getTime() - 6 * 60 * 60 * 1000);
      timeFormat = "%H:%M";
      break;
    case "last-12-hours":
      minDate = new Date(maxDate.getTime() - 12 * 60 * 60 * 1000);
      timeFormat = "%H:%M";
      break;
    case "today":
      minDate = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate(),
        0,
        0,
        0
      );
      timeFormat = "%H:%M";
      break;
    case "yesterday":
      minDate = new Date(maxDate.getTime() - 48 * 60 * 60 * 1000);
      timeFormat = "%d %b %H:%M";
      break;
    case "last-week":
      minDate = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFormat = "%d %b %H:%M";
      break;
    default:
      throw new Error(`Unknown filter: ${selectedFilter}`);
  }

  // Set scales
  const idealPixelSpacing = 100;
  const numberOfTicks = Math.floor(width / idealPixelSpacing);
  const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  const calculatedWidth = (width / data.length) * 0.8;
  const barWidth = Math.min(calculatedWidth, 32);

  const maxCount = d3.max(data, (d) => d.time) || 1;
  const y = d3.scaleLinear().domain([0, maxCount]).range([height, 0]).nice(4);

  const xAxis = d3
    .axisBottom(x)
    .ticks(numberOfTicks)
    .tickFormat(d3.timeFormat(timeFormat) as any);

  const yAxis = d3.axisLeft(y).ticks(4);

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle");

  g.append("g").call(yAxis);

  // Add bars
  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", "rgb(255, 198, 88)")
    .attr("x", (d) => x(new Date(d.key_as_string)) - barWidth / 2) // centering the bar
    .attr("y", height) // Start at the bottom of the chart
    .attr("width", barWidth)
    .attr("height", 0) // Start with a height of 0
    .on("mouseover", function (event, d) {
      d3.select("#tooltip-sum-over-time")
        .style("visibility", "visible")
        .style("display", "inline-block")
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px")
        .html(
          `<strong>Date:</strong> ${d.key_as_string}<br><strong>Count:</strong> ${d.time} min`
        );
    })
    .on("mouseout", function () {
      d3.select("#tooltip-sum-over-time")
        .style("visibility", "hidden")
        .style("display", "none");
    })
    .transition() // Apply a transition to the bars
    .duration(800) // Transition duration in milliseconds
    .ease(d3.easeCubicInOut) // Use a cubic easing function for smoother transitions
    .delay((d, i) => i * 50) // Add a staggered delay for each bar
    .attr("y", (d) => y(d.time)) // Animate to the final y position
    .attr("height", (d) => height - y(d.time)); // Animate the height to its final value
}
