// 以下は、Node.js (18.16.1) + JavaScript (ES6) を使い、**4Sum問題**を `fs` モジュールを用いて処理時間とメモリ消費量を測定する実装です。

// ---

// ## **要件まとめ**

// * **環境**: Node.js 18.16.1
// * **実装形式**: クラスではなく関数
// * **入出力形式**: LeetCode形式（関数で返す）
// * **処理時間とメモリ**: `process.hrtime.bigint()` と `process.memoryUsage()`
// * **ファイル出力**: `fs.writeFileSync`で結果とリソース使用量を出力

// ---

// ## **実装コード**

// ```javascript
const fs = require('fs');

/**
 * 四つ組みの和を求める関数 (4Sum)
 * 
 * @param {number[]} nums - 整数配列 (長さ1~200)
 * @param {number} target - 目標の合計値
 * @returns {number[][]} - targetと等しい4つ組のリスト
 * 
 * 出力結果、処理時間、メモリ消費量は output.txt に保存されます。
 */
function fourSum(nums, target) {
    const startMem = process.memoryUsage().heapUsed;
    const startTime = process.hrtime.bigint();

    const result = [];
    nums.sort((a, b) => a - b);
    const n = nums.length;

    for (let i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        for (let j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            let left = j + 1;
            let right = n - 1;

            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];

                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }

    const endTime = process.hrtime.bigint();
    const endMem = process.memoryUsage().heapUsed;

    const timeMs = Number(endTime - startTime) / 1e6; // ミリ秒
    const memUsageKB = (endMem - startMem) / 1024;    // KB

    // ファイル出力
    const output = {
        result: result,
        executionTimeMs: timeMs.toFixed(3),
        memoryUsageKB: memUsageKB.toFixed(3)
    };

    fs.writeFileSync('output.txt', JSON.stringify(output, null, 2));

    return result;
}

module.exports = { fourSum };
// ```

// ---

// ## **実行方法**

// 1. `fourSum`関数をLeetCode形式で呼び出せます。
// 2. `output.txt` に結果とリソース情報を出力します。

// ---

// ## **例**

// ```javascript
// // テスト実行例 (ローカル確認用)
// const { fourSum } = require('./yourFileName.js');

// const nums = [1, 0, -1, 0, -2, 2];
// const target = 0;

// console.log(fourSum(nums, target));
// ```

// ---

// ## **出力ファイル (output.txt)**

// ```json
// {
//   "result": [
//     [-2, -1, 1, 2],
//     [-2, 0, 0, 2],
//     [-1, 0, 0, 1]
//   ],
//   "executionTimeMs": "1.234",
//   "memoryUsageKB": "8.500"
// }
// ```

// ---

// ## **計算量**

// | 項目    | 内容                |
// | ----- | ----------------- |
// | 時間計算量 | O(n³)             |
// | 空間計算量 | O(n)（出力リスト＋ソート領域） |

// ---

// ## **補足**

// * `process.hrtime.bigint()` はナノ秒精度で計測できます（Node.js推奨）
// * `process.memoryUsage().heapUsed` でヒープ使用量を計測（メモリ差分を計算）
// * ファイル出力形式は `JSON.stringify` で見やすい整形

// ---

// ## **拡張対応可能**

// * `BigInt`対応版
// * `kSum`汎用化
// * Web環境版やストリーム処理版
