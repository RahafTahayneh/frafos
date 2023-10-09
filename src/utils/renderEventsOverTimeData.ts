import * as d3 from "d3";
import { EventsOverTimeType } from "../types";
import { DateRangeFilterType } from "../types/dateFilterTypes";

export function renderEventsOverTimeGraph(
  data: EventsOverTimeType[],
  selectedFilter: DateRangeFilterType
) {
  const svg = d3.select("#eventsOverTimeSVG");
  svg.selectAll("*").remove();

  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(["call-attempt", "call-start", "call-end"])
    .range(["rgb(245, 130, 49)", "rgb(97, 190, 226)", "rgb(88, 169, 89)"]);

  const margin = { top: 20, right: 35, bottom: 50, left: 50 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const legendData = colorScale.domain();

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

  const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  const calculatedWidth = (width / data.length) * 0.8;
  const barWidth = Math.min(calculatedWidth, 32);

  const maxCount = d3.max(data, (d) => d.doc_count) || 1;
  const y = d3.scaleLinear().domain([0, maxCount]).range([height, 0]).nice(4);

  const xAxis = d3
    .axisBottom<Date>(x)
    .tickFormat(d3.timeFormat(timeFormat) as (d: Date) => string);

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
    .attr("x", (d) => x(new Date(d.key_as_string)) - barWidth / 2) // centering the bar
    .attr("y", height) // Start at the bottom of the chart
    .attr("width", barWidth)
    .attr("height", 0) // Start with a height of 0
    .attr("fill", (d) => colorScale(d.type)) // Color bars based on event type
    .on("mouseover", function (event, d) {
      d3.select("#tooltip-events-over-time")
        .style("visibility", "visible")
        .style("display", "inline-block")
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px")
        .html(
          `<strong>Date:</strong> ${d.key_as_string}<br><strong>Count:</strong> ${d.doc_count}`
        );
    })
    .on("mouseout", function () {
      d3.select("#tooltip-events-over-time")
        .style("visibility", "hidden")
        .style("display", "none");
    })
    .transition() // Apply a transition to the bars
    .duration(800) // Transition duration in milliseconds
    .ease(d3.easeCubicInOut) // Use a cubic easing function for smoother transitions
    .delay((d, i) => i * 50) // Add a staggered delay for each bar
    .attr("y", (d) => y(d.doc_count)) // Animate to the final y position
    .attr("height", (d) => height - y(d.doc_count)); // Animate the height to its final value

  // Define the spacing and size for legend items
  const legendRectSize = 10; // defines the size of the colored squares in legend
  const legendSpacing = 4; // defines spacing between squares

  // Create a group for the legend items
  const legend = svg
    .selectAll(".legend")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => {
      const height = legendRectSize + legendSpacing;
      const horz = width + margin.left - legendRectSize - 50; // modified horizontal position
      const vert = i * height + legendSpacing; // modified vertical position
      return `translate(${horz},${vert})`;
    });

  // Add the colored rectangles
  legend
    .append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", colorScale)
    .style("stroke", colorScale);

  // Add the text labels
  legend
    .append("text")
    .style("font-size", 11)
    .attr("x", legendRectSize + legendSpacing) // position to the right of the colored rectangles
    .attr("y", legendRectSize / 2) // vertically center the text
    .attr("dy", "0.35em") // adjust to align the middle of the text with the middle of the colored rectangles
    .text((d) => d);
}
