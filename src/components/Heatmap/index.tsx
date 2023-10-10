import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { HeatmapEventDataType } from "../../types"; // Adjust the path if necessary
import { EventType } from "../../types/eventType";

interface HeatmapProps {
  data: HeatmapEventDataType[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = +svg.attr("width")! - margin.left - margin.right;
    const height = +svg.attr("height")! - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);
    const z = d3.scaleSequential(d3.interpolateBlues);

    x.domain(data.map((d) => new Date(d.key_as_string).toDateString()));

    const eventTypeSums = data.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + d.count;
      return acc;
    }, {} as { [key: string]: number });

    const nonZeroEventTypes = Object.keys(eventTypeSums).filter(
      (key) => eventTypeSums[key] > 0
    );

    y.domain(nonZeroEventTypes);
    z.domain([0, d3.max(data, (d) => d.count)!]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x) as any);

    g.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y));

    g.selectAll<SVGRectElement, HeatmapEventDataType>(".block")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "block")
      .attr("x", (d) => x(new Date(d.key_as_string).toDateString())!)
      .attr("y", (d) => y(d.type)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => z(d.count));

    // Tooltip handling
    const tooltip = d3.select("#tooltip");

    svg
      .selectAll<SVGRectElement, HeatmapEventDataType>("rect")
      .on("mouseover", function (event, d) {
        tooltip.style("display", "inline-block");
        tooltip.select("#type").text(`Type: ${d.type}`);
        tooltip.select("#time").text(`Time: ${d.key_as_string}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    // Resize SVG to fit window
    function resize() {
      const node = svg.node();
      if (!node) return; // return early if node is null

      const newWidth =
        ((node as SVGSVGElement).parentNode as Element).getBoundingClientRect()
          .width ?? width;
      svg.attr("width", newWidth);
      x.rangeRound([0, newWidth - margin.left - margin.right]);
      svg.selectAll(".axis--x").call(d3.axisBottom(x) as any);
      svg
        .selectAll<SVGRectElement, HeatmapEventDataType>("rect")
        .attr(
          "x",
          (d: HeatmapEventDataType) =>
            x(new Date(d.key_as_string).toDateString())!
        )
        .attr("width", x.bandwidth());
    }

    d3.select(window).on("resize", resize);
    resize();

    return () => {
      d3.select(window).on("resize", null); // Clean up the resize listener when component unmounts
    };
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height="300px" />
    </div>
  );
};

export default Heatmap;
