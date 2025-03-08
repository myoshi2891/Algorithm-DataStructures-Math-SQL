// function fib(n, memo = [undefined, 1, 1]) {
// 	if (memo[n] !== undefined) return memo[n];
// 	// if (n <= 2) return 1;
// 	let res = fib(n - 1, memo) + fib(n - 2, memo);
// 	memo[n] = res;
// 	return res;
// }

// function fib(n) {
// 	if (n <= 2) return 1
// 	let fibNum = [0, 1, 1]
// 	for (let i = 3; i <= n; i++) {
//         fibNum[i] = fibNum[i - 1] + fibNum[i - 2]
// 	}
// 	return fibNum[n]
// }

// console.log(fib(10));

// tabulation
// function coinChange(denominations, amount) {
// 	// initialize an array of zeros with indices up to amount
// 	var combinations = new Array(amount + 1).fill(0);
// 	// base case
// 	combinations[0] = 1;
// 	// for every coin in denominations
// 	for (let coin of denominations) {
// 		// start iterating where the coin's value is
// 		// (so you don't have to check additional values)
// 		for (var i = coin; i <= amount; i++) {
// 			// set in combinations itself plus the value of i minus the coin
// 			combinations[i] += combinations[i - coin];
// 		}
// 		console.log(combinations);
// 	}
// 	return combinations[amount];
// }

// memoization
function coinChange(denominations, amount, memo) {
	let numCoins = denominations.length;

	if (!memo) {
		memo = {};
		for (let i = 1; i <= numCoins; i++) {
			memo[i] = { 0: 1 };
		}
	}
	
	if (amount < 0 || (numCoins === 0 && amount >= 0)) return 0;
	
	if (!memo[numCoins][amount]) {
		let lastCoin = denominations[numCoins - 1];
		memo[numCoins][amount] =
		coinChange(denominations, amount - lastCoin, memo) +
		coinChange(denominations.slice(0, numCoins - 1), amount, memo);
	}

	return memo[numCoins][amount];
}

const denominations = [1, 5, 10, 25];
// console.log(coinChange(denominations, 1));
// console.log(coinChange(denominations, 2));
console.log(coinChange(denominations, 5));
// console.log(coinChange(denominations, 10));
// console.log(coinChange(denominations, 25));
// console.log(coinChange(denominations, 45));
// console.log(coinChange(denominations, 100));
// console.log(coinChange(denominations, 145));
// coinChange(denominations, 1451);
// coinChange(denominations, 14511);
