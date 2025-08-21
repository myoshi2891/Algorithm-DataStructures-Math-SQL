// TypeScriptでの最適化されたソリューションを提供しました。JavaScriptバージョンからの主な変更点：

// ## TypeScriptの追加要素
// 1. **型注釈**: `strs: string[]` と戻り値の型 `string[][]` を明示的に指定
// 2. **ジェネリクス**: `Map<string, string[]>` でMapの型を明示
// 3. **function宣言**: `var` + 関数式から `function` 宣言に変更

// ## パフォーマンス最適化のポイント
// - **型安全性**: TypeScriptの型チェックにより実行時エラーを削減
// - **`Map`の使用**: オブジェクトより高速なO(1)のキー検索
// - **効率的なメモリ使用**: 不要な中間配列を作成しない実装

// ## 計算量（変更なし）
// - **時間計算量**: `O(N * K log K)` 
// - **空間計算量**: `O(N * K)`

// このTypeScript実装は型安全性を提供しながら、LeetCodeでの実行においても元のJavaScriptバージョンと同等の高いパフォーマンスを維持します。TypeScript 5.1の機能を活用して、コードの可読性と保守性も向上しています。

/**
 * アナグラムをグループ化する関数
 * @param strs - 文字列の配列
 * @returns グループ化されたアナグラムの2次元配列
 */
function groupAnagrams(strs: string[]): string[][] {
    // Mapオブジェクトを使用してアナグラムをグループ化
    // キー: ソートされた文字列、値: アナグラムの配列
    const anagramMap = new Map<string, string[]>();
    
    for (const str of strs) {
        // 文字列をソートしてキーとして使用
        // split('')で文字配列に変換 → sort()でソート → join('')で文字列に戻す
        const sortedStr = str.split('').sort().join('');

        // Mapにキーが存在しない場合は新しい配列を作成
        if (!anagramMap.has(sortedStr)) {
            anagramMap.set(sortedStr, []);
        }

        // 現在の文字列をグループに追加
        // Non-null assertion operator (!) を使用してTypeScriptに値の存在を保証
        anagramMap.get(sortedStr)!.push(str);
    }

    // another solution
    //  for (const str of strs) {
    //      // 文字列をソートしてキーとして使用
    //      // split('')で文字配列に変換 → sort()でソート → join('')で文字列に戻す
    //      const sortedStr = str.split('').sort().join('');

    //      // より安全なアプローチ: 既存の配列を取得するか新しい配列を作成
    //      const existingGroup = anagramMap.get(sortedStr) ?? [];
    //      existingGroup.push(str);
    //      anagramMap.set(sortedStr, existingGroup);
    //  }
    
    // Mapの値（アナグラムのグループ）を配列として返却
    return Array.from(anagramMap.values());
};