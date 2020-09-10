import { Task } from 'src/types/Task'
import { CalendarDate } from 'src/entities/CalendarDate'

export interface IKey {
  key: string
  filterTasks: (t: Task[]) => Task[]
  ts: number | null
}

export class TaskKey implements IKey {
  i: IKey
  key: string

  constructor(key: string | CalendarDate) {
    if (typeof key === 'string') {
      this.i = new TaskKeyString(key)
      this.key = key
    } else if (key instanceof CalendarDate) {
      const tmp = new TaskKeyDate(key)
      this.i = tmp
      this.key = tmp.key
    } else {
      throw new Error('TODO')
    }
  }

  filterTasks(tasks: Task[]): Task[] {
    return this.i.filterTasks(tasks)
  }

  get ts(): number | null {
    return this.i.ts
  }
}

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
    return `${this.y}${this.m}${this.d}`
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
