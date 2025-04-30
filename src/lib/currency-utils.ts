/**
 * Format a number as Indonesian Rupiah (IDR)
 * @param value - The number to format
 * @returns Formatted string (e.g., "200.000")
 */
export function formatIDR(value: number | string): string {
  // Convert to number if it's a string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(numValue)) return "";

  // Format the number with thousand separators
  return numValue.toLocaleString("id-ID");
}

/**
 * Parse a formatted Indonesian Rupiah string back to a number
 * @param value - The formatted string (e.g., "Rp 200.000" or "200.000")
 * @returns The parsed number
 */
export function parseIDR(value: string): number {
  if (!value) return 0;

  try {
    // Remove currency symbol (Rp) if present
    let cleanValue = value.replace(/Rp\s?/gi, "");

    // Remove all thousand separators (dots in Indonesian format)
    cleanValue = cleanValue.replace(/\./g, "");

    // Replace comma with dot for decimal point if present
    cleanValue = cleanValue.replace(/,/g, ".");

    // Remove any remaining non-numeric characters except decimal point
    cleanValue = cleanValue.replace(/[^\d.]/g, "");

    // Parse the cleaned string to a number
    const parsedValue = parseFloat(cleanValue);

    // Return 0 if parsing failed
    return isNaN(parsedValue) ? 0 : parsedValue;
  } catch (error) {
    console.error("Error parsing IDR value:", error);
    return 0;
  }
}
