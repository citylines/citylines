Sequel.migration do
  up do
    from(:lines).where(transport_mode_id: nil).update(transport_mode_id: 0)

    alter_table :lines do
      set_column_default :transport_mode_id, 0
      set_column_not_null :transport_mode_id
    end
  end

  down do
    alter_table :lines do
      set_column_default :transport_mode_id, nil
      set_column_allow_null :transport_mode_id
    end
  end
end
