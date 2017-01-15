Sequel.migration do
    change do
        alter_table :cities do
            add_column :style, "json"
        end
    end
end
