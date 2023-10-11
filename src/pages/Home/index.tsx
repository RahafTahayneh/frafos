import { useCallback, useEffect } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Wrapper } from "../../components/Wrapper";
import Card from "../../components/Card";
import { useDataStore } from "../../store/DataContext";
import { renderHeatmap } from "../../utils/renderEventsHeatmap";
import { renderUnifiedScatterplot } from "../../utils/renderConnectedScattlerplot";

export const Home = () => {
  const {
    eventsHeatmapData,
    parallelCallsData,
    parallelRegsData,
    selectedFilter,
    loading,
  } = useDataStore();

  const renderChartsData = useCallback(() => {
    if (eventsHeatmapData.data.length > 0) {
      renderHeatmap(eventsHeatmapData.data, selectedFilter.dateFilter);
    }
    if (parallelCallsData.data.length > 0) {
      renderUnifiedScatterplot(
        parallelCallsData.data,
        selectedFilter.dateFilter,
        "parallel-calls",
        "c_count"
      );
    }
    if (parallelRegsData.data.length > 0) {
      renderUnifiedScatterplot(
        parallelRegsData.data,
        selectedFilter.dateFilter,
        "parallel-regs",
        "r_count"
      );
    }
  }, [
    eventsHeatmapData.data,
    parallelCallsData.data,
    parallelRegsData.data,
    selectedFilter.dateFilter,
  ]);

  useEffect(() => {
    if (!loading) {
      renderChartsData();
    }
  }, [loading, renderChartsData]);

  useEffect(() => {
    const handleResize = () => {
      renderChartsData();
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [renderChartsData, selectedFilter]);

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
        <Wrapper
          loading={loading}
          title="Type Date Heatmap"
          isNoData={eventsHeatmapData.data.length === 0}
        >
          <div id="tooltip" className="tooltip">
            <div id="type"></div>
            <div id="time"></div>
          </div>

          <svg id="heatmap" width={"100%"} height={300}></svg>
        </Wrapper>
      </div>

      <div className="row-data">
        <div style={{ flex: 1 }}>
          <Wrapper
            loading={loading}
            title="Parallel Calls"
            isNoData={parallelCallsData.data.length === 0}
          >
            <div id="tooltip-parallel-calls" className="tooltip">
              <div id="type"></div>
              <div id="time"></div>
            </div>

            <svg id="parallel-calls" width="100%" height={300}></svg>
          </Wrapper>
        </div>
        <div>
          <Card label="Actual Calls" value="0" />
        </div>
      </div>

      <div>
        <div className="row-data">
          <div style={{ flex: 1 }}>
            <Wrapper
              loading={loading}
              title="Parallel Regs"
              isNoData={parallelRegsData.data.length === 0}
            >
              <div id="tooltip-parallel-regs" className="tooltip">
                <div id="type"></div>
                <div id="time"></div>
              </div>

              <svg id="parallel-regs" width="100%" height={300}></svg>
            </Wrapper>
          </div>
          <div>
            <Card label="Actual Regs" value="0" />
          </div>
        </div>
      </div>
    </div>
  );
};
