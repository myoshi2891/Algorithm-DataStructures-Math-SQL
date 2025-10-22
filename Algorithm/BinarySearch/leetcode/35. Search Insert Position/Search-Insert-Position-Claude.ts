// Runtime
// 0
// ms
// Beats
// 100.00%
// Memory
// 55.15
// MB
// Beats
// 73.26%

// この解法のポイント：

// 1. **時間計算量**: O(log n) - バイナリサーチを使用
// 2. **空間計算量**: O(1) - 定数の追加メモリのみ使用

// **アルゴリズムの説明**:
// - バイナリサーチを使って効率的に検索
// - `left`と`right`のポインターで検索範囲を管理
// - 中点の計算で`left + Math.floor((right - left) / 2)`を使用してオーバーフローを防止
// - ターゲットが見つからない場合、`left`が自然に挿入すべき位置を指している

// **処理の流れ**:
// 1. 配列の両端を`left`と`right`で初期化
// 2. 中点`mid`を計算し、`nums[mid]`と`target`を比較
// 3. 一致すれば`mid`を返す
// 4. `nums[mid] < target`なら右半分を検索（`left = mid + 1`）
// 5. `nums[mid] > target`なら左半分を検索（`right = mid - 1`）
// 6. ループ終了時、`left`が挿入位置になる

// この実装はLeetCodeの制約下で最適なパフォーマンスを発揮します。

/**
 * ソート済み配列内でターゲット値のインデックスを検索し、
 * 見つからない場合は挿入すべき位置のインデックスを返す
 *
 * @param nums - ソート済みの重複なし整数配列
 * @param target - 検索対象の整数値
 * @returns ターゲットが見つかった場合はそのインデックス、見つからない場合は挿入位置のインデックス
 */
function searchInsert(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;

    // バイナリサーチでO(log n)の時間計算量を実現
    while (left <= right) {
        // オーバーフローを避けるため、中点計算を最適化
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // ターゲットが見つからない場合、leftが挿入位置を示す
    return left;
}
