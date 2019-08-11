import { converter } from '../types/mapper';

export default (): converter<Date> => ({
  displayName: 'date',
  fromUrl: (value: string) => {
    const date = new Date(decodeURIComponent(value));
    if (isNaN(date.getTime()) === true) {
      return {
        valid: false,
      };
    }
    return {
      valid: true,
      value: date,
    };
  },
  toUrl: (value: Date) => {
    if (value instanceof Date) {
      return {
        value: encodeURIComponent(value.toISOString()),
        valid: true,
      };
    }
    return {
      valid: false,
    };
  },
});