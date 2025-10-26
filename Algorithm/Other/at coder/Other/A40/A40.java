import java.util.Scanner;

public class A40 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 1行目: N の読み取り
        int N = scanner.nextInt();

        // 棒の長さは 1〜100 の範囲
        int[] count = new int[101];

        // 各棒の長さの本数をカウント
        for (int i = 0; i < N; i++) {
            int length = scanner.nextInt();
            count[length]++;
        }

        // 正三角形が作れる組み合わせを数える
        long result = 0;
        for (int i = 1; i <= 100; i++) {
            int c = count[i];
            if (c >= 3) {
                result += (long) c * (c - 1) * (c - 2) / 6;
            }
        }

        System.out.println(result);
    }
}
