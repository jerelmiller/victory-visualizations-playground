import colors from './colors';

const colorScale = [colors.teal2, colors.green4];

const baseFontFamily = '"Open Sans", "Segoe UI", "Tahoma", sans-serif';

const baseStyles = {
  fontFamily: baseFontFamily,
  fontWeight: 400,
  fontSize: 12,
};

const baseLabelStyles = {
  fontFamily: baseFontFamily,
  fontSize: 12,
  padding: 10,
  fill: colors.gray8,
  stroke: 'transparent',
};

export default {
  area: {
    colorScale,
    style: {
      data: {
        fill: colors.teal2,
      },
      labels: baseLabelStyles,
    },
    ...baseStyles,
  },
  axis: {
    style: {
      axis: {
        stroke: colors.gray5,
        strokeWidth: 1,
      },
      axisLabel: baseLabelStyles,
      grid: {
        fill: 'none',
        stroke: 'none',
        pointerEvents: 'painted',
      },
      tickLabels: baseLabelStyles,
    },
    ...baseStyles,
  },
  group: {
    colorScale,
    ...baseStyles,
  },
};
