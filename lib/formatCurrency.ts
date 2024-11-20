export function formatCurrency(
    amount: number,
    currencyCode: string = "INR"
): string {
    try {
        // Use 'en-IN' as the locale for Indian currency formatting, and set currency code separately
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currencyCode.toUpperCase(),
        }).format(amount);
    } catch (error) {
        console.error("Invalid Currency code", error);
        // If an error occurs, format using the default approach
        return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
    }
}
