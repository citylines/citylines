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
        toEqual(['stations_buildstart', 'stations_opening', 'stations_hover', 'stations_inner_layer']);
      expect([...new Set(sources[1].layers.map(l => l.source))]).toEqual(['stations_source']);
      expect([...new Set(sources[1].layers.map(l => l.type))]).toEqual(['circle']);
      sources[1].layers.map(layer => {
        expect(layer.paint).toBeTruthy();
        expect(layer.filter).toBeTruthy();
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
});
