export class CalendarDate {
  y: number
  m: number
  d: number

  constructor(y: number, m: number, d: number) {
    this.y = y
    this.m = m
    this.d = d
  }

  get ts(): number {
    return this.date.getTime()
  }

  get key(): string {
    return `${this.y}${`0${this.m}`.slice(-2)}${`0${this.d}`.slice(-2)}`
  }

  get date(): Date {
    return new Date(this.y, this.m - 1, this.d)
  }
}
