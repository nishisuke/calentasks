export interface Task {
  userID: string
  id: string
  title: string
  done: boolean
  date?: number
  orderDate?: number
  orderDateIndex?: number
  createdAt: number
  activatedAt: number
  doneAt?: number
}
