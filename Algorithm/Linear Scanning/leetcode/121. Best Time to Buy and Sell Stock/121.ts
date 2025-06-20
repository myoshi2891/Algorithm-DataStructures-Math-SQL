function maxProfit(prices: number[]): number {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price; // 安く買える日を更新
        } else {
            maxProfit = Math.max(maxProfit, price - minPrice); // 利益を最大化
        }
    }

    return maxProfit;
}
