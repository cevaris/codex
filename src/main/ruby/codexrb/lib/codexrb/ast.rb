module Codexrb
  require 'ast'

  class AstProcessor < AST::Processor
    extend AST::Sexp

    attr_reader :funcs

    def initialize
      @funcs = []
      @logger = Codexrb.logger
    end

    def on_root(node)
      @logger.info("root")
      node.updated(nil, process_all(node.children))
    end

    def on_def(node)
      @logger.info("def #{node}")

      func_node = {
          :name => node.children.first,
          :location => {
              :start => node.loc.expression.line,
              :end => node.loc.expression.last_line
          }
      }
      @funcs << func_node
    end

    def on_send(node)
      @logger.info("send #{node}")

    end

    def handler_missing(node)
      begin
        node.to_ast
        node.updated(nil, process_all(node.children))
      rescue
        node
      end
    end

  end

  class Ast
    require 'parser/current'

    @logger = Codexrb.logger

    def self.parse_ruby(ruby_string)
      Parser::CurrentRuby.parse(ruby_string)
    end

    def self.extract_members(ast_value)
      @logger.info('extracting members')
      []
    end

    def self.extract_funcs(ast_value)
      @logger.info('extracting funcs')
      processor = Codexrb::AstProcessor.new
      processor.process(ast_value)

      processor.funcs
    end

    def self.read_file(path)
      @logger.info "test"

      if File.exists?(path)
        if File.file?(path)
          File.open(path, 'rb') { |file| file.read }
        else
          raise "file #{path} is not a file."
        end
      else
        raise "path #{path} does not exist."
      end
    end

  end
end