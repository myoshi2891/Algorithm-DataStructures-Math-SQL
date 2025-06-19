const fs = require('fs');

// 入力
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N = Number(input[0]);
const A = input.slice(1).join(' ').split(' ').map(Number);

// グラフ構築（直属の部下リストを作成）
const tree = Array.from({ length: N + 1 }, () => []);
for (let i = 0; i < A.length; i++) {
    const parent = A[i];
    const child = i + 2; // i=0 のとき 2番目の社員
    tree[parent].push(child);
}

// 結果を格納する配列
const subordinates = Array(N + 1).fill(0);

// DFSで部下数を計算
function dfs(node) {
    let count = 0;
    for (const child of tree[node]) {
        count += 1 + dfs(child); // 自分の部下＋その部下の部下たち
    }
    subordinates[node] = count;
    return count;
}

dfs(1); // 社長からスタート

// 結果を出力（1 から N）
console.log(subordinates.slice(1).join(' '));
