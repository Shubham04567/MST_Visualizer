import React, { useState, useEffect } from 'react'

export default function Index() {
  const [dimensions,setDimension] = useState({row: 4,col: 4})
  const [grid, setGrid] = useState([])
  const [parent,setParent] = useState([])
  const [rank,setRank] = useState([])
  const [edges, setEdges] = useState([])
  const [isSimulating,setIsSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [simulationSpeed, setSimulationSpeed] = useState(200)
  
  const handleDimensionChange = (e)=>{
    const {name, value} = e.target
    setDimension(prev => ({
      ...prev,
      [name]: parseInt(value,10)
    }))
  }

  // useEffect(() => {
  //   generateMaze();
  // }, [grid]);

  const get_id = (i,j,col) =>{
    return i*col+j
  }

  // shuffling the order of edges inorder to maintain randomness
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateMaze = () => {
    // console.log(dimensions.row,dimensions.col)
    setCurrentStep(0)
    setIsSimulating(false)
    setProgress(0)

    let g = []
    let pp = []
    let rr = []
    let ed = []
    for(let i=0; i<dimensions.row; i++){
      let single_row = []
      for(let j=0; j<dimensions.col; j++){
        single_row.push({
          r:i,
          c:j,
          wall:{top:1,bottom:1,left:1,right:1}
        })
        let idx = get_id(i,j,dimensions.col)
        pp[idx]=idx
        rr[idx]=0

        if (j < dimensions.col - 1) {
          ed.push({
            node1: [i, j],
            node2: [i, j + 1],
            weight: Math.random(),
          });
        }
        if (i < dimensions.row - 1) {
          ed.push({
            node1: [i, j],
            node2: [i + 1, j],
            weight: Math.random(),
          });
        }
      }
      g.push(single_row)
    }
    shuffleArray(ed)
    setGrid(g)
    setParent(pp)
    setRank(rr)
    setEdges(ed)
    // console.log(grid)
  }

 

  const get_parent = (x)=>{
    if(parent[x]===x) return x
    return parent[x] = get_parent(parent[x])
  }

  const union_by_rank = (x,y)=>{
    let p_x = get_parent(x)
    let p_y = get_parent(y)
    if(p_x == p_y){
      // console.log("same parent")
      return false;
    }
    if(rank[p_x]>rank[p_y]){
      parent[p_y] = p_x
    }
    else if(rank[p_y]>rank[p_x]){
      parent[p_x] = p_y
    }
    else{
      parent[p_y]=p_x
      setRank((prevRank) => {
        const newRank = [...prevRank];
        newRank[p_x] += 1;
        return newRank;
      });
    }
    setParent([...parent]);
    return true;
  }


  // const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const next_Merge = ()=>{
    if (currentStep >= edges.length || !isSimulating) {
      setIsSimulating(false);
      return false;
    }
    
    let n1 = edges[currentStep].node1
    let n2 = edges[currentStep].node2
    let p1 = get_id(n1[0],n1[1],dimensions.col)
    let p2 = get_id(n2[0],n2[1],dimensions.col)
    const newGrid = [...grid]
    let merged = union_by_rank(p1,p2);
    if(merged==true){
      console.log(n1,n2)
      if(n1[0]==n2[0]){
        if(n1[1]>n2[1]){
          console.log("aaa")
          newGrid[n1[0]][n1[1]].wall.left = 0
          newGrid[n2[0]][n2[1]].wall.right = 0
        }
        else{
          console.log("bbb")
          newGrid[n1[0]][n1[1]].wall.right = 0
          newGrid[n2[0]][n2[1]].wall.left = 0
        }
      }
      else{
        if(n1[0]>n2[0]){
          console.log("cccc")
          newGrid[n1[0]][n1[1]].wall.top = 0
          newGrid[n2[0]][n2[1]].wall.bottom = 0
        }
        else{
          console.log("dddd")
          newGrid[n1[0]][n1[1]].wall.bottom = 0
          newGrid[n2[0]][n2[1]].wall.top = 0
        }
      }
      // cnt+=1
      setGrid([...newGrid]); // force re-render with new wall
    }
    setCurrentStep(currentStep + 1);
    setProgress(Math.round((currentStep + 1) / edges.length * 100));
    return merged
  };

  const startSimulation = async()=>{
    if (!isSimulating) {
      setIsSimulating(true);
    }
  }

  const pauseSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    generateMaze();
  };

  const handleSpeedChange = (e) => {
    setSimulationSpeed(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    if (isSimulating && currentStep < edges.length) {
      const timer = setTimeout(() => {
        next_Merge();
      }, simulationSpeed);
  
      return () => clearTimeout(timer);
    } else if (currentStep >= edges.length) {
      setIsSimulating(false);
    }
  }, [isSimulating, currentStep, simulationSpeed]);
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

        <div>
          <label className="mr-2 text-black">Speed (ms):</label>
          <input
            type="range" min="1" max="10"
            value={11 - (simulationSpeed / 100)}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setSimulationSpeed((11 - value) * 100); // converts back to ms
            }}
          />
          <span className="ml-1 text-black">{11 - (simulationSpeed / 100)}x</span>
        </div>
        
      </div>

      <div className="mb-4 flex gap-4">
        <button 
          onClick={generateMaze} 
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={isSimulating}
        >
          Initialize Grid
        </button>
        <button 
          onClick={startSimulation} 
          className="bg-green-500 text-white px-4 py-1 rounded"
          disabled={isSimulating || edges.length === 0 || currentStep >= edges.length}
        >
          Start Simulation
        </button>
        <button 
          onClick={pauseSimulation} 
          className="bg-yellow-500 text-white px-4 py-1 rounded"
          disabled={!isSimulating}
        >
          Pause
        </button>
        <button 
          onClick={resetSimulation} 
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Reset
        </button>
      </div>
      
      <div className="mb-2 text-black">
        Progress: {currentStep} / {edges.length} edges processed
        {/* Progress */}
      </div>
      
      
      <div className="border-4 border-black p-1 bg-white">
        <div className="playground">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((element, colIndex) => (
                <div key={colIndex}
                  className="w-16 h-16 flex items-center justify-center text-sm"
                  style={{
                    borderTop: element.wall.top ? '2px solid black' : '2px solid transparent',
                    borderBottom: element.wall.bottom ? '2px solid black' : '2px solid transparent',
                    borderLeft: element.wall.left ? '2px solid black' : '2px solid transparent',
                    borderRight: element.wall.right ? '2px solid black' : '2px solid transparent',
                  }}
                >
                  {/* {`${element.r},${element.c}`} */}
                  <p></p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



