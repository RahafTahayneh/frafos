import { useEffect } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useDataStore } from "../../store/DataContext";
import { Wrapper } from "../../components/Wrapper";
import { renderEventsOverTimeGraph } from "../../utils/renderEventsOverTimeData";
import { renderSumOverTimeData } from "../../utils/renderSumDurationsData";
import { renderCallsSuccessData } from "../../utils/renderCallsSuccessData";
import { renderCallsTerminatedData } from "../../utils/renderCallsTerminatedData";
import Card from "../../components/Card";

export const Calls = () => {
  const {
    eventsOverTimeData,
    sumDurationData,
    callsSuccessData,
    callsTerminatedData,
    selectedFilter,
  } = useDataStore();

  useEffect(() => {
    if (eventsOverTimeData.data.length > 0) {
      renderEventsOverTimeGraph(
        eventsOverTimeData.data,
        selectedFilter.dateFilter
      );
    }

    if (sumDurationData.data.length > 0) {
      renderSumOverTimeData(sumDurationData.data, selectedFilter.dateFilter);
    }
    if (callsSuccessData.data.length > 0) {
      renderCallsSuccessData(callsSuccessData.data, selectedFilter.dateFilter);
    }
    if (callsTerminatedData.data.length > 0) {
      renderCallsTerminatedData(
        callsTerminatedData.data,
        selectedFilter.dateFilter
      );
    }
  }, [
    callsSuccessData.data,
    callsTerminatedData.data,
    eventsOverTimeData.data,
    selectedFilter,
    sumDurationData.data,
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (eventsOverTimeData.data.length > 0) {
        renderEventsOverTimeGraph(
          eventsOverTimeData.data,
          selectedFilter.dateFilter
        );
      }

      if (sumDurationData.data.length > 0) {
        renderSumOverTimeData(sumDurationData.data, selectedFilter.dateFilter);
      }
      if (callsSuccessData.data.length > 0) {
        renderCallsSuccessData(
          callsSuccessData.data,
          selectedFilter.dateFilter
        );
      }
      if (callsTerminatedData.data.length > 0) {
        renderCallsTerminatedData(
          callsTerminatedData.data,
          selectedFilter.dateFilter
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [
    callsSuccessData.data,
    callsTerminatedData.data,
    eventsOverTimeData.data,
    selectedFilter.dateFilter,
    sumDurationData.data,
  ]);

  return (
    <div className="page-call">
      <div className="title">
        Calls <IoInformationCircleOutline size={20} />
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
      </div>
      <div className="row-data">
        <Wrapper
          title="Events Over Time"
          isNoData={eventsOverTimeData.data.length === 0}
        >
          <div id="tooltip-events-over-time" className="tooltip"></div>
          <svg width="100%" height="300" id="eventsOverTimeSVG"></svg>
        </Wrapper>
      </div>
      <div className="row-data">
        <Wrapper
          title="SUM DURATION OVER TIME"
          isNoData={sumDurationData.data.length === 0}
        >
          <div id="tooltip-sum-over-time" className="tooltip"></div>
          <svg width="100%" height="300" id="sumOverTimeSVG"></svg>
        </Wrapper>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 16,
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div className="collapse-svg">
          <Wrapper
            title="CALLS SUCCESS RATIO"
            isNoData={callsSuccessData.data.length === 0}
          >
            <div id="tooltip-calls-success" className="tooltip"></div>
            <svg width={"100%"} height="300" id="callsSuccessSvg"></svg>
          </Wrapper>
        </div>
        <div
          className="collapse-svg"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <Wrapper
            title="CALLS TERMINATED RATIO"
            isNoData={callsTerminatedData.data.length === 0}
          >
            <div id="tooltip-calls-terminated" className="tooltip"></div>
            <svg width={"100%"} height="300" id="callsTerminatedSvg"></svg>
          </Wrapper>
        </div>
      </div>
    </div>
  );
};
