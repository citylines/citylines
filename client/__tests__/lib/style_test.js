import Style from '../../src/lib/style';

describe("calculate", () => {
  describe("stations", () => {
    it("should return the hover style", () => {
      const expectedStyle = {
        'circle-color': '#000',
        'circle-opacity': 0.4,
        'circle-radius': {
          type: 'identity',
          property: 'width'
        }
      }

      const style = new Style([]);

      expect(style.calculate('stations', 'hover')).toEqual(expectedStyle);
    });

    it("should return the inner style", () => {
      const expectedStyle = {
        'circle-color': '#e6e6e6',
        'circle-radius': {
          type: 'identity',
          property: 'inner_width'
        }
      }

      const style = new Style([]);

      expect(style.calculate('stations', 'inner')).toEqual(expectedStyle);
    });

    it("should return the buildstart style", () => {
      const expectedStyle = {
        'circle-color': '#A4A4A4',
        'circle-radius': {
          type: 'identity',
          property: 'width'
        }
      }

      const style = new Style([]);

      expect(style.calculate('stations', 'buildstart')).toEqual(expectedStyle);
    });

    it("should return the opening style", () => {
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
        'circle-radius': {
          type: 'identity',
          property: 'width'
        }
      }

      const style = new Style([{url_name: 'a', color: '#zzz'}, {url_name: 'b', color: '#xxx'}]);

      expect(style.calculate('stations', 'opening')).toEqual(expectedStyle);
    });
  });
});
