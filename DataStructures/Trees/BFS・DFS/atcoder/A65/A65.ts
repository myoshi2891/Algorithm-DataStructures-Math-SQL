import * as fs from 'fs';

// 入力取得
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N: number = Number(input[0]);
const A: number[] = input.slice(1).join(' ').split(' ').map(Number);

// 木構造：子リストを作成（1-indexed）
const tree: number[][] = Array.from({ length: N + 1 }, () => []);

// A[i]は社員(i+2)の上司 → tree[A[i]] に i+2 を追加
for (let i = 0; i < A.length; i++) {
    const parent: number = A[i];
    const child: number = i + 2;
    tree[parent].push(child);
}

// 部下数を格納する配列（1-indexed）
const subordinates: number[] = Array(N + 1).fill(0);

// DFSで部下数を計算
const dfs = (node: number): number => {
    let count = 0;
    for (const child of tree[node]) {
        count += 1 + dfs(child); // 1（直属） + その子の部下数
    }
    subordinates[node] = count;
    return count;
};

dfs(1); // 社長からスタート

// 結果出力（1-indexed の 1～N を出力）
console.log(subordinates.slice(1).join(' '));
