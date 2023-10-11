import { useEffect } from "react";
import { useDataStore } from "../../store/DataContext";
import { Wrapper } from "../../components/Wrapper";
import { renderMacroEventsTypesData } from "../../utils/renderEventsTypesMicrData";
import { IoInformationCircleOutline } from "react-icons/io5";
import Card from "../../components/Card";

export const Analytics = () => {
  const { macroTypesData, selectedFilter, loading } = useDataStore();

  useEffect(() => {
    if (macroTypesData.data.length > 0) {
      renderMacroEventsTypesData(
        macroTypesData.data,
        selectedFilter.dateFilter
      );
    }
  }, [macroTypesData.data, selectedFilter]);
  useEffect(() => {
    const handleResize = () => {
      if (macroTypesData.data.length > 0) {
        renderMacroEventsTypesData(
          macroTypesData.data,
          selectedFilter.dateFilter
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [macroTypesData.data, selectedFilter.dateFilter]);

  return (
    <div className="page-call">
      <div className="title">
        MicroAnalytics <IoInformationCircleOutline size={20} />
      </div>
      <div className="cards-container">
        <Card label="Distinct IP" value="15" />
      </div>
      <div className="cards-container">
        <Wrapper
          title="Types"
          isNoData={macroTypesData.data.length === 0}
          loading={loading}
        >
          <div id="tooltip-macro-types" className="tooltip"></div>
          <svg width="100%" height="300" id="typesSvg"></svg>
        </Wrapper>
      </div>
    </div>
  );
};
