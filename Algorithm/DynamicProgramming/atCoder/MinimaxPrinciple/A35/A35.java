import java.util.*;

public class Main {
    static int[][] memo;
    static int[] A;
    static int N;

    public static int dfs(int l, int r) {
        if (l == r) return A[l];
        if (memo[l][r] != -1) return memo[l][r];

        boolean taroTurn = (r - l + 1) % 2 == N % 2;

        if (taroTurn) {
            memo[l][r] = Math.max(dfs(l + 1, r), dfs(l, r - 1));
        } else {
            memo[l][r] = Math.min(dfs(l + 1, r), dfs(l, r - 1));
        }

        return memo[l][r];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        N = sc.nextInt();
        A = new int[N];
        for (int i = 0; i < N; i++) {
            A[i] = sc.nextInt();
        }

        memo = new int[N][N];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        System.out.println(dfs(0, N - 1));
    }
}
