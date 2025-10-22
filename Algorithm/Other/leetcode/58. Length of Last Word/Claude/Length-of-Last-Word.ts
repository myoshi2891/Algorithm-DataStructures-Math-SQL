// TypeScriptバージョンに更新しました。主な変更点は：

// **TypeScript特有の変更:**
// - `function`キーワードを使用した関数宣言
// - パラメーター`s`に`string`型注釈を追加
// - 戻り値に`number`型注釈を追加
// - JSDocコメントをTypeScript形式に変更（`@param`と`@returns`）

// **パフォーマンスの特徴:**
// - **時間計算量:** O(n) - 文字列の長さに比例
// - **空間計算量:** O(1) - 定数メモリのみ使用
// - TypeScriptの型チェックにより、コンパイル時の安全性が向上

// この実装は型安全性を保ちながら、JavaScriptバージョンと同じ効率性を維持しています。LeetCodeでの実行においても、型注釈がランタイムに影響を与えることはないため、パフォーマンスは同等です。

/**
 * 文字列の最後の単語の長さを返す関数
 * @param s - 英字とスペースで構成された文字列
 * @returns 最後の単語の長さ
 */
function lengthOfLastWord(s: string): number {
    // 文字列の末尾から開始して、スペースをスキップ
    let i = s.length - 1;

    // 末尾のスペースをスキップ
    while (i >= 0 && s[i] === ' ') {
        i--;
    }

    // 最後の単語の長さをカウント
    let length = 0;
    while (i >= 0 && s[i] !== ' ') {
        length++;
        i--;
    }

    return length;
}
