import './App.css'
import Graph from './assets/Components/Graph'
import { Outlet } from 'react-router-dom'

function App() {
 
  return (
    <>
      <div className='' style={{height:"100vh" , width : "100vw"}}>
        <main>
          <Outlet/>
        </main>
      </div>
    </>
  )
}

export default App
