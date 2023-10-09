import { DateRangeFilterType } from "./dateFilterTypes";

export type EventTypeFilter = Record<string, boolean>;

export type DataFilterType = {
  dateFilter: DateRangeFilterType;
  eventTypeFilter: EventTypeFilter;
};
