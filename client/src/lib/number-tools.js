import Counterpart from 'counterpart';

const formatNumber = (number) => {
  return number.toLocaleString(Counterpart.getLocale(), {maximumFractionDigits: 2});
};

export {formatNumber};
