export const CHART = {
  signups: "#3b3178",
  groups: "#e8a33d",
  bar: "#3b3178",
  barAlt: "#5b7fde",
  accent: "#e8a33d",
  grid: "#a9a3e040",
  tick: "#6b6584",
};

export const FREQ_COLORS: Record<string, string> = {
  weekly: "#5b7fde",
  biweekly: "#e8a33d",
  monthly: "#3b3178",
};

export const chartTooltipStyle = {
  borderRadius: 8,
  borderColor: "#a9a3e0",
  fontSize: 12,
};

export function formatVolumeTick(v: number) {
  if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}m`;
  return `₦${(v / 1000).toFixed(0)}k`;
}
