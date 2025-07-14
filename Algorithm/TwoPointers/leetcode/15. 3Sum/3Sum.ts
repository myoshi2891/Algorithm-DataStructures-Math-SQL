// `EACCES: permission denied` は、`threeSum_output.json` を保存する権限が無い場所にファイルを書き込もうとした時に発生します。

// ### 原因例：

// * **書き込み権限がないディレクトリで実行**
// * **Node.js環境（LeetCodeなど）では`fs`が制限されている**
// * **ファイルシステム保護 (Mac/Linuxなどで `/` 直下に保存しようとしたなど)**

// ---

// ## 解決策①：ファイル出力せず標準出力する

// LeetCodeなど**ファイル書き込みが制限されている環境**では `fs` を使えません。
// この場合は、**console.log に出力**すればOKです。

// 修正版（`fs`無し）：
/**
 * 3Sum問題を解く関数
 * @param nums - 入力整数配列
 * @returns number[][] - 和が0になる3つ組のリスト（重複無し）
 */
function threeSum(nums: number[]): number[][] {
    const res: number[][] = [];
    nums.sort((a, b) => a - b); // ソート（O(NlogN)）

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue; // 重複回避

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                res.push([nums[i], nums[left], nums[right]]);

                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;

                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return res;
}

/**
 * 実行時間とメモリ使用量を計測する関数
 * @param nums - 入力整数配列
 * @returns void
 */
function runThreeSumWithMetrics(nums: number[]): void {
    const startMemory = process.memoryUsage().heapUsed;
    const startTime = process.hrtime.bigint();

    const result = threeSum(nums);

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;

    const elapsedTimeMs = Number(endTime - startTime) / 1_000_000; // ミリ秒
    const memoryUsageMB = (endMemory - startMemory) / (1024 * 1024); // MB

    const output = {
        input: nums,
        result: result,
        metrics: {
            timeMs: elapsedTimeMs.toFixed(3),
            memoryMB: memoryUsageMB.toFixed(3)
        }
    };

    console.log(JSON.stringify(output, null, 2));
}

// サンプル実行
const sampleInput = [-1, 0, 1, 2, -1, -4];
runThreeSumWithMetrics(sampleInput);

// ## 解決策②：ローカルで`fs`を使う場合

// もしローカル環境で`fs`を使いたいなら、**実行ディレクトリのパスを確認**してください。

// 以下の安全なパスを使うとエラーを防げます：

// ```typescript
// const path = './threeSum_output.json'; // カレントディレクトリ
// fs.writeFileSync(path, JSON.stringify(output, null, 2), 'utf-8');
// ```

// ---

// ## **まとめ**

// | 実行環境              | 推奨方法                                     |
// | ----------------- | ---------------------------------------- |
// | LeetCode / 権限制限環境 | `console.log` に出力（ファイル出力はNG）             |
// | ローカルNode.js (権限有) | `fs.writeFileSync('./output.json', ...)` |

