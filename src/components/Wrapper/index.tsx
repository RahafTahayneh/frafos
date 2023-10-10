import React, { ReactNode } from "react";
import { BiErrorCircle } from "react-icons/bi";
import Loader from "../Loading";

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
  return (
    <div
      className="collapse-container"
      style={{ width: "100%", height: isNoData ? "300px" : "auto" }}
    >
      <div className="collapse-header">
        <div>{title}</div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="collapse-content">
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
    </div>
  );
};
