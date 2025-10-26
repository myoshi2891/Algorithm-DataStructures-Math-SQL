#!/bin/python3

import os
# import math
# import random
# import re
# import sys

#
# Complete the 'summingSeries' function below.
#
# The function is expected to return an INTEGER.
# The function accepts LONG_INTEGER n as parameter.
#

MOD: int = 1_000_000_007


def summingSeries(n: int) -> int:
    # Series telescopes to n^2; return modulo 1e9+7
    n_mod = n % MOD
    return (n_mod * n_mod) % MOD


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(input().strip())

    for t_itr in range(t):
        n = int(input().strip())

        result = summingSeries(n)

        fptr.write(str(result) + "\n")

    fptr.close()
