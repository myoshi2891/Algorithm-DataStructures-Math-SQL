const fs = require('fs');

const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
const N = parseInt(input[0]);
const grid = [];
let idx = 1;

for (let i = 0; i < N; i++) {
    const row = [];
    for (let j = 0; j < N; j++) {
        row.push(Number(input[idx++]));
    }
    grid.push(row);
}

// 行と列の現在位置を記録（k=1〜N の位置）
const rowPos = Array(N + 1);
const colPos = Array(N + 1);

for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        const val = grid[i][j];
        if (val !== 0) {
            rowPos[val] = i;
            colPos[val] = j;
        }
    }
}

// 目的地はそれぞれ (k-1, k-1) に配置すること
const rowPerm = []; // 各kの現在の行インデックス
const colPerm = []; // 各kの現在の列インデックス

for (let k = 1; k <= N; k++) {
    rowPerm.push(rowPos[k]);
    colPerm.push(colPos[k]);
}

// 転倒数を求める関数（BIT/Fenwick Tree使用）
function countInversions(arr) {
    const bit = Array(N + 2).fill(0);
    let inv = 0;

    function update(i) {
        i += 1;
        while (i <= N + 1) {
            bit[i]++;
            i += i & -i;
        }
    }

    function query(i) {
        i += 1;
        let res = 0;
        while (i > 0) {
            res += bit[i];
            i -= i & -i;
        }
        return res;
    }

    // 座標圧縮が不要なのは 0〜N-1 の整数が並ぶため
    for (let i = arr.length - 1; i >= 0; i--) {
        inv += query(arr[i] - 1);
        update(arr[i]);
    }

    return inv;
}

const rowMoves = countInversions(rowPerm);
const colMoves = countInversions(colPerm);

console.log(rowMoves + colMoves);
