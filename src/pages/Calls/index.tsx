import { useEffect } from "react";
import { useDataStore } from "../../store/DataContext";
import { Collapse } from "../../components/Collapse";
import { renderEventsOverTimeGraph } from "../../utils/renderEventsOverTimeData";
import { renderSumOverTimeData } from "../../utils/renderSumDurationsData";
import { renderCallsSuccessData } from "../../utils/renderCallsSuccessData";
import { renderCallsTerminatedData } from "../../utils/renderCallsTerminatedData";
import { IoInformationCircleOutline } from "react-icons/io5";
import Card from "../../components/Card";

export const Calls = () => {
  const {
    eventsOverTime,
    sumOverTime,
    callsSuccessTime,
    callsTerminatedTime,
    selectedFilter,
  } = useDataStore();

  useEffect(() => {
    if (eventsOverTime.data.length > 0) {
      renderEventsOverTimeGraph(eventsOverTime.data, selectedFilter.dateFilter);
    }

    if (sumOverTime.data.length > 0) {
      renderSumOverTimeData(sumOverTime.data, selectedFilter.dateFilter);
    }
    if (callsSuccessTime.data.length > 0) {
      renderCallsSuccessData(callsSuccessTime.data, selectedFilter.dateFilter);
    }
    if (callsTerminatedTime.data.length > 0) {
      renderCallsTerminatedData(
        callsTerminatedTime.data,
        selectedFilter.dateFilter
      );
    }
  }, [
    callsSuccessTime.data,
    callsTerminatedTime.data,
    eventsOverTime.data,
    selectedFilter,
    sumOverTime.data,
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
        <Collapse
          title="Events Over Time"
          isNoData={eventsOverTime.data.length === 0}
        >
          <div id="tooltip-events-over-time" className="tooltip"></div>
          <svg width="1000" height="400" id="eventsOverTimeSVG"></svg>
        </Collapse>
      </div>
      <div className="row-data">
        <Collapse
          title="SUM DURATION OVER TIME"
          isNoData={sumOverTime.data.length === 0}
        >
          <div id="tooltip-sum-over-time" className="tooltip"></div>
          <svg width="1000" height="400" id="sumOverTimeSVG"></svg>
        </Collapse>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 16,
        }}
      >
        <Collapse
          title="CALLS SUCCESS RATIO"
          isNoData={callsSuccessTime.data.length === 0}
        >
          <div id="tooltip-calls-success" className="tooltip"></div>
          <svg width="600" height="400" id="callsSuccessSvg"></svg>
        </Collapse>
        <Collapse
          title="CALLS TERMINATED RATIO"
          isNoData={callsTerminatedTime.data.length === 0}
        >
          <div id="tooltip-calls-terminated" className="tooltip"></div>
          <svg width="600" height="400" id="callsTerminatedSvg"></svg>
        </Collapse>
      </div>
      <div className="cards-container"></div>
    </div>
  );
};
