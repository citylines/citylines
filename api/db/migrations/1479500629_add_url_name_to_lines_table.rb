Sequel.migration do
  change do
    alter_table :lines do
      add_column :url_name, String
    end

    from(:lines).each do |line|
      url_name = line[:name].gsub(' ','-').downcase
      from(:lines).where(id: line[:id]).update(url_name: url_name)
    end
  end
end
