import {
  DATE_FILTER_OPTIONS,
  DateRangeFilterType,
} from "../types/dateFilterTypes";
import { TypeDateHeatmapAgg } from "../types";
import { DataFilterType } from "../types/dataFilterTypes";

type FilterableDataType = {
  key_as_string: string;
};

const getStartDate = (filterType: DateRangeFilterType): Date => {
  const now = new Date();
  const { duration } = DATE_FILTER_OPTIONS[filterType];

  if (filterType === "today" || filterType === "yesterday") {
    now.setDate(now.getDate() - (filterType === "yesterday" ? 1 : 0));
    now.setHours(0, 0, 0, 0);
    return now;
  }

  return new Date(now.getTime() - duration);
};

export const flattenHeatmapData = (data: TypeDateHeatmapAgg[]) => {
  return data.flatMap((item) => {
    return item.buckets.map((bucket) => ({
      key_as_string: item.key_as_string,
      type: bucket.key,
      doc_count: bucket.doc_count,
    }));
  });
};

export const filterDataByDate = <T extends FilterableDataType>(
  data: T[],
  selectedFilter: DataFilterType
): T[] => {
  let filteredData = data;

  const startDate = getStartDate(selectedFilter.dateFilter);
  filteredData = filteredData.filter(
    (item) => new Date(item.key_as_string) >= startDate
  );
  return filteredData;
};
