import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int N = sc.nextInt();
        int K = sc.nextInt();
        
        int minSteps = 2 * (N - 1);
        
        if (K >= minSteps && (K - minSteps) % 2 == 0) {
            System.out.println("Yes");
        } else {
            System.out.println("No");
        }
        
        sc.close();
    }
}
