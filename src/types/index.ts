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

export type HeatmapEventDataType = {
  key_as_string: string;
  key: number;
  type: EventType;
  count: number;
};

export type EventsOverTimeType = {
  key_as_string: string;
  key: number;
  type: EventType;
  count: number;
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
  c_count: number;
  message: string;
  type?: EventType;
};

export type CallTerminatedType = {
  key_as_string: string;
  key: number;
  c_count: number;
  message: CallTerminatedEventType;
  type?: EventType;
};

export type ParallelCallsType = {
  key_as_string: string;
  key: number;
  c_count: number;
  label: CallsType;
  type?: EventType;
  count?: number;
};

export type ParallelRegsType = {
  key_as_string: string;
  key: number;
  r_count: number;
  label: RegsType;
  type?: EventType;
  count?: number;
};

export type ChartData<T> = {
  data: T;
};
