class App < Sinatra::Base
  use Rack::Deflater

  enable :logging
end
