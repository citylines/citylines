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
});
