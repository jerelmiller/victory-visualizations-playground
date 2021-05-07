import colors from './colors';

const colorScale = [colors.teal1, colors.blue1];

const base = {
  colorScale,
};

export default {
  area: {
    style: {
      data: {
        fill: colors.teal2,
      },
    },
    ...base,
  },
};
