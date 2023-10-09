import * as d3 from "d3";
import { ParallelRegsType } from "../types";
import { DateRangeFilterType } from "../types/dateFilterTypes";

export function renderParallelRegs(
  data: ParallelRegsType[],
  selectedFilter: DateRangeFilterType
) {
  const svgElement = document.getElementById("parallel-regs");
  if (!svgElement || !(svgElement instanceof SVGSVGElement)) {
    throw new Error(
      "The element with id 'parallel-calls' is not an SVG element or does not exist."
    );
  }
  const svg = d3.select(svgElement);
  svg.selectAll("*").remove();

  const staticHeight = parseFloat(svgElement.getAttribute("height") || "300");

  const margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = +svgElement.clientWidth - margin.left - margin.right,
    height = staticHeight - margin.top - margin.bottom;

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
  const idealPixelSpacing = 100;
  const numberOfTicks = Math.floor(width / idealPixelSpacing);

  const maxCount = d3.max(data, (d) => d.r_count);
  const y = d3
    .scaleLinear()
    .domain([0, maxCount || 5])
    .range([height, 0]);

  const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

  const line = d3
    .line<ParallelRegsType>()
    .x((d) => x(new Date(d.key_as_string)))
    .y((d) => y(d.r_count));

  const color = d3.scaleOrdinal(["rgb(165, 202, 71)", "rgb(202, 165, 71)"]); // Second color is just an example

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(y).tickValues([1, 2, 3, 4, 5]));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(numberOfTicks)
        .tickFormat(d3.timeFormat(timeFormat) as any)
    );

  const nestedData = d3.group(data, (d) => d.label);

  nestedData.forEach((values, label) => {
    svg
      .append("path")
      .datum(values)
      .attr("class", label)
      .attr("fill", "none")
      .attr("stroke", color(label))
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    values.forEach((entry) => {
      svg
        .append("circle")
        .attr("class", label)
        .attr("cx", x(new Date(entry.key_as_string)))
        .attr("cy", y(entry.r_count))
        .attr("r", 5)
        .attr("fill", color(label))
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .on("mouseover", function (event, d) {
          const tooltip = d3.select("#tooltip-parallel-regs");
          const formattedTime = d3.timeFormat("%d %b %H:%M")(
            new Date(entry.key_as_string)
          );

          tooltip.style("visibility", "visible");
          tooltip
            .select("#type")
            .html(`<b>Type:</b>  ${entry.r_count}  ${entry.label}`);
          tooltip.select("#time").html(`<b>Time:</b> ${formattedTime}`);
          tooltip.style("left", event.pageX + 10 + "px");
          tooltip.style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", function () {
          d3.select("#tooltip-parallel-calls").style("visibility", "hidden");
        });
    });
  });

  const uniqueLabels = Array.from(new Set(data.map((d) => d.label)));
  const legendSpace = 20;

  const legendCircleRadius = 8; // Adjust as needed
  const legendCircleOffset = 15; // Space between circle and text
  const legendPositionX = width * 0.9; // 90% of the width

  uniqueLabels.forEach((label, index) => {
    const legendTextY = margin.top + index * legendSpace;

    // Toggle visibility function
    const toggleVisibility = function () {
      const isActive = d3.select("." + label).style("opacity") === "1";
      d3.selectAll("." + label).style("opacity", isActive ? "0" : "1");
    };

    // Appending circle for each label
    svg
      .append("circle")
      .attr("cx", legendPositionX - legendCircleOffset)
      .attr("cy", legendTextY)
      .attr("r", legendCircleRadius)
      .style("fill", color(label))
      .on("click", toggleVisibility); // Adding click action to circle

    // Adjusting label text position and style
    svg
      .append("text")
      .attr("x", legendPositionX)
      .attr("y", legendTextY)
      .attr("dy", "0.35em")
      .text(label)
      .style("fill", color(label))
      .style("font-size", "12px")
      .style("font-weight", "500")
      .on("click", toggleVisibility); // Using the same click action for text
  });
}
