const fs = require('fs');

// 入力取得
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// 隣接リストを初期化（1-based index）
const graph = Array.from({ length: N + 1 }, () => []);

// 辺情報の読み込みと隣接リストへの追加
for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a);
}

// 出力
for (let i = 1; i <= N; i++) {
    console.log(`${i}: {${graph[i].join(', ')}}`);
}

// ✅ メモリ節約のための対策
// 1. 標準入力を逐次処理する（ストリーミング入力）
// 大量の入力がある場合、すべてを一括で読み込まず、readline モジュールを使って1行ずつ処理することでメモリ削減になります。
// ✅ メモリ使用量が減る理由
// 行単位の読み込みで、巨大な文字列を保持しない。

// input.split('\n') による配列が不要になる。

// 提出日時	問題	ユーザ	言語	得点	コード長	結果	実行時間	メモリ
// 2025-06-15 13:26:20	A61 - Adjacent Vertices	myoshizumi 	JavaScript (Node.js 18.16.1)	1000	623 Byte		581 ms	101592 KiB	詳細
// 2025-06-15 13:24:36	A61 - Adjacent Vertices	myoshizumi 	JavaScript (Node.js 18.16.1)	1000	564 Byte		580 ms	110924 KiB	詳細

// 結果：若干メモリが減る程度

// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
// });

// let N = 0,
//     M = 0;
// let lineCount = 0;
// let graph = [];

// rl.on('line', (line) => {
//     if (lineCount === 0) {
//         [N, M] = line.split(' ').map(Number);
//         graph = Array.from({ length: N + 1 }, () => []);
//     } else {
//         const [a, b] = line.split(' ').map(Number);
//         graph[a].push(b);
//         graph[b].push(a);
//     }

//     lineCount++;
// });

// rl.on('close', () => {
//     for (let i = 1; i <= N; i++) {
//         console.log(`${i}: {${graph[i].join(', ')}}`);
//     }
// });
