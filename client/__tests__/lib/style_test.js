import Style from '../../src/lib/style';

describe("zoomInterpolation", () => {
  it("should return an array for the passed property", () => {
      const style = new Style([]);

      const expectedZoomInterpolation = [
         'interpolate', ['linear'], ['zoom'],
          7, ['/', ['number', ['get', 'pepe'], 0], 3],
          10, ['/', ['number', ['get', 'pepe'], 0], 1.5],
          12, ['number', ['get', 'pepe'], 0],
        ]

      expect(style.zoomInterpolation('pepe')).toEqual(expectedZoomInterpolation);
  });

  it("should return an array for the inner_width property", () => {
      const style = new Style([]);

      const expectedZoomInterpolation = [
         'interpolate', ['linear'], ['zoom'],
          7, ['/', ['number', ['get', 'inner_width'], 0], 4],
          10, ['/', ['number', ['get', 'inner_width'], 0], 1.5],
          12, ['number', ['get', 'inner_width'], 0],
        ]

      expect(style.zoomInterpolation('inner_width')).toEqual(expectedZoomInterpolation);
  });
});

describe("calculate", () => {
  describe("stations", () => {
    it("should return the hover style", () => {
      const style = new Style([]);

      const expectedStyle = {
        'circle-color': '#000',
        'circle-opacity': 0.4,
        'circle-radius': style.zoomInterpolation('width')
      }

      expect(style.calculate('stations', 'hover')).toEqual(expectedStyle);
    });

    it("should return the inner style", () => {
      const style = new Style([]);

      const expectedStyle = {
        'circle-color': '#e6e6e6',
        'circle-radius': style.zoomInterpolation('inner_width')
      }

      expect(style.calculate('stations', 'inner')).toEqual(expectedStyle);
    });

    it("should return the buildstart style", () => {
      const style = new Style([]);

      const expectedStyle = {
        'circle-color': '#A4A4A4',
        'circle-radius': style.zoomInterpolation('width')
      }

      expect(style.calculate('stations', 'buildstart')).toEqual(expectedStyle);
    });

    it("should return the opening style", () => {
      const style = new Style([{url_name: 'a', color: '#zzz'}, {url_name: 'b', color: '#xxx'}]);

      const expectedStyle = {
        'circle-color': {
          type: 'categorical',
          property: 'line_url_name',
          stops: [
            ['shared-station', '#000000'],
            ['a', '#zzz'],
            ['b', '#xxx']
          ]
        },

        'circle-radius': style.zoomInterpolation('width')
      }

      expect(style.calculate('stations', 'opening')).toEqual(expectedStyle);
    });
  });

  describe("sections", () => {
    it("should return the hover style", () => {
      const style = new Style([]);

      const expectedStyle = {
        'line-color': '#000',
        'line-opacity': 0.4,
        'line-offset': {
          type: 'identity',
          property: 'offset'
        },
        'line-width': style.zoomInterpolation('width')
      }

      expect(style.calculate('sections', 'hover')).toEqual(expectedStyle);
    });

    it("should return the buildstart style", () => {
      const style = new Style([]);

      const expectedStyle = {
        'line-color': '#A4A4A4',
        'line-offset': {
          type: 'identity',
          property: 'offset'
        },
        'line-width': style.zoomInterpolation('width')
      }

      expect(style.calculate('sections', 'buildstart')).toEqual(expectedStyle);
    });

    it("should return the opening style", () => {
      const style = new Style([{url_name: 'a', color: '#zzz'}, {url_name: 'b', color: '#xxx'}]);

      const expectedStyle = {
        'line-color': {
          type: 'categorical',
          property: 'line_url_name',
          stops: [
            ['shared-station', '#000000'],
            ['a', '#zzz'],
            ['b', '#xxx']
          ]
        },
        'line-offset': style.zoomInterpolation('offset'),
        'line-width': style.zoomInterpolation('width')
      }

      expect(style.calculate('sections', 'opening')).toEqual(expectedStyle);
    });
  });
});
