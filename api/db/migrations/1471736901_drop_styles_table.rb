Sequel.migration do
    change do
        drop_table(:styles)
    end
end
