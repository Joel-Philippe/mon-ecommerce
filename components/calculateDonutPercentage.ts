export function calculateDonutPercentage(stock: number, stock_reduc: number): number {
    if (isNaN(stock) || isNaN(stock_reduc)) {
        return 0;
    }

    const percentage = ((stock - stock_reduc) / stock) * 100;
    return parseFloat(percentage.toFixed(2));
}