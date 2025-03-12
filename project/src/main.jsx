import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Graph from './assets/Components/Graph.jsx'
import Home from './assets/Components/Home.jsx'
import SampleGraphs from './assets/Components/SampleGraphs.jsx'
import Graph1 from './assets/Components/SampleGraphs/Graph1.jsx'
import Graph2 from './assets/Components/SampleGraphs/Graph2.jsx'
import Graph3 from './assets/Components/SampleGraphs/Graph3.jsx'
import Graph4 from './assets/Components/SampleGraphs/Graph4.jsx'
import Graph5 from './assets/Components/SampleGraphs/Graph5.jsx'
import Graph6 from './assets/Components/SampleGraphs/Graph6.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
          path: "/",
          element: <Home/>,
        },
        {
          path: "/custom_graph",
          element: <Graph/>
        },
        {
          path: "/sample_graph",
          element: <SampleGraphs/>
        }
    ],
  },
  {
    path: "/graph1",
    element: <Graph1/>
  },
  {
    path: "/graph2",
    element: <Graph2/>
  },
  {
    path: "/graph3",
    element: <Graph3/>
  },
  {
    path: "/graph4",
    element: <Graph4/>
  },
  {
    path: "/graph5",
    element: <Graph5/>
  },
  {
    path: "/graph6",
    element: <Graph6/>
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)