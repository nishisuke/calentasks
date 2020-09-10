import { Task } from 'src/types/Task'
import { CalendarDate } from 'src/entities/CalendarDate'

export interface IKey {
  key: string
  filterTasks: (t: Task[]) => Task[]
  ts: number | null
}

export const getKey = (key: string | CalendarDate): IKey =>
  key instanceof CalendarDate ? new TaskKeyDate(key) : new TaskKeyString(key)

class TaskKeyDate {
  y: number
  m: number
  d: number
  ts: number

  constructor(cald: CalendarDate) {
    this.y = cald.y
    this.m = cald.m
    this.d = cald.d
    this.ts = new Date(cald.y, cald.m - 1, cald.d).getTime()
  }

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.date && t.date === this.ts)
  }

  get key(): string {
    return `${this.y}${`0${this.m}`.slice(-2)}${`0${this.d}`.slice(-2)}`
  }
}

class TaskKeyString {
  key: string

  constructor(key: string) {
    this.key = key
  }

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.id === this.key)
  }

  get ts(): null {
    return null
  }
}
