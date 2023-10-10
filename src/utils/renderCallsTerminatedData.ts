import { DateRangeFilterType } from "../types/dateFilterTypes";
import { CallTerminatedType, CallTerminatedEventType } from "../types";
import * as d3 from "d3";

function aggregateData(data: CallTerminatedType[]) {
  return data.reduce((acc, curr) => {
    acc[curr.message] = (acc[curr.message] || 0) + curr.c_count;
    return acc;
  }, {} as Record<CallTerminatedEventType, number>);
}

function transformData(
  aggregatedData: Record<CallTerminatedEventType, number>
): { message: string; count: number }[] {
  return Object.entries(aggregatedData).map(([message, count]) => ({
    message,
    count,
  }));
}

export const renderCallsTerminatedData = (
  data: CallTerminatedType[],
  selectedFilter: DateRangeFilterType
) => {
  const svg = d3.select("#callsTerminatedSvg");
  svg.selectAll("*").remove();

  const aggregatedData = aggregateData(data);
  const transformedData = transformData(aggregatedData);

  const width =
    (svg.node() as SVGElement)?.getBoundingClientRect().width || 300;
  const height =
    (svg.node() as SVGElement)?.getBoundingClientRect().height || 300;
  const radius = (Math.min(width, height) / 2) * 0.6;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3
    .pie<{ message: string; count: number }>()
    .value((d) => d.count);

  const arc = d3
    .arc<any>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  const pieData = pie(transformedData);

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const slices = g
    .selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.message))
    .on("mouseover", function (event, d) {
      const percentage =
        (d.data.count / d3.sum(transformedData, (p) => p.count)!) * 100;

      const tooltip = d3.select("#tooltip-calls-terminated");
      tooltip
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`)
        .style("visibility", "visible").html(`
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
      d3.select("#tooltip-calls-terminated").style("visibility", "hidden");
      slices.style("opacity", 1);
    });
  const pieCenterX = width / 2;
  const spaceRightOfPie = width - (pieCenterX + radius);

  const legendWidth = 170;
  const legendMargin = (spaceRightOfPie - legendWidth) / 2;
  const legendX = pieCenterX + radius + legendMargin;

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
