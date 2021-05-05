export function getMonthDays(isLeap: boolean) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap) monthDays[1] = 29;
  return monthDays;
}
