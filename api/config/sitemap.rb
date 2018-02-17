require 'sitemap_generator'

# TODO: Add s3 stuff
SitemapGenerator::Sitemap.default_host = 'http://citylines.co'
SitemapGenerator::Sitemap.create do
  add "/"
  add "/data"
  add "/terms"

  City.all.map do |city|
    add city.url_name
  end

  # TODO Add hreflang
end
