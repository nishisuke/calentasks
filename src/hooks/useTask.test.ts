import { bbb } from './useTask'
import { CalendarDate } from 'src/entities/CalendarDate'

const wrap = (order: string[], date: string): string[] => {
  const a = new CalendarDate(
    parseInt(date.slice(0, 4), 10),
    parseInt(date.slice(4, 6), 10),
    parseInt(date.slice(6, 8), 10)
  )
  return bbb(order, date, a)
}

const key = 'k'
describe('No date', () => {
  test('No today task', () => {
    const date = '20500101'
    expect(bbb([date], key, undefined)).toEqual([key, date])
  })
  test('Has today task', () => {
    const date = '20200909'
    expect(bbb([date], key, undefined)).toEqual([date, key])
  })
})

test('Date exists', () => {
  const date = '20500101'
  expect(wrap([date], date)).toEqual([date])
})

describe('New future date', () => {
  test('Has more future date', () => {
    const date = '20500101'
    const more = '20500401'
    const be = '20400401'
    expect(wrap([be, more], date)).toEqual([be, date, more])
  })

  test('No more future date', () => {
    const date = '20500101'
    const less = '20400401'
    expect(wrap([less], date)).toEqual([less, date])
  })
})

describe('New old date', () => {
  test('No old date', () => {
    const date = '20200301'
    expect(wrap(['20400301'], date)).toEqual([date, '20400301'])
  })

  test('Has old date', () => {
    const date = '20200101'
    const less = '20100401'
    const some = '20400501'
    expect(wrap([less, some], date)).toEqual([less, date, some])
  })
  test('Has latest date', () => {
    const some = '20200501'
    const date = '20200401'
    const less = '20200402'
    expect(wrap([less, some], date)).toEqual([date, less, some])
  })
})
