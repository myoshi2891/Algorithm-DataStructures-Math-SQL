// この問題は配列の順列（permutation）を求める問題ですね。バックトラッキングを使った効率的な解法を提供します。この解法の特徴：

// **時間計算量**: O(n! × n) - n個の要素の順列はn!個あり、各順列を構築するのにO(n)時間かかります

// **空間計算量**: O(n) - 再帰の深さがnで、usedフラグ配列とcurrentPermutationがO(n)のスペースを使用

// **最適化のポイント**:
// 1. **usedフラグ配列**: booleanの配列を使って使用済み要素を効率的に追跡
// 2. **スプレッド演算子**: `[...currentPermutation]`でコピーを作成し、参照の問題を回避
// 3. **バックトラッキング**: 不要な計算を避けて効率的に全ての組み合わせを探索
// 4. **インプレース操作**: currentPermutationに対してpush/popを使用してメモリ使用量を最小化

// この実装はLeetCodeでの実行時間とメモリ使用量の両方で良好なパフォーマンスを示します。制約が`nums.length <= 6`なので、最大でも6! = 720個の順列しか生成されないため、十分高速に動作します。

/**
 * 配列の全ての順列を生成する関数
 * @param {number[]} nums - 異なる整数の配列
 * @return {number[][]} - 全ての可能な順列の配列
 */
var permute = function (nums) {
    const result = [];
    const currentPermutation = [];
    const used = new Array(nums.length).fill(false);

    /**
     * バックトラッキングを用いて順列を生成するヘルパー関数
     * @param {number[]} nums - 元の配列
     * @param {number[]} currentPermutation - 現在構築中の順列
     * @param {boolean[]} used - 各要素が使用されているかを示すフラグ配列
     * @param {number[][]} result - 結果を格納する配列
     */
    function backtrack(nums, currentPermutation, used, result) {
        // ベースケース: 現在の順列の長さが元の配列と同じになったら完成
        if (currentPermutation.length === nums.length) {
            result.push([...currentPermutation]); // スプレッド演算子でコピーを作成
            return;
        }

        // 各要素を試行
        for (let i = 0; i < nums.length; i++) {
            // 既に使用されている要素はスキップ
            if (used[i]) continue;

            // 要素を追加してマークする
            currentPermutation.push(nums[i]);
            used[i] = true;

            // 再帰的に次の位置を埋める
            backtrack(nums, currentPermutation, used, result);

            // バックトラック: 追加した要素を削除してマークを外す
            currentPermutation.pop();
            used[i] = false;
        }
    }

    backtrack(nums, currentPermutation, used, result);
    return result;
};
