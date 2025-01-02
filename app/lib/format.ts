export function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined || isNaN(bytes)) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatNumber(num: number | undefined): string {
  if (num === undefined || isNaN(num)) return '0';
  return num.toLocaleString();
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
}