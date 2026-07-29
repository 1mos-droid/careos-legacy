/**
 * Calculates the total care sessions duration and cost.
 * @param {string} startDate - Start date of the session (YYYY-MM-DD)
 * @param {string} endDate - End date of the session (YYYY-MM-DD)
 * @param {number} dailyRate - Daily session rate of the provider
 * @returns {{ days: number, price: number }} Duration in days and total price
 */
export function calculateBookingTotal(startDate, endDate, dailyRate) {
  if (!startDate || !endDate || dailyRate === undefined || dailyRate === null) {
    return { days: 0, price: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return { days: 0, price: 0 };
  }

  // Calculate difference in days (inclusive)
  const diff = end - start;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  
  const rate = Math.max(0, dailyRate);
  return { days, price: days * rate };
}
