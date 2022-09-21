export const getNextDay = (currentDayString: string, days: string[]): string | null => {
  if (days.length === 0) {
    return null;
  }

  const currentDayIndex = days.findIndex((day) => day === currentDayString);

  if (currentDayIndex === -1) {
    return null;
  }

  if (currentDayIndex >= days.length - 1) {
    return null;
  }

  return days[currentDayIndex + 1];
};

export const getPreviousDay = (currentDayString: string, days: string[]): string | null => {
  if (days.length === 0) {
    return null;
  }

  const currentDayIndex = days.findIndex((day) => day === currentDayString);

  if (currentDayIndex <= 0) {
    return null;
  }

  return days[currentDayIndex - 1];
};
