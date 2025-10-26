import java.util.Scanner;

public class A38 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int D = sc.nextInt(); // 日数
        int N = sc.nextInt(); // 制約の数

        // 各日ごとの最大労働時間（初期値は24時間）
        int[] maxHours = new int[D];
        for (int i = 0; i < D; i++) {
            maxHours[i] = 24;
        }

        // 制約を適用
        for (int i = 0; i < N; i++) {
            int L = sc.nextInt();
            int R = sc.nextInt();
            int H = sc.nextInt();

            // L〜R の日を制限
            for (int day = L - 1; day <= R - 1; day++) {
                maxHours[day] = Math.min(maxHours[day], H);
            }
        }

        // 合計時間を計算
        int total = 0;
        for (int h : maxHours) {
            total += h;
        }

        System.out.println(total);
    }
}
