module Codexrb

  class <<self
    require "logging"

    def logger
      name = 'codexrb'

      if @logger.nil?
        @logger = Logging.logger[name]
        @logger.level = :info
        @logger.add_appenders Logging.appenders.file("/git/codex/logs/#{name}.log")
      end

      @logger
    end

  end
end