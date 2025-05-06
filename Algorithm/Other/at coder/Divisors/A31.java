import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long N = scanner.nextLong();
        scanner.close();

        long count3 = N / 3;
        long count5 = N / 5;
        long count15 = N / 15;

        long result = count3 + count5 - count15;
        System.out.println(result);
    }
}
