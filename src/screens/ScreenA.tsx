import React, { FC } from 'react'

import { Calendar } from 'src/containers/Calendar'
import { TaskList } from 'src/containers/TaskList'

export const ScreenA: FC = () => {
  return (
    <>
      <Calendar />

      <div className="field has-addons">
        <div className="control">
          <input className="input" type="text" />
        </div>
        <div className="control">
          <a className="button">保存</a>
        </div>
      </div>
      <a href="#" className="button is-floating is-small is-primary">
        <i className="fas fa-plus"></i>
      </a>
      <TaskList />
    </>
  )
}
