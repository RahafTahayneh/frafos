import { EventType } from "./eventType";

export type TypeDateHeatmapAgg = {
  key_as_string: string;
  key: number;
  doc_count: number;
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Array<{
    key: EventType;
    doc_count: number;
  }>;
};

export type ChartData<T> = {
  data: T;
};
