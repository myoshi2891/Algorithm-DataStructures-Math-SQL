import java.util.Scanner;

public class A43 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int N = sc.nextInt();
        int L = sc.nextInt();
        int maxTime = 0;

        for (int i = 0; i < N; i++) {
            int A = sc.nextInt();
            String B = sc.next();

            int time = B.equals("E") ? (L - A) : A;
            if (time > maxTime) {
                maxTime = time;
            }
        }

        System.out.println(maxTime);
    }
}
