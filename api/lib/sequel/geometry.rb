module Sequel
    module Plugins
        module Geometry
            SRID = 4326

            module InstanceMethods
                def set_geometry_from_wkt(geometry, column = :geometry)
                    self[column] = wkt(geometry)
                end

                def set_geometry_from_geojson(geometry, column = :geometry)
                    unless geometry[:crs]
                      geometry[:crs]={type:'name', properties: {name: "EPSG:#{SRID}"}}
                    end

                    self[column] = geojson(geometry.to_json)
                end

                def wkt(geometry)
                    Sequel.lit("ST_GeomFromText('#{geometry}', #{SRID})")
                end

                def geojson(geometry)
                    Sequel.lit("ST_GeomFromGeoJSON('#{geometry}')")
                end

                def geojson_geometry(column = :geometry)
                    self.class.dataset.where(id: self.id).geojson(column)
                end
            end

            module DatasetMethods
                def geojson(column)
                    self.get(Sequel.function :ST_AsGeoJSON, column)
                end

                def id_and_geojson
                  self.select(:id, Sequel.function(:ST_AsGeoJSON, :geometry))
                end
            end
        end
    end
end
