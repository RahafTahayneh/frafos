import { DateRangeFilterType } from "../types/dateFilterTypes";
import { HeatmapEventDataType } from "../types";
import * as d3 from "d3";

export function renderHeatmap(
  data: HeatmapEventDataType[],
  selectedFilter: DateRangeFilterType
) {
  const svg = d3.select("#heatmap");
  svg.selectAll("*").remove();

  const margin = { top: 20, right: 20, bottom: 30, left: 100 };
  const svgWidth =
    (svg.node() as SVGElement)?.getBoundingClientRect().width || 600;

  const width = svgWidth - margin.left - margin.right;

  const baseHeightPerBand = 30;
  const paddingBetweenBands = 5;

  const eventTypeSums = data.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + d.count;
    return acc;
  }, {} as { [key: string]: number });

  const nonZeroEventTypes = Object.keys(eventTypeSums).filter(
    (key) => eventTypeSums[key] > 0
  );

  const totalHeight =
    nonZeroEventTypes.length * (baseHeightPerBand + paddingBetweenBands) +
    margin.top +
    margin.bottom;

  svg.attr("height", totalHeight);

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

  const basicIntervalWidth = 100;
  const numberOfIntervals = Math.floor(width / basicIntervalWidth);

  const timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
  const intervalSize =
    (maxDate.getTime() - minDate.getTime()) / (numberOfIntervals - 1);
  const timeIntervals = Array.from(
    { length: numberOfIntervals },
    (_, i) => new Date(minDate.getTime() + i * intervalSize)
  );
  const x = d3
    .scaleBand()
    .domain(timeIntervals.map((d) => d3.timeFormat(timeFormat)(d)))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleBand()
    .domain(nonZeroEventTypes)
    .range([0, totalHeight - margin.top - margin.bottom])
    .padding(0.1);

  const maxCount = d3.max(data.map((d) => d.count)) || 1;

  const color = d3.scaleSequential(d3.interpolateGreens).domain([0, maxCount]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr(
      "transform",
      `translate(0,${totalHeight - margin.top - margin.bottom})`
    )
    .call(d3.axisBottom(x))
    .append("text")
    .attr("y", 30)
    .attr("x", width / 2)
    .attr("dy", "0.71em")
    .style("text-anchor", "middle")
    .text("Time");

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("x", -totalHeight / 2 + margin.top + margin.bottom)
    .style("text-anchor", "middle")
    .text("Event Data Type");

  data.forEach((d) => {
    if (d.count > 0) {
      g.append("rect")
        .attr("x", timeScale(new Date(d.key_as_string)) - x.bandwidth() / 2)
        .attr("y", y(d.type) || 0)
        .attr("width", 16)
        .attr("height", 20)
        .attr("fill", color(d.count))
        .attr("rx", 4)
        .attr("ry", 4)
        .on("mouseover", function (event) {
          const tooltip = d3.select("#tooltip");
          const xPosition = event.pageX + 10;
          const yPosition = event.pageY + 10;

          tooltip
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .style("visibility", "visible")
            .style("padding", "5px");

          d3.select("#type").html(`<b>Type:</b> ${d.type} (${d.count})`);
          d3.select("#time").html(
            `<b>Time:</b> ${d3.timeFormat("%d %b %H:%M")(
              new Date(d.key_as_string)
            )}`
          );
        })
        .on("mouseout", function () {
          d3.select("#tooltip").style("visibility", "hidden");
        });
    }
  });
}
