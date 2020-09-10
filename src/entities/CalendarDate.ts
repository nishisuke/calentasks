export class CalendarDate {
  y: number
  m: number
  d: number

  constructor(y: number, m: number, d: number) {
    const dt = new Date(y, m - 1, d)
    this.y = dt.getFullYear()
    this.m = dt.getMonth() + 1
    this.d = dt.getDate()
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
