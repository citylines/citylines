Sequel.migration do
    change do
        alter_table :cities do
            add_column :srid, String
        end
    end
end
