export type DateRangeFilterType =
  | "last-5-mins"
  | "last-1-hour"
  | "last-6-hours"
  | "last-12-hours"
  | "today"
  | "yesterday"
  | "last-week"
  | "custom";

export const DATE_FILTER_OPTIONS: Record<
  DateRangeFilterType,
  { label: string; duration: number }
> = {
  "last-5-mins": { label: "Last 5 Minutes", duration: 5 * 60 * 1000 },
  "last-1-hour": { label: "Last 1 Hour", duration: 60 * 60 * 1000 },
  "last-6-hours": { label: "Last 6 Hours", duration: 6 * 60 * 60 * 1000 },
  "last-12-hours": { label: "Last 12 Hours", duration: 12 * 60 * 60 * 1000 },
  today: { label: "Today", duration: 0 },
  yesterday: { label: "Yesterday", duration: 0 },
  "last-week": { label: "Last Week", duration: 7 * 24 * 60 * 60 * 1000 },
  custom: { label: "Custom", duration: 0 },
};
