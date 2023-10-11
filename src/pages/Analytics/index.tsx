import { useEffect } from "react";
import { useDataStore } from "../../store/DataContext";
import { Wrapper } from "../../components/Wrapper";
import { renderMacroEventsTypesData } from "../../utils/renderEventsTypesMicrData";
import { IoInformationCircleOutline } from "react-icons/io5";
import Card from "../../components/Card";
import { Collapse } from "../../components/Collapse";
import TableComponent from "../../components/Table";

export const Analytics = () => {
  const { macroTypesData, selectedFilter, loading } = useDataStore();

  useEffect(() => {
    if (!loading && macroTypesData.data.length > 0) {
      renderMacroEventsTypesData(
        macroTypesData.data,
        selectedFilter.dateFilter
      );
    }
  }, [loading, macroTypesData.data, selectedFilter]);

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
    <div className="page-micro-analytics">
      <div className="title">
        MicroAnalytics <IoInformationCircleOutline size={20} />
      </div>
      <div className="cards-container">
        <Card label="Distinct IP" value="15" />
      </div>
      <div className="cards-container row-info">
        <div style={{ width: "45%" }}>
          <Wrapper
            title="Types"
            isNoData={macroTypesData.data.length === 0}
            loading={loading}
          >
            <div id="tooltip-macro-types" className="tooltip"></div>
            <svg width="100%" height="300" id="typesSvg"></svg>
          </Wrapper>
        </div>

        <div style={{ width: "45%" }} className="cards">
          <div>
            <Collapse title="From UA">
              <div style={{ fontSize: 14, color: "#303a42", width: "100%" }}>
                <TableComponent />
              </div>
            </Collapse>
          </div>
          <div>
            <Collapse title="SIP Method">
              <div style={{ fontSize: 14, color: "#303a42" }}>
                Data to be displayed here
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};
