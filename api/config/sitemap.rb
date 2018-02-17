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

SitemapGenerator::Sitemap.default_host = 'http://citylines.co'
SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new(fog_provider: 'AWS',
                                                                    aws_access_key_id: AWS_ACCESS_KEY_ID,
                                                                    aws_secret_access_key: AWS_SECRET_ACCESS_KEY,
                                                                    fog_directory: AWS_BUCKET,
                                                                    fog_region: AWS_REGION)
SitemapGenerator::Sitemap.sitemaps_host = AWS_HOST
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'

SitemapGenerator::Sitemap.create do
  add "/", alternates: alternates("/")
  add "/data", alternates: alternates("/data")
  add "/terms", alternates: alternates("/terms")

  City.all.map do |city|
    city_url = "/#{city.url_name}"
    add city_url, alternates: alternates(city_url)
  end
end
