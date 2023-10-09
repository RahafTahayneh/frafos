import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
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
  TypeDateHeatmapAgg,
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
  data: TypeDateHeatmapAgg[],
  eventTypes: EventType[]
): TypeDateHeatmapAgg[] => {
  return data.map((item) => ({
    ...item,
    buckets: item.buckets.filter((bucket) => eventTypes.includes(bucket.key)),
  }));
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
  heatmap: ChartData<TypeDateHeatmapAgg[]>;
  parallelCalls: ChartData<ParallelCallsType[]>;
  parallelRegs: ChartData<ParallelRegsType[]>;
  eventsOverTime: ChartData<EventsOverTimeType[]>;
  macroEventsOverTime: ChartData<EventsOverTimeType[]>;
  sumOverTime: ChartData<SumOverTimeType[]>;
  callsSuccessTime: ChartData<CallSuccessType[]>;
  callsTerminatedTime: ChartData<CallTerminatedType[]>;

  refreshData: () => void;
  selectedFilter: DataFilterType; // New field
  setSelectedFilter: (filterType: DataFilterType) => void; // New field
};

const DataContext = createContext<DataStore | undefined>(undefined);

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] =
    useState<DataFilterType>(initialFilter);

  const [heatmap, setHeatmap] = useState<ChartData<TypeDateHeatmapAgg[]>>({
    data: [],
  });

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

  console.log(activeEvents);

  const refreshData = useCallback(() => {
    console.log("Hello");
    const filteredHeatmap = filterDataByDate(
      dateTypeHeapMap.data.map((element) => ({
        ...element,
        buckets: element.buckets.map((b) => ({
          ...b,
          key: b.key as EventType,
        })),
      })),
      selectedFilter
    );
    const filteredParallelCalls = filterDataByDate(
      parallelCallsData.data.map((element) => ({
        ...element,
        label: element.label as CallsType,
        buckets: element.buckets.map((b) => ({
          ...b,
          key: b.key as EventType,
        })),
      })),
      selectedFilter
    );
    const filteredParallelRegs = filterDataByDate(
      parallelRegsData.data.map((element) => ({
        ...element,
        label: element.label as RegsType,
        buckets: element.buckets.map((b) => ({
          ...b,
          key: b.key as EventType,
        })),
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
      dummyCallsSuccessData.data,
      selectedFilter
    );
    const filteredCallsTerminated = filterDataByDate(
      dummyCallsTerminatedData.data.map((element) => ({
        ...element,
        message: element.message as CallTerminatedEventType,
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
  }, [selectedFilter]);

  useEffect(() => {
    refreshData();
  }, [refreshData, selectedFilter]);

  return (
    <DataContext.Provider
      value={{
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
