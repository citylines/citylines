import LinesMapper from '../../src/lib/lines-mapper';
import MouseEvents from '../../src/lib/mouse-events';
import Style from '../../src/lib/style';

describe('MouseEvents', () => {
  describe('calculateLayerNames', () => {
    it('should set the right layer names', () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });

      const mouseEvents = new MouseEvents(linesMapper);

      expect(mouseEvents.layerNames).toEqual([
        'sections_buildstart',
        'sections_opening',
        'stations_buildstart',
        'stations_opening'
      ]);
    });
  });

  describe('hover', () => {
    it('should set the right hover feature ids',  () => {
      const linesMapper = new LinesMapper({
        urlName:'test-city',
        style: new Style([])
      });

      const mouseEvents = new MouseEvents(linesMapper);
      let features;

      features = [
        {layer: {type: 'circle'}, properties: {id: 223}},
        {layer: {type: 'circle'}, properties: {id: 88}},
        {layer: {type: 'line'}, properties: {id: 12}}
      ];
      mouseEvents.hover(features)
      expect(linesMapper.currentHoverId).toEqual({
        sections: [12],
        stations: [223, 88]
      });

      features = [];
      mouseEvents.hover(features)
      expect(linesMapper.currentHoverId).toEqual({
        sections: [],
        stations: []
      });
    });
  });
});
