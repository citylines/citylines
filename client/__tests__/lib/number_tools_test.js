import Counterpart from 'counterpart';
import {formatNumber} from '../../src/lib/number-tools';

describe("number tools", () => {
  describe("formatNumber", () => {
    it("should format the number using the right locale", () => {
      // Mock of the toLocaleString method
      Number.prototype.toLocaleString = (locale, options) => {
        return {...options, locale: locale};
      };

      const number = 23111.654;

      Counterpart.withLocale('es-AR', () => {
        const res = formatNumber(number);
        expect(res).toEqual({maximumFractionDigits: 2, locale: 'es-AR'});
      });
    });
  });
});
