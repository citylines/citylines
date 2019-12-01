require 'json'

manifest_path = 'public/assets/webpack.manifest.json'
data_hash = if File.exist?(manifest_path)
              JSON.parse(File.read(manifest_path))
            else
              {}
            end

WEBPACK_MANIFEST = data_hash
