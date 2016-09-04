module Codexrb
  class Ast
    require 'parser/current'

    def self.parse_ruby(ruby_string)
      Parser::CurrentRuby.parse(ruby_string)
    end

    def self.read_file(path)
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