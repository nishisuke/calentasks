import { Task } from 'src/types/Task'
import { CalendarDate } from 'src/entities/CalendarDate'

type Key = string | number
export interface IKey {
  key: Key
  filterTasks: (t: Task[]) => Task[]
  ts: number | null
}

export class TaskKey implements IKey {
  i: IKey
  key: Key

  constructor(key: Key | CalendarDate) {
    if (typeof key === 'string') {
      this.i = new TaskKeyString(key)
      this.key = key
    } else if (typeof key === 'number') {
      this.i = new TaskKeyDate(key, undefined)
      this.key = key
    } else if (key instanceof CalendarDate) {
      const tmp = new TaskKeyDate(undefined, key)
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
  key: number
  y: number
  m: number
  d: number
  ts: number

  constructor(key: number | undefined, cald: CalendarDate | undefined) {
    if (key === undefined) {
      if (cald === undefined) {
        throw new Error('TODO')
      }

      this.y = cald.y
      this.m = cald.m
      this.d = cald.d
      this.ts = new Date(cald.y, cald.m - 1, cald.d).getTime()
      this.key = cald.y * 10000 + cald.m * 100 + cald.d
    } else {
      this.key = key
      const _y = Math.floor(key / 10000)
      const mod = key % 10000
      const _m = Math.floor(mod / 100)
      const _d = mod % 100
      this.y = _y
      this.m = _m
      this.d = _d
      this.ts = new Date(_y, _m - 1, _d).getTime()
    }
  }

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter((t) => t.date && t.date === this.ts)
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
