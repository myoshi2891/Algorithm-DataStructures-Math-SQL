import java.util.*;

public class A42 {
    static class Student {
        int a, b;
        Student(int a, int b) {
            this.a = a;
            this.b = b;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int K = sc.nextInt();
        List<Student> students = new ArrayList<>();

        for (int i = 0; i < N; i++) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            students.add(new Student(a, b));
        }

        // Step 1: 体力でソート
        students.sort(Comparator.comparingInt(s -> s.a));

        int maxCount = 0;

        for (int i = 0; i < N; i++) {
            List<Student> temp = new ArrayList<>();

            // Step 2: 体力の差がK以内の生徒を抽出
            for (int j = i; j < N; j++) {
                if (students.get(j).a - students.get(i).a > K) break;
                temp.add(students.get(j));
            }

            // Step 3: 気力でソート
            temp.sort(Comparator.comparingInt(s -> s.b));

            // Step 4: スライディングウィンドウで気力の差がK以内の最大人数を探索
            int l = 0;
            for (int r = 0; r < temp.size(); r++) {
                while (temp.get(r).b - temp.get(l).b > K) {
                    l++;
                }
                maxCount = Math.max(maxCount, r - l + 1);
            }
        }

        System.out.println(maxCount);
    }
}
