// TypeScriptバージョンに更新しました。主な変更点：

// 1. **型注釈の追加**:
//    - 関数パラメーター: `nums: number[]`
//    - 戻り値の型: `number`
//    - ローカル変数にも明示的な型注釈を追加

// 2. **JSDocコメントの調整**:
//    - TypeScript標準のJSDocフォーマットに変更
//    - `@param`と`@returns`の記法を使用

// 3. **型安全性**:
//    - コンパイル時に型チェックが行われる
//    - IDEでより良い補完とエラー検出が可能

// この実装は引き続き：
// - **時間計算量**: O(n) - 線形時間
// - **空間計算量**: O(1) - 定数空間
// - **LeetCode最適化**: メモリ効率とパフォーマンスを重視

// TypeScript 5.1の機能を活用しつつ、LeetCodeでの実行時間とメモリ消費量を最小限に抑えた実装となっています。
/**
 * 最小ジャンプ数で配列の最後のインデックスに到達する
 * @param nums - 0-indexedの整数配列、各要素はそのインデックスから可能な最大ジャンプ長を表す
 * @returns 最後のインデックス(n-1)に到達するための最小ジャンプ数
 *
 * 時間計算量: O(n) - 配列を一度だけ走査
 * 空間計算量: O(1) - 定数の追加空間のみ使用
 */
function jump(nums: number[]): number {
    const n: number = nums.length;

    // ベースケース: 配列が1つの要素のみの場合
    if (n <= 1) return 0;

    let jumps: number = 0; // 現在のジャンプ数
    let currentEnd: number = 0; // 現在のジャンプで到達可能な最遠インデックス
    let farthest: number = 0; // これまでに到達可能な最遠インデックス

    // 最後のインデックスの1つ前まで処理（最後に到達すれば完了）
    for (let i: number = 0; i < n - 1; i++) {
        // 現在位置から到達可能な最遠距離を更新
        farthest = Math.max(farthest, i + nums[i]);

        // 現在のジャンプで到達可能な範囲の終端に達した場合
        if (i === currentEnd) {
            jumps++; // ジャンプ数を増加
            currentEnd = farthest; // 次のジャンプで到達可能な最遠地点を設定

            // 既に最後のインデックスに到達可能な場合は終了
            if (currentEnd >= n - 1) {
                break;
            }
        }
    }

    return jumps;
}
