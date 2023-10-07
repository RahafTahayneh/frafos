import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChartData, TypeDateHeatmapAgg } from "../types";

type DataStore = {
  heatmap: ChartData<TypeDateHeatmapAgg[]>;
  setDataForChart: <T>(chartName: string, data: ChartData<T>) => void;
};

const initialData: DataStore = {
  heatmap: { data: [] },
  setDataForChart: () => {}, // Placeholder function, will be overridden by the context provider
};

const DataContext = createContext<DataStore | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [heatmap, setHeatmap] = useState<ChartData<TypeDateHeatmapAgg[]>>(
    initialData.heatmap
  );

  const setDataForChart = <T,>(chartName: string, data: ChartData<T>) => {
    if (chartName === "heatmap") {
      setHeatmap(data as ChartData<TypeDateHeatmapAgg[]>); // Casting is needed here
    }
  };

  return (
    <DataContext.Provider value={{ heatmap, setDataForChart }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataStore = (): DataStore => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataStore must be used within a DataProvider");
  }
  return context;
};
