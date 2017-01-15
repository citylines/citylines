Sequel.migration do
    change do
        alter_table :cities do
            add_column :url_name, String, :null => false
        end
    end
end
