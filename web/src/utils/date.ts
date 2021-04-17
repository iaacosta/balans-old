import dayjs from 'dayjs';
import { ArgumentOf } from '../@types/helpers';

export const longDateFormat = 'HH:mm DD/MM/YYYY';

export const longDateFormatter = (date: ArgumentOf<typeof dayjs>[0]): string =>
  dayjs(date).format(longDateFormat);
