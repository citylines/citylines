Sequel.migration do
  up do
    alter_table :systems do
      add_column :length, :Bignum, default: 0
    end

    today = Time.now.year

    query = %{
      select sum(sections.length), systems.id as system_id from sections
      inner join section_lines on section_lines.section_id = sections.id
      inner join lines on lines.id = section_lines.line_id
      inner join systems on systems.id = lines.system_id
      where sections.opening is not null and sections.opening <= #{today} and (sections.closure is null or sections.closure > #{today})
      group by systems.id
      order by sum desc
    }

    DB.fetch(query).each do |r|
      from(:systems).where(id: r[:system_id]).update(length: r[:sum])
    end
  end

  down do
    alter_table :systems do
      drop_column :length
    end
  end
end
