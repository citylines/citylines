module Sequel
    module Plugins
        module Geometry
            SRID = 4326

            module InstanceMethods
                def set_geometry_from_wkt(geometry, column = :geometry)
                    self[column] = wkt(geometry)
                end

                def wkt(geometry)
                    Sequel.lit("ST_GeomFromText('#{geometry}', #{SRID})")
                end

                def geojson_geometry(column = :geometry)
                    self.class.dataset.where(id: self.id).geojson(column)
                end

                def feature(column = :geometry)
                    {type: "Feature", geometry: JSON.parse(geojson_geometry(column)), properties:{id: self.id, klass: self.class.to_s}}
                end
            end

            module DatasetMethods
                def geojson(column)
                    self.get(Sequel.function :ST_AsGeoJSON, column)
                end
            end
        end
    end
end
