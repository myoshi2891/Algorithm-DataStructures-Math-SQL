// function fib(n, memo = [undefined, 1, 1]) {
// 	if (memo[n] !== undefined) return memo[n];
// 	// if (n <= 2) return 1;
// 	let res = fib(n - 1, memo) + fib(n - 2, memo);	
// 	memo[n] = res;
// 	return res;
// }

function fib(n) {
	if (n <= 2) return 1
	let fibNum = [0, 1, 1]
	for (let i = 3; i <= n; i++) {
        fibNum[i] = fibNum[i - 1] + fibNum[i - 2]
	}
	return fibNum[n]
}

console.log(fib(10));
