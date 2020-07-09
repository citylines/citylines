Sequel.migration do
  up do
    DB.fetch("create extension pg_trgm").all
  end

  down do
    DB.fetch("drop extension pg_trgm").all
  end
end
