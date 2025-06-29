function longestPalindrome(s: string): string {
    if (s.length <= 1) return s;

    let start = 0;
    let end = 0;

    const expandAroundCenter = (left: number, right: number): void => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // [left+1, right-1] が現在の回文
        if (right - left - 1 > end - start) {
            start = left + 1;
            end = right - 1;
        }
    };

    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i); // 奇数長の回文中心
        expandAroundCenter(i, i + 1); // 偶数長の回文中心
    }

    return s.slice(start, end + 1);
}
