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
import dateTypeHeapMap from "../data/dummyTypeDateHeatMap.json";
import parallelCallsData from "../data/dummyParallelCall.json";
import parallelRegsData from "../data/dummyParallelRegs.json";
import sumOverTimeData from "../data/dummySumDurationOverTime.json";
import eventsOverTimeData from "../data/dummyEventsDataType.json";
import dummyMacroEventsOverTimeData from "../data/dummyMacroEventsDataType.json";
import dummyCallsSuccessData from "../data/dummyCallSuccessRatioData.json";
import dummyCallsTerminatedData from "../data/dummyCallTerminatedDAta.json";
import { EventType } from "../types/eventType";

import { DataFilterType, EventTypeFilter } from "../types/dataFilterTypes";
import { filterDataByDate } from "./utils";

const filterByEventType = (
  data: HeatmapEventDataType[],
  eventTypes: EventType[]
): HeatmapEventDataType[] => {
  return data.filter((item) => eventTypes.includes(item.type));
};

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
  heatmap: ChartData<HeatmapEventDataType[]>;
  parallelCalls: ChartData<ParallelCallsType[]>;
  parallelRegs: ChartData<ParallelRegsType[]>;
  eventsOverTime: ChartData<EventsOverTimeType[]>;
  macroEventsOverTime: ChartData<EventsOverTimeType[]>;
  sumOverTime: ChartData<SumOverTimeType[]>;
  callsSuccessTime: ChartData<CallSuccessType[]>;
  callsTerminatedTime: ChartData<CallTerminatedType[]>;

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

  const [heatmap, setHeatmap] = useState<ChartData<HeatmapEventDataType[]>>({
    data: [],
  });

  const [loading, setIsLoading] = useState<boolean>(false);

  const [parallelCalls, setParallelCalls] = useState<
    ChartData<ParallelCallsType[]>
  >({
    data: [],
  });

  const [parallelRegs, setParallelRegs] = useState<
    ChartData<ParallelRegsType[]>
  >({
    data: [],
  });

  const [eventsOverTime, setEventsOverTime] = useState<
    ChartData<EventsOverTimeType[]>
  >({
    data: [],
  });

  const [sumOverTime, setSumOverTime] = useState<ChartData<SumOverTimeType[]>>({
    data: sumOverTimeData.data,
  });

  const [callSuccessData, setCallSuccessData] = useState<
    ChartData<CallSuccessType[]>
  >({
    data: [],
  });

  const [callTerminatedData, setCallsTerminatedData] = useState<
    ChartData<CallTerminatedType[]>
  >({
    data: [],
  });
  const [macroEventsOverTime, setMacroEventsOverTime] = useState<
    ChartData<EventsOverTimeType[]>
  >({
    data: [],
  });

  const getActiveEventTypes = (filter: DataFilterType): EventType[] => {
    return Object.entries(filter.eventTypeFilter)
      .filter(([_, isActive]) => isActive)
      .map(([eventType, _]) => eventType as EventType);
  };

  const activeEvents = getActiveEventTypes(selectedFilter);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    const filteredHeatmap = filterDataByDate(
      dateTypeHeapMap.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredParallelCalls = filterDataByDate(
      parallelCallsData.data.map((element) => ({
        ...element,
        label: element.label as CallsType,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredParallelRegs = filterDataByDate(
      parallelRegsData.data.map((element) => ({
        ...element,
        label: element.label as RegsType,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredEventsOverTime = filterDataByDate(
      eventsOverTimeData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredMacroEventsOverTime = filterDataByDate(
      dummyMacroEventsOverTimeData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredSumOverTime = filterDataByDate(
      sumOverTimeData.data,
      selectedFilter
    );
    const filteredCallsSuccess = filterDataByDate(
      dummyCallsSuccessData.data.map((element) => ({
        ...element,
        type: element.type as EventType,
      })),
      selectedFilter
    );
    const filteredCallsTerminated = filterDataByDate(
      dummyCallsTerminatedData.data.map((element) => ({
        ...element,
        message: element.message as CallTerminatedEventType,
        type: element.type as EventType,
      })),
      selectedFilter
    );

    setEventsOverTime({ data: filteredEventsOverTime });
    setHeatmap({
      data: filteredHeatmap,
    });
    setParallelCalls({ data: filteredParallelCalls });
    setParallelRegs({ data: filteredParallelRegs });
    setSumOverTime({ data: filteredSumOverTime });
    setCallSuccessData({ data: filteredCallsSuccess });
    setCallsTerminatedData({ data: filteredCallsTerminated });
    setMacroEventsOverTime({ data: filteredMacroEventsOverTime });

    if (activeEvents.length > 0)
      setHeatmap({
        data: filterByEventType(filteredHeatmap, activeEvents),
      });

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
        heatmap,
        refreshData,
        parallelCalls,
        parallelRegs,
        eventsOverTime,
        sumOverTime,
        callsSuccessTime: callSuccessData,
        callsTerminatedTime: callTerminatedData,
        macroEventsOverTime,
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
