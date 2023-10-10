import { DateRangeFilterType } from "../types/dateFilterTypes";
import { CallSuccessType } from "../types";

import * as d3 from "d3";

function aggregateCallSuccessData(
  data: CallSuccessType[]
): { message: string; count: number }[] {
  const aggregatedData: Record<string, number> = {};

  data.forEach((d) => {
    if (!aggregatedData[d.message]) {
      aggregatedData[d.message] = 0;
    }
    aggregatedData[d.message] += d.c_count;
  });

  return Object.entries(aggregatedData).map(([message, count]) => ({
    message,
    count,
  }));
}

export const renderCallsSuccessData = (
  data: CallSuccessType[],
  selectedFilter: DateRangeFilterType
) => {
  const svg = d3.select("#callsSuccessSvg");
  svg.selectAll("*").remove();

  const width =
    (svg.node() as SVGElement)?.getBoundingClientRect().width || 300;
  const height =
    (svg.node() as SVGElement)?.getBoundingClientRect().height || 300;
  const aggregatedData = aggregateCallSuccessData(data);

  const radius = (Math.min(width, height) / 2) * 0.6;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3
    .pie<{ message: string; count: number }>()
    .value((d) => d.count);
  const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

  const pieData = pie(aggregatedData);

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
      const percentage = (d.data.count / d3.sum(data, (p) => p.c_count)!) * 100;
      const tooltip = d3.select("#tooltip-calls-success");
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
      d3.select("#tooltip-calls-success").style("visibility", "hidden");

      slices.style("opacity", 1);
    });
  const pieCenterX = width / 2;
  const spaceRightOfPie = width - (pieCenterX + radius);

  const legendWidth = 150;
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
