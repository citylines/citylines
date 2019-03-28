module FeatureCollection
  module Base
    def self.included(klass)
      klass.extend(ClassMethods)
    end

    def feature(formatted: false)
      key = self.is_a?(Section) ? :sections__id : :stations__id

      collection = self.class.feature_collection(
        :formatted => formatted,
        key => self.id
      )

      JSON.parse(collection, symbolize_names: true)[:features]
    end

    module ClassMethods
      def feature_collection(formatted: false, **opts)
        query = if formatted
                  self::FORMATTED_FEATURE_COLLECTION
                else
                  self::RAW_FEATURE_COLLECTION
                end

        DB.fetch(query, Sequel.expr(opts)).first[:json_build_object]
      end

      def feature_collection_by_city(city_id, formatted: false)
        key = self.name == 'Section' ? :sections__city_id : :stations__city_id

        feature_collection(
          :formatted => formatted,
          key => city_id
        )
      end
    end
  end
end
