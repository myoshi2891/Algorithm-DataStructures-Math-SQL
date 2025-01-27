import * as fs from "fs";

// 標準入力の読み取り
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");

// グリッドのサイズ H, W を読み取る
const [H, W] = input[0].split(" ").map(Number);

// グリッドのデータを読み取る
const grid: number[][] = [];
for (let i = 0; i < H; i++) {
  grid.push(input[i + 1].split(" ").map(Number));
}

// 累積和テーブルの作成 (1-based index)
const S: number[][] = Array.from({ length: H + 1 }, () =>
  Array(W + 1).fill(0)
);

// 累積和テーブルを計算
for (let i = 1; i <= H; i++) {
  for (let j = 1; j <= W; j++) {
    S[i][j] =
      grid[i - 1][j - 1] +
      S[i - 1][j] +
      S[i][j - 1] -
      S[i - 1][j - 1];
  }
}

// クエリの数 Q を読み取る
const Q = Number(input[H + 1]);

// クエリの処理
const results: number[] = [];
for (let q = 0; q < Q; q++) {
  const [A, B, C, D] = input[H + 2 + q].split(" ").map(Number);

  // 累積和を使って指定範囲の合計を計算
  const sum =
    S[C][D] - S[A - 1][D] - S[C][B - 1] + S[A - 1][B - 1];

  results.push(sum);
}

// 結果の出力
console.log(results.join("\n"));
