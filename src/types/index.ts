import { EventType } from "./eventType";

export enum CallsType {
  CALLS = "calls",
  CALLSD = "calls-1d",
}

export enum RegsType {
  REGS = "regs",
  REGSD = "regs-1d",
}

export enum CallTerminatedEventType {
  "CALLER_TERMINATED" = "caller-terminated",
  "CALLEE_TERMINATED" = "callee-terminated",
}

export type TypeDateHeatmapAgg = {
  key_as_string: string;
  key: number;
  buckets: Array<{
    key: EventType;
    doc_count: number;
  }>;
};

export type EventsOverTimeType = {
  key_as_string: string;
  key: number;
  type: EventType;
  doc_count: number;
};

export type SumOverTimeType = {
  key_as_string: string;
  key: number;
  time: number;
  type?: EventType;
};

export type CallSuccessType = {
  key_as_string: string;
  key: number;
  count: number;
  message: string;
  type?: EventType;
};

export type CallTerminatedType = {
  key_as_string: string;
  key: number;
  count: number;
  type?: EventType;
  message: CallTerminatedEventType;
};

export type ParallelCallsType = {
  key_as_string: string;
  key: number;
  count: number;
  label: CallsType;
  type?: EventType;
  buckets: Array<{
    key: EventType;
    doc_count: number;
  }>;
};

export type ParallelRegsType = {
  key_as_string: string;
  key: number;
  count: number;
  label: RegsType;
  type?: EventType;
  buckets: Array<{
    key: EventType;
    doc_count: number;
  }>;
};

export type ChartData<T> = {
  data: T;
};
