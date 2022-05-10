import LinesMapper from '../../src/lib/lines-mapper';
import Style from '../../src/lib/style';

describe("LinesMapper", () => {
  describe("sources", () => {
    it("should return the expected sources and lines", () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });

      linesMapper.updateLayers();
      const sources = linesMapper.sources;

      expect(sources.length).toEqual(2);

      // Sections
      expect(sources[0].name).toEqual('sections_source');
      expect(sources[0].data).toEqual('/api/test-city/source/sections');
      expect(sources[0].layers.map(l => l.id)).
        toEqual(['sections_buildstart', 'sections_opening', 'sections_hover']);
      expect([...new Set(sources[0].layers.map(l => l.source))]).toEqual(['sections_source']);
      expect([...new Set(sources[0].layers.map(l => l.type))]).toEqual(['line']);
      sources[0].layers.map(layer => {
        expect(layer.paint).toBeTruthy();
        expect(layer.filter).toBeTruthy();
      });

      // Stations
      expect(sources[1].name).toEqual('stations_source');
      expect(sources[1].data).toEqual('/api/test-city/source/stations');
      expect(sources[1].layers.map(l => l.id)).
        toEqual(['stations_buildstart', 'stations_opening', 'stations_hover', 'stations_inner_layer', 'labels_opening']);
      expect([...new Set(sources[1].layers.map(l => l.source))]).toEqual(['stations_source']);
      expect([...new Set(sources[1].layers.map(l => l.type))]).toEqual(['circle', 'symbol']);
      sources[1].layers.slice(0, -1).map(layer => {
        expect(layer.paint).toBeTruthy();
        expect(layer.filter).toBeTruthy();
        expect(layer.layout).toEqual({});
      });

      // Stations' labels
      sources[1].layers.slice(-1).map(layer => {
        expect(layer.paint).toBeTruthy();
        expect(layer.filter).toBeTruthy();
        expect(layer.layout).toBeTruthy();
        expect(layer.layout).not.toEqual({});
      });
    });
  });

  describe("setHoverIds", () => {
    it("should set the right hover ids", () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });

      linesMapper.setHoverIds('sections', [34, 101]);
      expect(linesMapper.currentHoverId).toEqual({
        sections: [34, 101],
        stations: []
      });

      linesMapper.setHoverIds('stations', [987]);
      expect(linesMapper.currentHoverId).toEqual({
        sections: [34, 101],
        stations: [987]
      });

      linesMapper.setHoverIds('sections', []);
      expect(linesMapper.currentHoverId).toEqual({
        sections: [],
        stations: [987]
      });
    });
  });

  describe('getLayout', () => {
    it('should return the right layout for the labels layer', () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });

      expect(linesMapper.showStationLabels).toEqual(true);
      expect(linesMapper.getLayout('labels_opening')).toEqual({
        'text-field': ['get', 'name'],
        'text-offset': [0, 1.25],
        'text-size': 12,
        'visibility': 'visible',
      });

      linesMapper.toggleStationLabels();
      expect(linesMapper.getLayout('labels_opening')).toEqual({
        'text-field': ['get', 'name'],
        'text-offset': [0, 1.25],
        'text-size': 12,
        'visibility': 'none',
      });
    });

    it('should return the right layout for the rest of the layers', () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });
      linesMapper.updateLayers();
      linesMapper.sources.map((source) => {
        source.layers.map((layer) => {
          if (layer.id != 'labels_opening') {
            expect(linesMapper.getLayout(layer.id)).toEqual({});
          }
        });
      });
    });
  });
});
