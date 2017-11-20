Sequel.migration do
  change do
    alter_table :section_lines do
      add_column :city_id, Integer
      add_index :city_id
    end

    from(:section_lines).each do |sl|
      section = from(:sections)[id: sl[:section_id]]
      from(:section_lines).where(section_id: section[:id]).update(city_id: section[:city_id])
    end
  end
end
