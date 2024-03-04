export function timeAgo(isoTimestamp: string): string {
  const parsedDate = new Date(isoTimestamp);
  const timestamp = parsedDate.getTime() / 1000;

  const timeDiff = Date.now() / 1000 - timestamp;

  const seconds = timeDiff;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365.25;

  if (years >= 1) {
    return `${Math.floor(years)}y`;
  } else if (days >= 1) {
    return `${Math.floor(days)}d`;
  } else if (hours >= 1) {
    return `${Math.floor(hours)}h`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)}m`;
  } else {
    return `${Math.floor(seconds)}s`;
  }
}
