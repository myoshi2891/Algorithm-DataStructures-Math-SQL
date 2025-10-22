// 以下は、問題に対して **Node.js (v18.16.1)** + `fs` モジュールを用いて、**実行時間・メモリ制限に配慮**した最適な解法です。

// ### ✅ 解法の概要

// * 高さは **1以上の整数**。
// * 隣接の草の大小関係が `'A'` / `'B'` で指定されている。
// * 高さの **合計が最小**になるように、矛盾しないように割り当てる。
// * **グラフとしてのトポロジカルソート + DP的な更新**でも解けるが、より簡単な方法としては **貪欲＋逆走補正**が有効。

// ---

// ### ✅ アルゴリズム（貪欲＋逆方向補正）

// 1. 左から順に、Aが続いていれば1,2,3...と上昇。
// 2. Bが出てきたら、いったん1とし、必要があれば**後ろ向きに補正**。

//    * 連続したBに対して、**山のような形**になるようにする。

// ---

// ### ✅ JavaScript実装（Node.js 18.16.1 + fs）

// ```javascript
// @ts-check
'use strict';

const fs = require('fs');

/**
 * 草の高さの合計として考えられる最小値を計算する
 * @param {number} N - 草の本数
 * @param {string} S - 長さN-1の文字列。'A'または'B'が含まれる。
 * @returns {number} - 最小の合計値
 */
function minTotalGrassHeight(N, S) {
    const height = Array(N).fill(1);

    // 1. 左からAに従って昇順にしていく
    for (let i = 0; i < N - 1; i++) {
        if (S[i] === 'A' && height[i] >= height[i + 1]) {
            height[i + 1] = height[i] + 1;
        }
    }

    // 2. 右からBに従って降順に調整
    for (let i = N - 2; i >= 0; i--) {
        if (S[i] === 'B' && height[i] <= height[i + 1]) {
            height[i] = height[i + 1] + 1;
        }
    }

    // 合計を返す
    return height.reduce((sum, h) => sum + h, 0);
}

// 標準入力から読み込み
function main() {
    const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
    const N = parseInt(input[0], 10);
    const S = input[1];

    const result = minTotalGrassHeight(N, S);
    console.log(result);
}

main();
// ```

// ---

// ### ✅ 実行時間・メモリ使用

// * **時間計算量:** `O(N)`（2回のループだけ）
// * **空間計算量:** `O(N)`（高さ配列のみ）

// ---

// ### ✅ 入力例と出力例

// ```bash
// $ echo -e "7\nAABBBA" | node solve.js
// 15
// ```

// ---

// ### ✅ 解法のポイント補足

// * `A`に従って**前方向に貪欲**。
// * `B`に従って**後方向に調整**。
// * 各草の高さが「最小になるようにかつ条件を満たす」ための定番テクニックです。

// ---

// ご希望があれば、図解や他言語での実装、コードゴルフなども対応可能です。
