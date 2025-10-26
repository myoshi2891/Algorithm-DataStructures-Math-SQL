# You're right — keep everything ASCII-only. Also, I realized the intended math is over **all non-empty subsequences** (count = 2^N - 1), not contiguous subarrays. The correct identity is:

# Sum over all non-empty subsequences S of 2^(sum(S))
# = ( Product over i of (1 + 2^(a_i)) ) - 1  (subtract the empty subsequence)

# So we just multiply (1 + pow(2, a_i, MOD)) for each element and subtract 1, all modulo MOD.

# Below is a clean, ASCII-only HackerRank-format solution (type-annotated, no non-ASCII comments/strings).

# ```python
#!/bin/python3

import os

# import sys
from typing import List

MOD: int = 1_000_000_007


# Complete the solve function below.
def solve(a: List[int]) -> int:
    """
    Compute P = sum over all non-empty subsequences S of 2^(sum(S)) mod MOD.
    Uses: sum_{S subset} prod_{i in S} 2^{a_i} = prod_i (1 + 2^{a_i})
    Subtract 1 to exclude the empty subsequence.
    Time: O(N), Space: O(1)
    """
    prod: int = 1
    for ai in a:
        term = (1 + pow(2, ai, MOD)) % MOD
        prod = (prod * term) % MOD
    return (prod - 1) % MOD


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    a_count = int(input())
    a = list(map(int, input().rstrip().split()))

    result = solve(a)

    fptr.write(str(result) + "\n")

    fptr.close()
# ```

# Quick notes:

# * No non-ASCII characters in code or comments.
# * `pow(2, ai, MOD)` handles very large `ai` efficiently with modular exponentiation.
# * Subtract 1 at the end to remove the empty subsequence contribution.
