import React from 'react'
import { render } from 'react-dom'

import { Router } from 'src/routers/Router'
import { Layout } from 'src/Layout'

import 'src/static/style.css'

const App = () => {
  const page = <Router />
  return <Layout page={page} />
}

render(<App />, document.getElementById('app'))
