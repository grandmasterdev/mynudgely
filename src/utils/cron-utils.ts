export const convertStorePropsIntervalToCron = (
  type: 'minutes' | 'hours' | 'days' | 'weeks',
  value: number,
) => {
  if (type === 'minutes' && value > 59) {
    throw new Error('Interval minute has to be lower than 60');
  }
  if (type === 'hours' && value > 23) {
    throw new Error('Interval hour has to be lower than 24');
  }
  if (type === 'days' && value > 31) {
    throw new Error('Interval day has to be lower than 31');
  }

  switch (type) {
    case 'minutes':
      return `cron(0/${value} * * * ? *)`;
    case 'hours':
      return `cron(0 0/${value} * * ? *)`;
    case 'days':
      return `cron(0 0 1/${value} * ? *)`;
    case 'weeks':
      return `cron(0 0 ? * ${value} *)`;
    default:
      throw new Error('Invalid type');
  }
};
