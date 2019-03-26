module Sequel
    module Plugins
        module Geometry
            SRID = 4326
            MAX_PRECISION = 5

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
                    self.get(Sequel.function :ST_AsGeoJSON, column, MAX_PRECISION)
                end
            end

            module ClassMethods
              def valid_linestring?(linestring)
                linestring.all?{|el| el.is_a?(Array)} && linestring.length > 1
              end
            end
        end
    end
end
