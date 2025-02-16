function findFactrialIterative(number) {
	let answer = 1;
	if (number === 2) {
		return 2;
	}
	for (let i = 2; i <= number; i++) {
		answer = answer * i;
	}
	return answer;
}

findFactrialIterative(5);

function findFactrialRecursive(number) {
	if (number === 2) {
		return 2;
	}
	return number * findFactrialRecursive(number - 1);
}

function fibonacciIterative(number) {
	let arr = [0, 1];
	for (let i = 2; i <= number; i++) {
		arr.push(arr[i - 2] + arr[i - 1]);
	}
	return arr[number];
}

function fibonacciRecursive(number) {
	if (number < 2) {
		return number;
	}
	return fibonacciRecursive(number - 1) + fibonacciRecursive(number - 2);
}
