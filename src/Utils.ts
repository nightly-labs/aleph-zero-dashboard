export const round = (value: number, precision: number) =>
  Math.round(value * 10 ** precision) / 10 ** precision;
