import React, { useState, useEffect } from 'react'

export default function Index() {
  const [dimensions,setDimension] = useState({row: 2,col: 2})
  const [grid, setGrid] = useState([])

  const handleDimensionChange = (e)=>{
    const {name, value} = e.target
    setDimension(prev => ({
      ...prev,
      [name]: parseInt(value,10)
    }))
  }

  useEffect(() => {
    console.log("Updated grid:", grid);
  }, [grid]);

  const generateMaze = () => {
    console.log(dimensions.row,dimensions.col)
    let g = []
    for(let i=0; i<dimensions.row; i++){
      let single_row = []
      for(let j=0; j<dimensions.col; j++){
        single_row.push({
          r:i,
          c:j,
          wall:{top:1,bottom:1,left:1,right:1}
        })
      }
      g.push(single_row)
    }
    setGrid(g)
    // console.log(grid)
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">Maze Generator (Kruskal's Algorithm)</h1>
      
      <div className="mb-4 flex gap-4">
        <div>
          <label className="mr-2 text-black">Rows:</label>
          <input type="number" name="row" min="2" max="30"
            value={dimensions.row}
            onChange={handleDimensionChange}
            className="border p-1 w-16 border-black text-amber-950"
          />
        </div>
        <div>
          <label className="mr-2 text-black">Columns:</label>
          <input type="number" name="col" min="2" max="30"
            value={dimensions.col}
            onChange={handleDimensionChange}
            className="border p-1 w-16 border-black text-amber-950"
          />
        </div>
        <button onClick={generateMaze}   className="bg-blue-500 text-white px-4 py-1 rounded">
          Initialize Grid
        </button>
      </div>
      
      <div className="border-4 border-black p-1 bg-white">
        <div className="playground">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((element, colIndex) => (
                <div 
                  key={colIndex} 
                  className="border border-black p-2 w-16 h-16 text-center"
                >
                  {`${element.r},${element.c}`}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>



    </div>
  );
};

