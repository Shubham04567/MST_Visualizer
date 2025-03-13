import React from 'react'
import GraphCard from './SampleGraphs/GraphCard'
import { Link } from 'react-router-dom'

function SampleGraphs() {
  return (
    <>
      <div style={{height:"100vh" , width:"100vw"}}>
        <div className='text-5xl pt-3 pb-5' style={{color:"rgb(255,255,255)"}} >Sample Graphs</div>
        <div className="flex justify-center items-center" >
          <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-16 pt-10 pb-10 ps-10 pe-10">
            <Link to={"/graph1"}> <GraphCard name={"Graph 1"} src={"./../../../../Graph1.png"} /> </Link>
            <Link to={"/graph2"}> <GraphCard name={"Graph 2"} src={"./../../../../Graph2.png"} /> </Link>
            <Link to={"/graph3"}> <GraphCard name={"Graph 3"} src={"./../../../../Graph1.png"} /> </Link>
            <Link to={"/graph4"}> <GraphCard name={"Graph 4"} src={"./../../../../Graph2.png"} /> </Link>
            <Link to={"/graph5"}> <GraphCard name={"Graph 5"} src={"./../../../../Graph1.png"} /> </Link>
            <Link to={"/graph6"}> <GraphCard name={"Graph 6"} src={"./../../../../Graph2.png"} /> </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SampleGraphs