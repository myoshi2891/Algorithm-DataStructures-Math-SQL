import * as fs from 'fs';

// 標準入力からデータを読み取る
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

// 最初の行から N と M を取得
const [N, M] = input[0].split(' ').map(Number);

// 隣接リスト：各頂点に対して接続されている頂点の配列
const graph: number[][] = Array.from({ length: N + 1 }, () => []);

// 入力された M 本の辺を処理
for (let i = 1; i <= M; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    graph[a].push(b);
    graph[b].push(a); // 無向グラフなので両方に追加
}

// 各頂点について、隣接頂点を出力
for (let i = 1; i <= N; i++) {
    console.log(`${i}: {${graph[i].join(', ')}}`);
}
