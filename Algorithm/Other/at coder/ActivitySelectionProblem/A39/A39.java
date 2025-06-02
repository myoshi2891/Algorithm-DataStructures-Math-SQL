import java.util.*;

public class A39 {

    static class Movie {
        int start, end;

        Movie(int start, int end) {
            this.start = start;
            this.end = end;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Movie[] movies = new Movie[n];

        for (int i = 0; i < n; i++) {
            int start = sc.nextInt();
            int end = sc.nextInt();
            movies[i] = new Movie(start, end);
        }

        // 終了時刻でソート
        Arrays.sort(movies, Comparator.comparingInt(m -> m.end));

        int count = 0;
        int currentTime = 0;

        for (Movie m : movies) {
            if (m.start >= currentTime) {
                count++;
                currentTime = m.end;
            }
        }

        System.out.println(count);
    }
}
