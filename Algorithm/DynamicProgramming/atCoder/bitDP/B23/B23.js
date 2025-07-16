// 以下は、Node.js (18.16.1) 環境で動作する、\*\*巡回セールスマン問題（TSP）\*\*をビットDPで解く実装です。
// 距離は **ユークリッド距離**で計算し、すべての都市を訪れて元の都市に戻る最短距離を求めます。

// ```javascript
// Node.js (v18.16.1) における TSP の解法（ビットDP）
// 実行時間制限: 10秒、メモリ制限: 1024MiB

const fs = require('fs');

/**
 * 都市巡回セールスマン問題を解く関数
 * @param {number} N - 都市の数
 * @param {[number, number][]} coords - 都市の座標配列 (X, Y)
 * @returns {number} - 最短距離（絶対/相対誤差10^-3未満で正解）
 */
function solveTSP(N, coords) {
  const dist = Array.from({ length: N }, () => Array(N).fill(0));

  // 距離を前計算
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const dx = coords[i][0] - coords[j][0];
      const dy = coords[i][1] - coords[j][1];
      dist[i][j] = Math.hypot(dx, dy); // √(dx² + dy²)
    }
  }

  const INF = Infinity;
  const dp = Array.from({ length: 1 << N }, () => Array(N).fill(INF));

  // 初期位置を全都市として開始（0都市からスタート）
  dp[1][0] = 0;

  for (let s = 1; s < (1 << N); s++) {
    for (let u = 0; u < N; u++) {
      if (!(s & (1 << u))) continue;
      for (let v = 0; v < N; v++) {
        if (s & (1 << v)) continue;
        const ns = s | (1 << v);
        dp[ns][v] = Math.min(dp[ns][v], dp[s][u] + dist[u][v]);
      }
    }
  }

  // 最後に戻る距離を加える
  let res = INF;
  for (let u = 1; u < N; u++) {
    res = Math.min(res, dp[(1 << N) - 1][u] + dist[u][0]);
  }

  return res;
}

// 入力処理
(function main() {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
  const N = parseInt(input[0], 10);
  const coords = input.slice(1).map(line => line.split(' ').map(Number));

  const result = solveTSP(N, coords);

  // 絶対誤差・相対誤差が 1e-3 未満になるように出力（12桁精度）
  console.log(result.toFixed(12));
})();

// ### ✅ 解説

// * **計算量**: `O(N^2 * 2^N)`（N=15 でも問題なし）
// * **距離の計算**: `Math.hypot(dx, dy)` を使うと精度良くユークリッド距離を計算できます。
// * **メモリ使用量**: 約 `N * 2^N * 8 byte`（最大約 4 MiB 程度）
// * **誤差対策**: `toFixed(12)` で小数第12位まで出力

// ### ✅ 実行例（入力: `input.txt` を指定）

// ```bash
// $ node main.js < input.txt
// 4.000000000000
// ```

// 他の改善（例えば枝刈りやメモ化DFS）もありますが、今回の制約ならこのビットDPが最適です。必要があれば経路復元付きの実装も可能です。
