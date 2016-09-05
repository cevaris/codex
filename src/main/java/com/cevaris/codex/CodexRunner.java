package com.cevaris.codex;

import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.NodeBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class CodexRunner {

//    public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
//
//        ProcessResult result = new ProcessExecutor()
//                .command("/git/codex/bin/codexrb", "parse", "/git/resque-example/lib/watermark.rb")
////                .command("/git/codex/bin/codexjs", "parse", "/git/redux/examples/todomvc/actions/index.js")
//                .readOutput(true)
//                .execute();
//
//        int resultCode = result.getExitValue();
//        String resultJson = result.outputUTF8();
//
//        if (resultCode == 0) {
//            ObjectMapper mapper = new ObjectMapper();
//            TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {
//            };
//            HashMap<String, Object> resultParsedJson = mapper.readValue(resultJson, typeRef);
//            System.out.println(resultParsedJson);
//        } else {
//            System.out.println(resultJson);
//        }
//
//    }

    public static void main(String[] args) {

        String filePath = "/git/resque-example/lib/watermark.rb";

        Client client = NodeBuilder.nodeBuilder()
                .settings(Settings.builder().put("path.home", "/usr/local/elasticsearch/"))
                .client(true)
                .node()
                .client();

        String INDEX = "test";
        String TYPE = "test";

        Map<String, String> doc = new HashMap<String, String>();
        doc.put("path", filePath);
        doc.put("code", readFile(filePath));

        CreateIndexRequest indexRequest = new CreateIndexRequest(INDEX);
        client
                .admin()
                .indices()
                .create(indexRequest)
                .actionGet();

        UpdateRequest updateRequest = new UpdateRequest(INDEX, TYPE, filePath)
                .doc(doc)
                .docAsUpsert(true);

        SearchResponse allHits = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchAllQuery())
                .execute()
                .actionGet();

        System.out.println(allHits);
    }

    public static String readFile(String path) {
        byte[] encoded = "".getBytes();
        try {
            encoded = Files.readAllBytes(Paths.get(path));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new String(encoded, StandardCharsets.UTF_8);
    }
}
