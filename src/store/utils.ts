import {
  DATE_FILTER_OPTIONS,
  DateRangeFilterType,
} from "../types/dateFilterTypes";
import { DataFilterType } from "../types/dataFilterTypes";
import { EventType } from "../types/eventType";

type FilterableDataType = {
  key_as_string: string;
};

const getActiveEventTypes = (filter: DataFilterType): EventType[] => {
  return Object.entries(filter.eventTypeFilter)
    .filter(([_, isActive]) => isActive)
    .map(([eventType, _]) => eventType as EventType);
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
export const filterData = <T extends FilterableDataType & { type: EventType }>(
  data: T[],
  selectedFilter: DataFilterType
): T[] => {
  const startDate = getStartDate(selectedFilter.dateFilter);
  const activeEventTypes = getActiveEventTypes(selectedFilter);

  return data.filter((item) => {
    // Filter by date if dateFilter is set
    const dateFilterResult = new Date(item.key_as_string) >= startDate;

    // Filter by event type if any eventType is active
    const eventTypeFilterResult =
      activeEventTypes.length > 0 ? activeEventTypes.includes(item.type) : true; // If no event types are selected, return true to include all items

    // Return the combined result of both filters
    return dateFilterResult && eventTypeFilterResult;
  });
};
