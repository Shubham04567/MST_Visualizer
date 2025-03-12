import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return(
    <>
    <div style={{display:"flex" , justifyContent:"center" , alignItems : "center"  , flexDirection:"column" , height:"99vh"}}>
        <div style={{ width:"99vw" , height:"20vh" , display:"flex" , alignItems:"center" , justifyContent :"center"}}>
          <h1 style={{}} className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>MST Visualizer</h1>
        </div>
        <div className='space-x-30' style={{ height : "20vh" , width : "99vw" , display : "flex" , alignItems:"center" , justifyContent : "center" , }}>
            <Link to={"/Sample_graph"}>
                <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'>Sample Graphs</button>
            </Link>
            <Link to={"/custom_graph"}>
                <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'>Custom Graphs</button>
            </Link>
        </div>
    </div>
    </>
  )
}

export default Home