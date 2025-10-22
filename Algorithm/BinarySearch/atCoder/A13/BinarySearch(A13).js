const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();

let [NK, numbers] = input.split('\n');
const [N, K] = NK.split(' ').map(Number);
A = numbers.split(' ').map(Number);

function countPairsBinarySearch(N, K, A) {
    let count = 0;

    for (let i = 0; i < N; i++) {
        let left = i,
            right = N - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (A[mid] - A[i] <= K) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        count += right - i;
    }

    console.log(count);
}

countPairsBinarySearch(N, K, A);
