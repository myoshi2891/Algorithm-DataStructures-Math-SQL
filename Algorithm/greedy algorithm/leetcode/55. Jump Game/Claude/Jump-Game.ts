// TypeScript版に更新しました。

// **主な変更点：**
// - パラメータに型注釈 `nums: number[]` を追加
// - 返り値の型注釈 `: boolean` を追加
// - JSDocコメントをTypeScript形式に変更（`@param {type}`から`@param`へ、`@return`から`@returns`へ）

// **TypeScriptの利点：**
// - コンパイル時の型チェックにより実行時エラーを防ぐ
// - IDEでの自動補完とエラー検出が向上
// - LeetCodeのTypeScript環境での最適化されたパフォーマンス

// アルゴリズム自体は変更なく、同じ O(n) の時間計算量と O(1) の空間計算量を維持しています。

/**
 * 配列の最後のインデックスに到達できるかどうかを判定する関数
 *
 * @param nums - 各位置での最大ジャンプ長を表す整数配列
 * @returns 最後のインデックスに到達できる場合はtrue、そうでなければfalse
 *
 * 時間計算量: O(n) - 配列を一度だけ走査
 * 空間計算量: O(1) - 定数の追加メモリのみ使用
 */
function canJumpClaude(nums: number[]): boolean {
    // 現在到達可能な最大インデックスを追跡
    let maxReach = 0;

    // 配列の各要素を順番に処理
    for (let i = 0; i < nums.length; i++) {
        // 現在の位置が到達可能範囲を超えている場合、最後まで到達不可能
        if (i > maxReach) {
            return false;
        }

        // 現在の位置から到達可能な最大インデックスを更新
        maxReach = Math.max(maxReach, i + nums[i]);

        // 既に最後のインデックス以上に到達可能な場合、早期終了
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }

    // ループが完了した場合、最後のインデックスに到達可能
    return true;
}
