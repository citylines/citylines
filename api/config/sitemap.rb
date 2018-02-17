require 'addressable/uri'
require 'sitemap_generator'

def alternates(url)
  href = Addressable::URI.parse(url)

  %w(es en).map do |lang|
    href.query_values = href.query_values.merge(locale: lang)
    {
      href: href.to_s,
      lang: lang
    }
  end
end

# TODO: Add s3 stuff
SitemapGenerator::Sitemap.default_host = 'http://citylines.co'
SitemapGenerator::Sitemap.create do
  add "/", alternates: alternates("/")
  add "/data", alternates: alternates("/data")
  add "/terms", alternates: alternates("/terms")

  City.all.map do |city|
    city_url = "/#{city.url_name}"
    add city_url, alternates: alternates(city_url)
  end
end
