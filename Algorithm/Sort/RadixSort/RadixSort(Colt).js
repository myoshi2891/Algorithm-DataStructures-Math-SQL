const numbers = [99, 44, 6, 2, 1, 5, 63, 87, 283, 4, 0];

function getDigit(num, i) {
    return Math.floor(Math.abs(num) / Math.pow(10, i)) % 10;
}

function digitCount(num) {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}

function mostDigits(numbers) {
    let maxDigits = 0;
    for (let i = 0; i < numbers.length; i++) {
        maxDigits = Math.max(maxDigits, digitCount(numbers[i]));
    }
    return maxDigits;
}

function radixSort(numbers) {
    let maxDigits = mostDigits(numbers);
    for (let k = 0; k <= maxDigits; k++) {
        let digitBuckets = Array.from({ length: 10 }, () => []);
        for (let i = 0; i < numbers.length; i++) {
            let digit = getDigit(numbers[i], k);
            digitBuckets[digit].push(numbers[i]);
        }
        console.log(digitBuckets);

        numbers = [].concat(...digitBuckets);
        console.log(numbers);
    }
    return numbers;
}

console.log(radixSort(numbers));
