/** @type {import("prettier").Config} */
export default {
    semi: true, // 文末にセミコロンを付ける
    singleQuote: true, // シングルクォートを使用
    trailingComma: 'all', // 複数行の配列・オブジェクトなどの末尾にカンマを付ける
    tabWidth: 4, // インデント幅は2スペース
    useTabs: false, // スペースでインデント
    printWidth: 100, // 1行の最大文字数（超えると改行される）
    bracketSpacing: true, // オブジェクトリテラルの中にスペースを入れる: { foo: bar }
    arrowParens: 'always', // アロー関数の引数に括弧を常に付ける
    endOfLine: 'lf', // 改行コードをLFに統一（Gitなどで混乱を避けるため）
};
