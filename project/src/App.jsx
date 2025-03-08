import './App.css'
import Graph from './assets/Components/Graph'
import { Outlet } from 'react-router-dom'

function App() {
 
  return (
    <>
      <main>
        <Outlet/>
      </main>
    </>
  )
}

export default App
