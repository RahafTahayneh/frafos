import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  CallSuccessType,
  CallTerminatedEventType,
  CallTerminatedType,
  CallsType,
  ChartData,
  EventsOverTimeType,
  ParallelCallsType,
  ParallelRegsType,
  RegsType,
  SumOverTimeType,
  HeatmapEventDataType,
} from "../types";
import { EventType } from "../types/eventType";
import dummyData from "../data/dummyData";

import { DataFilterType, EventTypeFilter } from "../types/dataFilterTypes";
import { filterData } from "./utils";

const {
  eventsHeatmapDummyData,
  callsSuccessDummyData,
  callsTerminatedDummyData,
  parallelCallsDummyData,
  parallelRegsDummyData,
  sumDurationDummyData,
  macroTypesDummyData,
  eventsOverTimeDummyData,
} = dummyData;

const defaultEventTypeFilter: EventTypeFilter = Object.values(EventType).reduce(
  (acc, curr) => {
    acc[curr] = false;
    return acc;
  },
  {} as EventTypeFilter
);

const initialFilter: DataFilterType = {
  dateFilter: "last-week",
  eventTypeFilter: defaultEventTypeFilter,
};

type DataStore = {
  eventsHeatmapData: ChartData<HeatmapEventDataType[]>;
  parallelCallsData: ChartData<ParallelCallsType[]>;
  parallelRegsData: ChartData<ParallelRegsType[]>;
  eventsOverTimeData: ChartData<EventsOverTimeType[]>;
  macroTypesData: ChartData<EventsOverTimeType[]>;
  sumDurationData: ChartData<SumOverTimeType[]>;
  callsSuccessData: ChartData<CallSuccessType[]>;
  callsTerminatedData: ChartData<CallTerminatedType[]>;

  refreshData: () => void;
  selectedFilter: DataFilterType;
  setSelectedFilter: (filterType: DataFilterType) => void;

  loading: boolean;
};

const DataContext = createContext<DataStore | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] =
    useState<DataFilterType>(initialFilter);

  const [eventsHeatmapData, setEventsHeatmapData] = useState<
    ChartData<HeatmapEventDataType[]>
  >({
    data: [],
  });

  const [loading, setIsLoading] = useState<boolean>(false);

  const [parallelCallsData, setParallelCallsData] = useState<
    ChartData<ParallelCallsType[]>
  >({
    data: [],
  });

  const [parallelRegsData, setParallelRegsData] = useState<
    ChartData<ParallelRegsType[]>
  >({
    data: [],
  });

  const [eventsOverTimeData, setEventsOverTimeData] = useState<
    ChartData<EventsOverTimeType[]>
  >({
    data: [],
  });

  const [sumDurationData, setSumDurationData] = useState<
    ChartData<SumOverTimeType[]>
  >({
    data: [],
  });

  const [callsSuccessData, setCallSuccessData] = useState<
    ChartData<CallSuccessType[]>
  >({
    data: [],
  });

  const [callsTerminatedData, setCallsTerminatedData] = useState<
    ChartData<CallTerminatedType[]>
  >({
    data: [],
  });
  const [macroTypesData, setMacroTypesData] = useState<
    ChartData<EventsOverTimeType[]>
  >({
    data: [],
  });

  const refreshData = useCallback(() => {
    setIsLoading(true);
    const filteredHeatmap = filterData(
      eventsHeatmapDummyData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredParallelCalls = filterData(
      parallelCallsDummyData.data.map((element) => ({
        ...element,
        label: element.label as CallsType,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredParallelRegs = filterData(
      parallelRegsDummyData.data.map((element) => ({
        ...element,
        label: element.label as RegsType,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredEventsOverTime = filterData(
      eventsOverTimeDummyData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredMacroEventsOverTime = filterData(
      macroTypesDummyData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredSumOverTime = filterData(
      sumDurationDummyData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredCallsSuccess = filterData(
      callsSuccessDummyData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredCallsTerminated = filterData(
      callsTerminatedDummyData.data.map((element) => ({
        ...element,
        message: element.message as CallTerminatedEventType,
        type: element.type as EventType,
      })),
      selectedFilter
    );

    setEventsOverTimeData({ data: filteredEventsOverTime });
    setEventsHeatmapData({
      data: filteredHeatmap,
    });
    setParallelCallsData({ data: filteredParallelCalls });
    setParallelRegsData({ data: filteredParallelRegs });
    setSumDurationData({ data: filteredSumOverTime });
    setCallSuccessData({ data: filteredCallsSuccess });
    setCallsTerminatedData({ data: filteredCallsTerminated });
    setMacroTypesData({ data: filteredMacroEventsOverTime });

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedFilter]);

  useEffect(() => {
    refreshData();
  }, [refreshData, selectedFilter]);

  return (
    <DataContext.Provider
      value={{
        loading,
        eventsHeatmapData,
        refreshData,
        parallelCallsData,
        parallelRegsData,
        eventsOverTimeData,
        sumDurationData,
        callsSuccessData,
        callsTerminatedData,
        macroTypesData,
        selectedFilter,
        setSelectedFilter,
      }}
    >
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
