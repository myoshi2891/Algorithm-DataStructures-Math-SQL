function countPairs(N: number, K: number, A: number[]): number {
    let count = 0;
    let j = 0; // 右ポインタの初期位置

    for (let i = 0; i < N; i++) {
        // j を右に動かし、条件 A[j] - A[i] <= K を満たす最大の j を探す
        while (j < N && A[j] - A[i] <= K) {
            j++;
        }
        count += j - i - 1; // i < j なのでペア数は j - i - 1
    }

    return count;
}

// 標準入力の処理
const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const A = input[1].split(' ').map(Number);

// 結果を出力
console.log(countPairs(N, K, A));
