Sequel.migration do
  change do
    alter_table :lines do
      add_column :color, String
    end

    from(:cities).each do |city|
      style = city[:style]
      style["line"]["opening"].each_pair do |url_name, s|
        from(:lines).where(url_name: url_name).update(color: s["color"])
      end
    end

    drop_column :cities, :style
  end
end
