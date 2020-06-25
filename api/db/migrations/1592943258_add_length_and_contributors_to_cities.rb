Sequel.migration do
  up do
    alter_table :cities do
      add_column :length, :Bignum, default: 0
      add_column :contributors, Integer, default: 0
    end

    # Contributors
    # ============
    query = %{
      select city_id, count(user_id) from
        (select distinct city_id, user_id from
          (select city_id, user_id from modified_features_props union
           select city_id, user_id from created_features union
           select city_id, user_id from deleted_features union
           select city_id, user_id from modified_features_geo) as modifications
        ) as different
      group by (city_id)
    }

    data = {}
    DB.fetch(query).each do |register|
      data[register[:city_id]] = {contributors: register[:count]}
    end

    # Length
    # ======
    today = Time.now.year

    query = %{
      select sum(length), city_id from sections where
        sections.opening is not null and sections.opening <= #{today} and (sections.closure is null or sections.closure > #{today})
      group by city_id}

    DB.fetch(query).each do |register|
      data[register[:city_id]][:length] = register[:sum]
    end

    data.each_pair do |city_id, data|
      from(:cities).where(id: city_id).update(data)
    end
  end

  down do
    alter_table :cities do
      drop_column :length
      drop_column :contributors
    end
  end
end
