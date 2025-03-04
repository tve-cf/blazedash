export function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

export function getDateRange() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Format dates as YYYY-MM-DD
  const formatToCloudflare = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return {
    since: formatToCloudflare(sevenDaysAgo),
    until: formatToCloudflare(now),
  };
}
