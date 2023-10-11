import { DateRangeFilterType } from "../types/dateFilterTypes";
import { EventsOverTimeType } from "../types";
import * as d3 from "d3";
import { FILTER_OPTIONS } from "../_constants/filterOptions";

function aggregateCallSuccessData(
  data: EventsOverTimeType[]
): { message: string; count: number }[] {
  const aggregatedData: Record<string, number> = {};
  data.forEach((d) => {
    if (!aggregatedData[d.type]) {
      aggregatedData[d.type] = 0;
    }
    aggregatedData[d.type] += d.count;
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
  svg.selectAll("*").remove();
  const width =
    (svg.node() as SVGElement)?.getBoundingClientRect().width || 300;
  const height =
    (svg.node() as SVGElement)?.getBoundingClientRect().height || 300;
  const aggregatedData = aggregateCallSuccessData(data);
  const radius = (Math.min(width, height) / 2) * 0.6;
  const color = d3
    .scaleOrdinal<string, string>()
    .domain(Object.keys(FILTER_OPTIONS))
    .range(Object.values(FILTER_OPTIONS));
  const pie = d3
    .pie<{ message: string; count: number }>()
    .value((d) => d.count);
  const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);
  const pieData = pie(aggregatedData);
  const pieCenterX = radius + 30;
  const g = svg
    .append("g")
    .attr("transform", `translate(${pieCenterX}, ${height / 2})`);
  const slices = g
    .selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.message))
    .on("mouseover", function (event, d) {
      const percentage = (d.data.count / d3.sum(data, (p) => p.count)!) * 100;
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
      slices.style("opacity", 0.3);
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select("#tooltip-macro-types").style("visibility", "hidden");
      slices.style("opacity", 1);
    });
  const legendWidth = 150;
  const legendMargin = 30;
  const legendX = width - legendWidth - legendMargin;
  const legendG = svg
    .append("g")
    .attr("transform", `translate(${legendX}, 30)`)
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
