// コード長	998 Byte
// 実行時間	121 ms
// メモリ	65428 KB
// 標準入力からデータを読み込み（Node.js 実行時）
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8');

function solveEventAttendance(input) {
    const lines = input.trim().split('\n');
    const D = +lines[0];
    const N = +lines[1];

    // 差分配列を初期化
    const diff = new Array(D + 1).fill(0);

    // 差分配列を更新
    for (let i = 2; i < N + 2; i++) {
        const [L, R] = lines[i].split(' ').map(Number);
        diff[L] += 1;
        if (R + 1 <= D) {
            diff[R + 1] -= 1;
        }
    }

    // console.log(diff);
    // 累積和で出席者数を計算
    const attendance = new Array(D).fill(0);
    attendance[0] = diff[1]; // 初日の値を設定
    for (let i = 2; i <= D; i++) {
        attendance[i - 1] = attendance[i - 2] + diff[i];
    }

    // 結果を改行区切りで返す
    return attendance.join('\n');
}

console.log(solveEventAttendance(input));
