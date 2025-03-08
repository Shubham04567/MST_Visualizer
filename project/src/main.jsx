import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Graph from './assets/Components/Graph.jsx'
import Home from './assets/Components/Home.jsx'

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
        }
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)