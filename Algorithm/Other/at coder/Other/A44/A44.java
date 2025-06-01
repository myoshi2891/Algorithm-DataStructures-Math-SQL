import java.io.*;
import java.util.*;

public class A44 {
    public static void main(String[] args) throws IOException {
        // 高速入力
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        
        int N = Integer.parseInt(st.nextToken());
        int Q = Integer.parseInt(st.nextToken());
        
        Map<Integer, Integer> changes = new HashMap<>();
        boolean reversed = false;
        StringBuilder output = new StringBuilder();
        
        for (int i = 0; i < Q; i++) {
            String line = br.readLine();
            st = new StringTokenizer(line);
            int type = Integer.parseInt(st.nextToken());

            if (type == 1) {
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                int realIndex = reversed ? (N - x) : (x - 1);
                changes.put(realIndex, y);

            } else if (type == 2) {
                reversed = !reversed;

            } else if (type == 3) {
                int x = Integer.parseInt(st.nextToken());
                int realIndex = reversed ? (N - x) : (x - 1);
                int value = changes.getOrDefault(realIndex, realIndex + 1);
                output.append(value).append('\n');
            }
        }

        // 出力
        System.out.print(output);
    }
}
