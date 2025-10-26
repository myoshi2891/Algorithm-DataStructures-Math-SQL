const fs = require('fs');

// 標準入力から読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [D, N] = input[0].split(' ').map(Number);

// 各日ごとに最大で働ける時間（初期値は24）
const maxHours = Array(D).fill(24);

// 制約を反映
for (let i = 1; i <= N; i++) {
    const [L, R, H] = input[i].split(' ').map(Number);
    for (let day = L - 1; day <= R - 1; day++) {
        maxHours[day] = Math.min(maxHours[day], H);
    }
}

// 最大労働時間の合計を出力
const totalMaxHours = maxHours.reduce((sum, h) => sum + h, 0);
console.log(totalMaxHours);
