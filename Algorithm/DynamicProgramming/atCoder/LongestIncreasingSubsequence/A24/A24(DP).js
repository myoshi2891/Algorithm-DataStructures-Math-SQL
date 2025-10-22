function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const A = lines[1].split(' ').map(Number);

    let dp = [];

    for (let i = 0; i < N; i++) {
        let left = 0,
            right = dp.length;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (dp[mid] < A[i]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        dp[left] = A[i];
    }

    console.log(dp.length);
}

// 以下はNode.js用の標準入力処理
const fs = require('fs');
main(fs.readFileSync('/dev/stdin', 'utf8'));
