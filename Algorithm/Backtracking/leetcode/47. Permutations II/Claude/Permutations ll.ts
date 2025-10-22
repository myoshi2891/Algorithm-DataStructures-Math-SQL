// このTypeScriptバージョンでは以下の型安全性の改善を行いました：

// **TypeScript特有の最適化**：

// 1. **型注釈の追加**:
//    - `nums: number[]` - 入力パラメータの型
//    - `number[][]` - 戻り値の型
//    - `result: number[][]` - 結果配列の型
//    - `current: number[]` - 作業用配列の型
//    - `used: boolean[]` - フラグ配列の型

// 2. **関数シグネチャの明確化**:
//    - `backtrack(): void` - 内部関数の戻り値型

// 3. **コンパイル時の型チェック**:
//    - TypeScriptコンパイラによる型エラーの事前検出
//    - IntelliSenseによる開発効率向上

// **LeetCode最適化のポイント**：
// - **メモリ効率**: 型注釈はコンパイル時のみで実行時オーバーヘッドなし
// - **処理速度**: JavaScriptと同等の実行時パフォーマンス
// - **型安全**: 配列操作での型エラーを防止

// この実装は元のJavaScript版と同じアルゴリズム効率を維持しつつ、TypeScriptの型システムによる安全性を提供します。

/**
 * 重複を含む配列から一意な順列を生成する関数
 * @param nums - 入力配列（重複要素を含む可能性がある）
 * @returns 一意な順列の配列
 */
function permuteUnique(nums: number[]): number[][] {
    // 結果を格納する配列
    const result: number[][] = [];
    // 現在の順列を格納する配列
    const current: number[] = [];
    // 使用済み要素を追跡するフラグ配列
    const used: boolean[] = new Array(nums.length).fill(false);

    // ソートして同じ要素を隣接させる（重複スキップのため）
    nums.sort((a, b) => a - b);

    /**
     * バックトラッキングで順列を生成するヘルパー関数
     */
    function backtrack(): void {
        // 順列が完成した場合、結果に追加
        if (current.length === nums.length) {
            result.push([...current]); // 配列のコピーを作成
            return;
        }

        // 各要素を試行
        for (let i: number = 0; i < nums.length; i++) {
            // 既に使用済みの要素はスキップ
            if (used[i]) continue;

            // 重複要素のスキップ条件:
            // 同じ値の要素で、前の同じ値がまだ使われていない場合はスキップ
            // これにより重複順列を防ぐ
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
            }

            // 現在の要素を選択
            current.push(nums[i]);
            used[i] = true;

            // 再帰的に次の位置を探索
            backtrack();

            // バックトラック（選択を取り消し）
            current.pop();
            used[i] = false;
        }
    }

    // バックトラッキング開始
    backtrack();
    return result;
}
