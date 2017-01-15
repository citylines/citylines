Sequel.migration do
  change do
    alter_table :plan_lines do
      add_column :url_name, String
      add_column :parent_url_name, String
    end

    from(:plans).each do |plan|
      from(:plan_lines).where(plan_id: plan[:id]).each do |plan_line|
        url_name = plan_line[:name].gsub(' ','-').downcase
        parent_url_name = [plan[:name].gsub(' ','-').downcase, url_name].join('-')
        from(:plan_lines).where(id: plan_line[:id]).update(url_name: url_name, parent_url_name: parent_url_name)
      end
    end
  end
end
