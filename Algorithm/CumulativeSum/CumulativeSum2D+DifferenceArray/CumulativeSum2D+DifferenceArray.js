const fs = require('fs');

// 標準入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [H, W, N] = input[0].split(' ').map(Number);

// 差分配列の初期化 (H+2 x W+2)
const diff = Array.from({ length: H + 2 }, () => Array(W + 2).fill(0));

// 差分配列への更新
for (let i = 1; i <= N; i++) {
    let [A, B, C, D] = input[i].split(' ').map(Number);

    // 差分の反映
    diff[A][B] += 1;
    diff[C + 1][B] -= 1;
    diff[A][D + 1] -= 1;
    diff[C + 1][D + 1] += 1;
}

// 縦方向の累積和
for (let i = 1; i <= H; i++) {
    for (let j = 1; j <= W; j++) {
        diff[i][j] += diff[i - 1][j];
    }
}

// 横方向の累積和
for (let i = 1; i <= H; i++) {
    for (let j = 1; j <= W; j++) {
        diff[i][j] += diff[i][j - 1];
    }
}

// 結果の出力
let result = [];
for (let i = 1; i <= H; i++) {
    result.push(diff[i].slice(1, W + 1).join(' '));
}
console.log(result.join('\n'));
