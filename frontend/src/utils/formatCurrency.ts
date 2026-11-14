/**
 * Format a number into Indian Rupees (INR) format: ₹29,990
 */
export const formatINR = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return '₹' + Math.round(amount).toLocaleString('en-IN');
};
