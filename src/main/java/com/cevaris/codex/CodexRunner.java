package com.cevaris.codex;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.zeroturnaround.exec.ProcessExecutor;
import org.zeroturnaround.exec.ProcessResult;

import java.io.IOException;
import java.util.HashMap;
import java.util.concurrent.TimeoutException;

public class CodexRunner {

    public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {

        ProcessResult result = new ProcessExecutor()
                .command("/git/codex/bin/codexrb", "parse", "/git/resque-example/lib/watermark.rb")
//                .command("/git/codex/bin/codexjs", "parse", "/git/redux/examples/todomvc/actions/index.js")
                .readOutput(true)
                .execute();

        int resultCode = result.getExitValue();
        String resultJson = result.outputUTF8();

        if (resultCode == 0) {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {
            };
            HashMap<String, Object> resultParsedJson = mapper.readValue(resultJson, typeRef);
            System.out.println(resultParsedJson);
        } else {
            System.out.println(resultJson);
        }

    }
}
