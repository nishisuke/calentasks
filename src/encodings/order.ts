import { IKey, getKey } from 'src/entities/TaskKey'
import { CalendarDate } from 'src/entities/CalendarDate'

export const decodeOrder = (b: string | number): IKey => {
  if (typeof b === 'number') {
    const mod = b % 10000
    return getKey(
      new CalendarDate(Math.floor(b / 10000), Math.floor(mod / 100), mod % 100)
    )
  } else if (typeof b === 'string') {
    return getKey(b)
  } else {
    throw new Error('No type')
  }
}

export const encodeOrder = (i: IKey): string | number =>
  i.ts ? parseInt(i.key, 10) : i.key
