import * as d3 from "d3";
import { DateRangeFilterType } from "../types/dateFilterTypes";
import { ParallelCallsType, ParallelRegsType } from "../types";

type DataItemType = ParallelCallsType | ParallelRegsType;

function isParallelCallsType(data: DataItemType): data is ParallelCallsType {
  return (data as ParallelCallsType).c_count !== undefined;
}

export function renderUnifiedScatterplot(
  data: DataItemType[],
  selectedFilter: DateRangeFilterType,
  scatterPlotId: string,
  countField: "c_count" | "r_count"
) {
  const svgElement = document.getElementById(scatterPlotId);
  if (!svgElement || !(svgElement instanceof SVGSVGElement)) {
    throw new Error(
      `The element with id '${scatterPlotId}' is not an SVG element or does not exist.`
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

  const maxCount = d3.max(data, (d) =>
    isParallelCallsType(d) ? d.c_count : d.r_count
  );

  const maxYTick = Math.ceil(maxCount || 5);

  const yTicks = Array.from({ length: maxYTick + 1 }, (_, i) => i);

  const y = d3
    .scaleLinear()
    .domain([0, maxCount || 5])
    .range([height, 0]);

  const x = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

  const line = d3
    .line<DataItemType>()
    .x((d) => x(new Date(d.key_as_string)))
    .y((d) => y(isParallelCallsType(d) ? d.c_count : d.r_count));

  const color =
    scatterPlotId === "parallel-calls"
      ? d3.scaleOrdinal(d3.schemeSet2)
      : d3.scaleOrdinal(["rgb(165, 202, 71)", "rgb(202, 165, 71)"]);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(d3.axisLeft(y).tickValues(yTicks));

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
    const path: d3.Selection<SVGPathElement, DataItemType[], null, undefined> =
      svg
        .append("path")
        .datum(values)
        .attr("class", label)
        .attr("fill", "none")
        .attr("stroke", color(label))
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("transform", `translate(${margin.left},${margin.top})`);
    const totalLength = (path.node() as any).getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength);

    path
      .transition()
      .duration(2000) // Set the duration as you see fit
      .attr("stroke-dashoffset", 0);

    values.forEach((entry) => {
      const countValue = isParallelCallsType(entry)
        ? entry.c_count
        : entry.r_count;

      svg
        .append("circle")
        .attr("class", label)
        .attr("cx", x(new Date(entry.key_as_string)))
        .attr("cy", y(countValue))
        .attr("r", 0)
        .attr("fill", color(label))
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .on("mouseover", function (event, d) {
          const tooltip = d3.select("#tooltip-" + scatterPlotId);
          const formattedTime = d3.timeFormat("%d %b %H:%M")(
            new Date(entry.key_as_string)
          );

          tooltip.style("visibility", "visible");
          tooltip
            .select("#type")
            .html(`<b>Type:</b>  ${countValue}  ${entry.label}`);
          tooltip.select("#time").html(`<b>Time:</b> ${formattedTime}`);
          tooltip.style("left", event.pageX + 10 + "px");
          tooltip.style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", function () {
          d3.select("#tooltip-" + scatterPlotId).style("visibility", "hidden");
        })
        .transition()
        .duration(1000) // or any other value in ms
        .attr("r", 5);
    });
  });

  const uniqueLabels = Array.from(new Set(data.map((d) => d.label)));
  const legendSpace = 20;
  const legendPositionX = width * 0.9;

  const legendCircleRadius = 8;
  const legendCircleOffset = 15;

  uniqueLabels.forEach((label, index) => {
    const legendTextY = margin.top + index * legendSpace;

    const toggleVisibility = function () {
      const isActive = d3.select("." + label).style("opacity") === "1";
      d3.selectAll("." + label).style("opacity", isActive ? "0" : "1");
    };

    svg
      .append("circle")
      .attr("cx", legendPositionX - legendCircleOffset)
      .attr("cy", legendTextY)
      .attr("r", legendCircleRadius)
      .style("fill", color(label))
      .on("click", toggleVisibility);

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
