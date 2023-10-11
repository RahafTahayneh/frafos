import React, { ReactNode, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import Loader from "../Loading";
import Modal from "../Modal";

export const Wrapper = ({
  title,
  children,
  isNoData,
  loading = false,
}: {
  title: string;
  children: ReactNode;

  isNoData: boolean;
  loading?: boolean;
}) => {
  const [openDetailsModal, setIsOpenDetailsModal] = useState(false);
  return (
    <div
      className="wrapper-container"
      style={{ width: "100%", height: isNoData ? "300px" : "auto" }}
    >
      <div className="wrapper-header">
        <div>{title}</div>
        <div
          className="view-details"
          onClick={() => setIsOpenDetailsModal(true)}
        >
          View details
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="wrapper-content">
          {(() => {
            switch (true) {
              case isNoData:
                return (
                  <div className="no-data">
                    <BiErrorCircle size={50} color={"#303a42"} />
                    <p style={{ marginTop: 12 }}>No data found.</p>
                  </div>
                );
              case React.Children.count(children) !== 0:
                return children;
              default:
                return <div className="no-data"> Something went wrong </div>;
            }
          })()}
        </div>
      )}

      {openDetailsModal && (
        <Modal
          type="info"
          title="Details about Graph"
          onClose={() => setIsOpenDetailsModal(false)}
        >
          <div style={{ fontSize: 14 }}>
            Review more details about the data graph.
          </div>
        </Modal>
      )}
    </div>
  );
};
