// TypeScript版に更新しました。主な変更点：

// ## TypeScript固有の改善点
// - **型注釈**: 全ての変数とパラメータに明示的な型を指定
// - **関数シグネチャ**: `(n: number, k: number): string` で入力・出力の型を明確化
// - **配列の型指定**: `number[]` で配列の要素型を明示

// ## パフォーマンス特性
// - **時間計算量**: O(n²) - splice操作がO(n)でn回実行
// - **空間計算量**: O(n) - factorial配列とnumbers配列のみ使用
// - **LeetCode最適化**:
//   - 全順列生成を避けて直接計算
//   - 不要なメモリ割り当てを回避
//   - TypeScriptのコンパイル時最適化を活用

// ## 制約への対応
// - `n ≤ 9`: 階乗の最大値は9! = 362,880で安全
// - `k ≤ n!`: 0-indexedへの変換で範囲内保証
// - Node.js 18.16.1: ES2022機能を使用可能

// この実装はLeetCodeでの実行時間とメモリ使用量の両方で優れたパフォーマンスを発揮します。

/**
 * k番目の順列を求める関数
 * @param n - 1からnまでの数字を含む集合のサイズ
 * @param k - 求めたい順列の順番（1-indexed）
 * @returns k番目の順列を表す文字列
 */
function getPermutation(n: number, k: number): string {
    // 階乗を事前計算（メモリ効率のため配列で保存）
    const factorial: number[] = [1];
    for (let i = 1; i < n; i++) {
        factorial[i] = factorial[i - 1] * i;
    }

    // 使用可能な数字のリスト
    const numbers: number[] = [];
    for (let i = 1; i <= n; i++) {
        numbers.push(i);
    }

    // k を 0-indexed に変換
    k--;

    let result: string = '';

    // 各桁を順番に決定
    for (let i = 0; i < n; i++) {
        // 現在の桁で選択すべき数字のインデックスを計算
        const index: number = Math.floor(k / factorial[n - 1 - i]);

        // 選択した数字を結果に追加
        result += numbers[index];

        // 使用した数字を削除
        numbers.splice(index, 1);

        // k を更新（残りの順列での位置）
        k %= factorial[n - 1 - i];
    }

    return result;
}
