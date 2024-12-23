export function useFormatValue(value: number): string {
  if (value >= 1000000) {
    // Divide the value by 1,000 to get the "K" representation
    const integerPart = Math.floor(value / 1000);
    const decimalPart = ((value % 1000) / 1000).toFixed(1).substring(2);

    // Format the integer part with dots as thousand separators
    const formattedIntegerPart = integerPart
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    // Combine integer and decimal parts, ensuring there's no trailing ".0" if the decimal is zero
    return `Rp ${
      decimalPart === "0"
        ? formattedIntegerPart + "K"
        : formattedIntegerPart + "," + decimalPart + "K"
    }`;
  }
  return `Rp ${value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
}
