import { useEffect } from "react";
import { useDataStore } from "../../store/DataContext";
import { renderHeatmap } from "../../utils/getTypeDateHeatMapData";
import { Collapse } from "../../components/Collapse";
import Card from "../../components/Card";
import { renderParallelCall } from "../../utils/renderParallelCalls";
import { renderParallelRegs } from "../../utils/renderParallelRegs";
import { IoInformationCircleOutline } from "react-icons/io5";

export const Home = () => {
  const { heatmap, parallelCalls, parallelRegs, selectedFilter } =
    useDataStore();

  useEffect(() => {
    if (heatmap.data.length > 0) {
      renderHeatmap(heatmap.data, selectedFilter.dateFilter);
    }
    if (parallelCalls.data.length > 0) {
      renderParallelCall(parallelCalls.data, selectedFilter.dateFilter);
    }
    if (parallelRegs.data.length > 0) {
      renderParallelRegs(parallelRegs.data, selectedFilter.dateFilter);
    }
  }, [heatmap, parallelCalls.data, parallelRegs.data, selectedFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (heatmap.data.length > 0) {
        renderHeatmap(heatmap.data, selectedFilter.dateFilter);
      }
      if (parallelCalls.data.length > 0) {
        renderParallelCall(parallelCalls.data, selectedFilter.dateFilter);
      }
      if (parallelRegs.data.length > 0) {
        renderParallelRegs(parallelRegs.data, selectedFilter.dateFilter);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener on component unmount
  }, [heatmap, parallelCalls.data, parallelRegs.data, selectedFilter]);

  return (
    <div className="page-home">
      <div className="title">
        Overview <IoInformationCircleOutline size={20} />
      </div>
      <div className="cards-container">
        <div>
          <Card label="Attemps" value="105" />
        </div>
        <div>
          <Card label="Ends" value="2" />
        </div>
        <div>
          <Card label="Starts" value="10" />
        </div>
        <div>
          <Card label="ASR (%)" value="4" />
        </div>

        <div>
          <Card label="Avg Duration" value="5 min" />
        </div>
        <div>
          <Card label="Distinct URI" value="60" />
        </div>
      </div>
      <div>
        <Collapse
          title="Type Date Heatmap"
          isNoData={heatmap.data.length === 0}
        >
          <div id="tooltip" className="tooltip">
            <div id="type"></div>
            <div id="time"></div>
          </div>

          <svg id="heatmap" width={"100%"} height={300}></svg>
        </Collapse>
      </div>

      <div className="row-data">
        <div style={{ flex: 1 }}>
          <Collapse
            title="Parallel Calls"
            isNoData={parallelRegs.data.length === 0}
          >
            <div id="tooltip-parallel-calls" className="tooltip">
              <div id="type"></div>
              <div id="time"></div>
            </div>

            <svg id="parallel-calls" width="100%" height={300}></svg>
          </Collapse>
        </div>
        <div>
          <Card label="Actual Calls" value="0" />
        </div>
      </div>

      <div>
        <div className="row-data">
          <div style={{ flex: 1 }}>
            <Collapse
              title="Parallel Regs"
              isNoData={heatmap.data.length === 0}
            >
              <div id="tooltip-parallel-calls" className="tooltip">
                <div id="type"></div>
                <div id="time"></div>
              </div>

              <svg id="parallel-regs" width="100%" height={300}></svg>
            </Collapse>
          </div>
          <div>
            <Card label="Actual Regs" value="0" />
          </div>
        </div>
      </div>
    </div>
  );
};
