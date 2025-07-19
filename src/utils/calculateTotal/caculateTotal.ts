function calculateTotal(amounts: string): number {
  if (!amounts || amounts.trim() === '') {
    return 0;
  }

  // Split by both newlines and commas, then filter out empty strings
  const amountArray = amounts
    .split(/[,\n]+/)
    .map(amt => amt.trim())
    .filter(amt => amt !== '')
    .map(amt => parseFloat(amt))
    .filter(num => !isNaN(num));

  return amountArray.reduce((sum, num) => sum + num, 0);
}