import { useEffect } from "react";
import { useDataStore } from "../../store/DataContext";
import { Collapse } from "../../components/Collapse";
import { renderMacroEventsTypesData } from "../../utils/renderEventsTypesMicrData";
import { IoInformationCircleOutline } from "react-icons/io5";
import Card from "../../components/Card";

export const Analytics = () => {
  const { macroEventsOverTime, selectedFilter } = useDataStore();

  useEffect(() => {
    if (macroEventsOverTime.data.length > 0) {
      renderMacroEventsTypesData(
        macroEventsOverTime.data,
        selectedFilter.dateFilter
      );
    }
  }, [macroEventsOverTime.data, selectedFilter]);

  return (
    <div className="page-call">
      <div className="title">
        MicroAnalytics <IoInformationCircleOutline size={20} />
      </div>
      <div className="cards-container">
        <Card label="Distinct IP" value="15" />
      </div>
      <div className="cards-container">
        <Collapse
          title="Types"
          isNoData={macroEventsOverTime.data.length === 0}
        >
          <div id="tooltip-macro-types" className="tooltip"></div>
          <svg width="1000" height="400" id="typesSvg"></svg>
        </Collapse>
      </div>
    </div>
  );
};
