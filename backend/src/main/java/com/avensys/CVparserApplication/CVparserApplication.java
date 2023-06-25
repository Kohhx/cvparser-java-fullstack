package com.avensys.CVparserApplication;

import com.avensys.CVparserApplication.utility.GPTUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class CVparserApplication {

    public static void main(String[] args) {
        SpringApplication.run(CVparserApplication.class, args);
        String text = """
                Hello 	
                world
                My name is Koh He Xiang
                How are you doing man? Have you started on your project?
                Let Start!!!
                """;

        reduceToChunkOfString(text, 20);
    }

    public static void reduceToChunkOfString(String text, int maxTokenPerChunk) {
        System.out.println(text);
        String[] textSplit = text.split("\n");
        System.out.println(text);

        // Count without line spaceÏ
        System.out.println(GPTUtil.countTokens("Hello world"));


        // COunt the number of in array
        System.out.println(GPTUtil.countTokens(text));

        // COunt the number of tokens in the Array text
        String ArrString = Arrays.toString(textSplit);
        System.out.println(GPTUtil.countTokens(ArrString));

        // Get Chunk of text
        List<String> chunkTextResult = GPTUtil.splitTextToChunks(textSplit, maxTokenPerChunk);
        System.out.println(chunkTextResult.size());
        chunkTextResult.stream().forEach(textC -> {
            System.out.println(textC);
            System.out.println("================");
        });

    }

}
