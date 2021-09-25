cdn_domains_by_env = {
  'production' => 'cdn.citylines.co',
  'staging' => 'd1lna4hvnypvq3.cloudfront.net',
}

CDN_DOMAIN = cdn_domains_by_env[APP_ENV]
CDN_URL = CDN_DOMAIN ? "https://#{CDN_DOMAIN}" : nil
