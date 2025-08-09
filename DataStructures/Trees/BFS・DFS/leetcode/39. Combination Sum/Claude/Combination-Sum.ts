// TypeScript版に更新しました。主な変更点：
// Runtime
// 2
// ms
// Beats
// 87.18%
// Memory
// 60.60
// MB
// Beats
// 69.89%

// **TypeScript固有の改善:**
// 1. **型注釈の追加**:
//    - 関数の引数と戻り値に明確な型定義
//    - 内部変数にも適切な型注釈を付与

// 2. **型安全性の向上**:
//    - `number[]` と `number[][]` で配列の要素型を明示
//    - ソート関数の引数にも型注釈

// 3. **関数宣言の変更**:
//    - `var`から`function`宣言に変更（より適切なTypeScriptスタイル）
//    - 内部関数`dfs`の戻り値型を`void`で明示

// **LeetCode TypeScript環境での最適化:**
// - TypeScriptコンパイラによる型チェックで実行時エラーを予防
// - 型情報により最適化されたJavaScriptコードを生成
// - Node.js 18.16.1環境での高速実行を考慮

// この実装はTypeScript 5.1の機能を活用しつつ、DFS + バックトラッキングアルゴリズムの効率性を保持しています。

/**
 * @param {number[]} candidates - 重複のない正の整数の配列
 * @param {number} target - 目標となる合計値
 * @return {number[][]} - targetに合計が等しくなる全ての組み合わせの配列
 */
function combinationSumClaude(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    const currentCombination: number[] = [];

    // パフォーマンス向上のため配列をソート（小さい数から試すことで早期終了を促進）
    candidates.sort((a: number, b: number) => a - b);

    /**
     * DFS + バックトラッキングによる再帰探索
     * @param {number} startIndex - 探索開始インデックス（重複回避のため）
     * @param {number} remainingTarget - 残りの目標値
     */
    function dfs(startIndex: number, remainingTarget: number): void {
        // ベースケース：目標値に到達
        if (remainingTarget === 0) {
            result.push([...currentCombination]); // 配列のコピーを作成
            return;
        }

        // 残りの目標値が負の場合は無効なパス
        if (remainingTarget < 0) {
            return;
        }

        // 現在のインデックスから配列の末尾まで探索
        for (let i: number = startIndex; i < candidates.length; i++) {
            const candidate: number = candidates[i];

            // 早期終了：ソート済み配列なので、現在の候補が残り目標値より大きい場合
            // それ以降の候補も全て大きいため探索を打ち切る
            if (candidate > remainingTarget) {
                break;
            }

            // 現在の候補を組み合わせに追加
            currentCombination.push(candidate);

            // 再帰呼び出し：同じ数字を何度でも使えるためstartIndexはiのまま
            dfs(i, remainingTarget - candidate);

            // バックトラッキング：追加した候補を削除して次の候補を試す
            currentCombination.pop();
        }
    }

    // DFS探索を開始
    dfs(0, target);

    return result;
}
