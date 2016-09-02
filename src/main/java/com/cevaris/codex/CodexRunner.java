package com.cevaris.codex;

import jdk.nashorn.internal.ir.LexicalContext;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.Parser;
import org.mozilla.javascript.ast.AstRoot;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

public class CodexRunner {
//
//    class Printer extends NodeVisitor {
//
//        public boolean visit(AstNode node) {
//            String indent = "%1$Xs".replace("X", String.valueOf(node.depth() + 1));
//            System.out.format(indent, "").println(node.getClass());
//            return true;
//        }
//    }

    public static void main(String[] args) throws IOException {

        String file = "/git/redux/examples/async/actions/index.js";
        Reader reader = new FileReader(file);
        try {
            LexicalContext lc = new LexicalContext();
            CompilerEnvirons env = new CompilerEnvirons();
            env.setRecordingLocalJsDocComments(true);
            env.setAllowSharpComments(true);
            env.setRecordingComments(true);
            AstRoot node = new Parser(env).parse(reader, file, 1);
            System.out.println(node.toSource());
        } finally {
            reader.close();
        }
    }
}
