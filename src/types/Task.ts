export interface Task {
  userID: string
  id: string
  title: string
  done: boolean
  date?: number
  activatedAt: number
  doneAt?: number

  orderDate?: number
  orderDateIndex?: number
  createdAt: number
}
