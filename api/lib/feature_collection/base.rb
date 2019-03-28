module FeatureCollection
  class Base
    def self.key_prefix
      raise NotImplementedError
    end

    def self.by_feature(feature_id, formatted: false)
      key = [key_prefix,'id'].join('__').to_sym

      collection = by_expr(
        :formatted => formatted,
        key => feature_id
      )

      JSON.parse(collection, symbolize_names: true)[:features]
    end

    def self.by_city(city_id, formatted: false)
      key = [key_prefix,'city_id'].join('__').to_sym

      by_expr(
        :formatted => formatted,
        key => city_id
      )
    end

    def self.by_expr(formatted: false, **opts)
      query = if formatted
                self::FORMATTED_FEATURE_COLLECTION
              else
                self::RAW_FEATURE_COLLECTION
              end

      DB.fetch(query, Sequel.expr(opts)).first[:json_build_object]
    end
  end
end
