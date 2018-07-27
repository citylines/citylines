
LOCALES = {}

Dir['api/config/locales/*.yml'].each do |file|
  yaml = YAML::load_file(file)
  locale = file.split("/").last.split(".").first
  LOCALES[locale] = yaml
end
