function lengthOfLongestSubstring(s: string): number {
    let start = 0;
    let maxLength = 0;
    const charIndexMap: Map<string, number> = new Map();

    for (let end = 0; end < s.length; end++) {
        const currentChar = s[end];

        // 重複が見つかれば start を更新（同じ文字がウィンドウ内にあれば）
        if (charIndexMap.has(currentChar) && charIndexMap.get(currentChar)! >= start) {
            start = charIndexMap.get(currentChar)! + 1;
        }

        // 現在の文字のインデックスを記録
        charIndexMap.set(currentChar, end);

        // 最大長を更新
        maxLength = Math.max(maxLength, end - start + 1);
    }

    return maxLength;
}
