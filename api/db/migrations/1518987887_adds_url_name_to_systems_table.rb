require "accentless"

using Accentless

Sequel.migration do
  up do
    alter_table :systems do
      add_column :url_name, String
    end

    from(:systems).each do |system|
      system_name = system[:name] || 'unnamed'
      url_name = "#{system[:id]}-#{system_name.strip.accentless.gsub(/\s|\//,'-').downcase}"
      from(:systems).where(id: system[:id]).update(url_name: url_name)
    end
  end

  down do
    alter_table :systems do
      drop_column :url_name
    end
  end
end
