import { DateRangeFilterType } from "../types/dateFilterTypes";
import { CallSuccessType, EventsOverTimeType } from "../types";

import * as d3 from "d3";

function aggregateCallSuccessData(
  data: EventsOverTimeType[]
): { message: string; count: number }[] {
  const aggregatedData: Record<string, number> = {};

  data.forEach((d) => {
    if (!aggregatedData[d.type]) {
      aggregatedData[d.type] = 0;
    }
    aggregatedData[d.type] += d.doc_count;
  });

  return Object.entries(aggregatedData).map(([message, count]) => ({
    message,
    count,
  }));
}

export const renderMacroEventsTypesData = (
  data: EventsOverTimeType[],
  selectedFilter: DateRangeFilterType
) => {
  const svg = d3.select("#typesSvg");
  svg.selectAll("*").remove(); // clear previous rendering

  const aggregatedData = aggregateCallSuccessData(data);

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const radius = (Math.min(width, height) / 2) * 0.6; // 80% of the original size

  const color = d3.scaleOrdinal(d3.schemeCategory10); // color scheme

  const pie = d3
    .pie<{ message: string; count: number }>()
    .value((d) => d.count);
  const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

  const pieData = pie(aggregatedData);

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Draw the pie slices.
  const slices = g
    .selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.message))
    .on("mouseover", function (event, d) {
      const percentage =
        (d.data.count / d3.sum(data, (p) => p.doc_count)!) * 100;
      const tooltip = d3.select("#tooltip-macro-types");
      tooltip
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`)
        .style("visibility", "visible")
        .style("display", "block").html(`
          <div style="font-size: 12px; font-weight: bold;">${
            d.data.message
          }</div>
          <div>Count: ${d.data.count}</div>
          <div>Percentage: ${percentage.toFixed(2)}%</div>
        `);

      // Dim all slices.
      slices.style("opacity", 0.3);

      // Highlight the current slice.
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select("#tooltip-macro-types").style("visibility", "hidden");

      // Reset opacity for all slices.
      slices.style("opacity", 1);
    });

  // Add legend
  const legendG = svg
    .append("g")
    .attr("transform", `translate(${width - 150}, 30)`)
    .selectAll(".legend")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendG
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => color(d.data.message));

  legendG
    .append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text((d) => d.data.message);
};
