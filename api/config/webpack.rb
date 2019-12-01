require 'json'
file = File.read('public/assets/webpack.manifest.json')
WEBPACK_MANIFEST = data_hash = JSON.parse(file)

