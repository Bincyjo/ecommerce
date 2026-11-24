/**
 * Formats a monetary value into Indian Rupee (INR) representation (₹).
 * Supports numbers and decimal string inputs.
 */
export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  const numericVal = typeof amount === 'number' ? amount : parseFloat(amount);
  return `₹${numericVal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default formatINR;
