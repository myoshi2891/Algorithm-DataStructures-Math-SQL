// ```javascript
/**
 * 関数名: permuteUnique
 * パラメータ:
 *   @param {number[]} nums - 重複を含む可能性がある整数配列
 * 返却値:
 *   @return {number[][]} - 一意な順列の全パターン
 *
 * 処理概要:
 * 1. 入力配列をソートすることで、重複処理を容易にする。
 * 2. バックトラッキングにより順列を生成。
 * 3. 直前の要素と同じで、かつ未使用の場合はスキップすることで重複順列を防ぐ。
 *
 * 計算量:
 * - 時間計算量: O(n * n!) （順列生成の特性上。ただし重複を排除するため平均的には少し軽減される）
 * - 空間計算量: O(n) （再帰スタック + 使用中フラグ配列）
 *
 * Node.js 18.16.1 実行を想定
 */
var permuteUnique = function (nums) {
    nums.sort((a, b) => a - b); // ソートで重複管理を簡単にする
    const res = [];
    const used = new Array(nums.length).fill(false);
    const path = [];

    const backtrack = () => {
        if (path.length === nums.length) {
            res.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            // 既に使った要素はスキップ
            if (used[i]) continue;
            // 同じ数字が続く場合、前の同じ数字を使っていなければスキップ（重複回避）
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

            used[i] = true;
            path.push(nums[i]);

            backtrack();

            // 戻す処理
            path.pop();
            used[i] = false;
        }
    };

    backtrack();
    return res;
};
// ```

// この実装は **バックトラッキング + ソート + 使用フラグ** を用いて、効率的に重複を避けながら一意な順列を生成します。
// 処理時間は最悪 O(n \* n!) ですが、`nums.length <= 8` なので Node.js 環境で十分実用的です。

// 👉 次に、同じ処理を **よりメモリ削減したバージョン**（Set を使わない）で書き直すことも可能ですが、それも提示しますか？
