import React, { useState, useEffect, useRef } from 'react'
import { Download, Play, Pause, RefreshCw, Video, Film, FileDown, Grid, Settings, ArrowRight } from 'lucide-react'

export default function EnhancedMazeGenerator() {
  const [dimensions, setDimension] = useState({ row: 2, col: 2 })
  const [grid, setGrid] = useState([])
  const [parent, setParent] = useState([])
  const [rank, setRank] = useState([])
  const [edges, setEdges] = useState([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [simulationSpeed, setSimulationSpeed] = useState(200)
  const [highlightedEdge, setHighlightedEdge] = useState(null)
  const [componentColors, setComponentColors] = useState({})
  const [breakingWall, setBreakingWall] = useState(null)
  const [isBreaking, setIsBreaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState('sunset')
  const [wallBreak, setwallBroke] = useState(null);
  
  const mazeRef = useRef()

  const downloadPDF = async () => {
    const canvas = await html2canvas(mazeRef.current);
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const heading = "Maze Simulation";
    pdf.setFontSize(32);
    const textWidth = pdf.getTextWidth(heading);
    const textX = (pdfWidth - textWidth) / 2;  // Center horizontally
    pdf.text(heading, textX, 20);              // (x, y) — y = 20px from top

    const imgWidth = pdfWidth * 0.9; 
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    
    pdf.save('simulation.pdf');
  };

  // Function to generate adjacency list
  const generateAdjacencyList = () => {
    const adjacencyList = {};
    
    // Initialize empty adjacency list for each cell
    for (let i = 0; i < dimensions.row; i++) {
      for (let j = 0; j < dimensions.col; j++) {
        adjacencyList[`(${i}, ${j})`] = [];
      }
    }
    
    // Build adjacency list based on walls
    for (let i = 0; i < dimensions.row; i++) {
      for (let j = 0; j < dimensions.col; j++) {
        const cell = grid[i][j];
        
        // Check each direction (top, right, bottom, left)
        if (!cell.wall.top && i > 0) {
          adjacencyList[`(${i}, ${j})`].push(`(${i-1}, ${j})`);
        }
        if (!cell.wall.right && j < dimensions.col - 1) {
          adjacencyList[`(${i}, ${j})`].push(`(${i}, ${j+1})`);
        }
        if (!cell.wall.bottom && i < dimensions.row - 1) {
          adjacencyList[`(${i}, ${j})`].push(`(${i+1}, ${j})`);
        }
        if (!cell.wall.left && j > 0) {
          adjacencyList[`(${i}, ${j})`].push(`(${i}, ${j-1})`);
        }
      }
    }
    
    // Format the adjacency list as a string
    let result = '';
    for (const [cell, neighbors] of Object.entries(adjacencyList)) {
      if (neighbors.length > 0) {
        result += `${cell}: ${neighbors.join(', ')}\n`;
      }
    }
    
    return result;
  };

  // Function to generate ASCII representation of the maze
  const generateASCIIMaze = () => {
    let result = '';
    
    // Draw the top border of the maze
    result += '+';
    for (let j = 0; j < dimensions.col; j++) {
      result += '--+';
    }
    result += '\n';
    
    // Draw each row
    for (let i = 0; i < dimensions.row; i++) {
      // First, draw the left wall and horizontal passages
      let topLine = '|';
      let bottomLine = '+';
      
      for (let j = 0; j < dimensions.col; j++) {
        const cell = grid[i][j];
        
        // Space in the cell (or wall) to the right
        topLine += cell.wall.right ? '  |' : '   ';
        
        // Bottom wall or passage
        bottomLine += cell.wall.bottom ? '--+' : '  +';
      }
      
      result += topLine + '\n' + bottomLine + '\n';
    }
    
    return result;
  };

  // Function to export maze data to a text file
  const exportMazeToFile = () => {
    const adjacencyList = generateAdjacencyList();
    const asciiMaze = generateASCIIMaze();
    
    const fileContent = adjacencyList + '\n\n' + asciiMaze;
    
    // Create a blob and download the file
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maze_data.txt';
    a.click();
    URL.revokeObjectURL(url);
  };


  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = () => {
    const mazeElement = mazeRef.current;
  
    html2canvas(mazeElement).then((screenshotCanvas) => {
      const canvas = document.createElement('canvas');
      canvas.width = screenshotCanvas.width;
      canvas.height = screenshotCanvas.height;
  
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30); // 30 FPS
  
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
  
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
  
      mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
  
      mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maze-simulation.webm';
        a.click();
        URL.revokeObjectURL(url);
      };
  
      mediaRecorder.start();
  
      const interval = setInterval(() => {
        html2canvas(mazeElement).then((newScreenshot) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(newScreenshot, 0, 0);
        });
      }, 100); // update every 100ms
  
      mediaRecorderRef.current._interval = interval;
    });
  };
  
  
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      clearInterval(mediaRecorderRef.current._interval);
      mediaRecorderRef.current.stop();
    }
  };

  // Function to get a cell's ID based on its coordinates
  const get_id = (i, j, col) => i * col + j

  // Generate a random color for components (adjusted to be visually pleasing)
  const generateThemeColor = () => {
    const themeColors = {
      'sunset': {
        hue: () => Math.floor(Math.random() * 60) + 0,  // Red to yellow
        sat: '85%',
        light: '75%'
      },
      'ocean': {
        hue: () => Math.floor(Math.random() * 60) + 180, // Cyan to Blue
        sat: '70%',
        light: '70%'
      },
      'forest': {
        hue: () => Math.floor(Math.random() * 60) + 90, // Yellow-green to green
        sat: '65%',
        light: '65%'
      },
      'neon': {
        hue: () => Math.floor(Math.random() * 360),
        sat: '100%',
        light: '70%'
      },
      'pastel': {
        hue: () => Math.floor(Math.random() * 360),
        sat: '70%',
        light: '85%'
      }
    }
    
    const currentTheme = themeColors[theme] || themeColors.sunset
    return `hsl(${currentTheme.hue()}, ${currentTheme.sat}, ${currentTheme.light})`
  }

  // Shuffle array for randomized edge processing
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const generateMaze = () => {
    setCurrentStep(0)
    setIsSimulating(false)
    setProgress(0)

    let g = []
    let pp = []
    let rr = []
    let ed = []
    let initialColors = {}
    
    for (let i = 0; i < dimensions.row; i++) {
      let single_row = []
      for (let j = 0; j < dimensions.col; j++) {
        single_row.push({
          r: i,
          c: j,
          wall: { top: 1, bottom: 1, left: 1, right: 1 }
        })
        
        let idx = get_id(i, j, dimensions.col)
        pp[idx] = idx
        rr[idx] = 0
        initialColors[idx] = generateThemeColor()

        if (j < dimensions.col - 1) {
          ed.push({
            node1: [i, j],
            node2: [i, j + 1],
            weight: Math.random(),
          })
        }
        if (i < dimensions.row - 1) {
          ed.push({
            node1: [i, j],
            node2: [i + 1, j],
            weight: Math.random(),
          })
        }
      }
      g.push(single_row)
    }
    
    shuffleArray(ed)
    setGrid(g)
    setParent(pp)
    setRank(rr)
    setEdges(ed)
    setComponentColors(initialColors)
  }

  // Find the parent of a cell (for union-find)
  const get_parent = (x) => {
    if (parent[x] === x) return x
    return parent[x] = get_parent(parent[x])
  }

  // Union by rank algorithm
  const union_by_rank = (x, y) => {
    let p_x = get_parent(x)
    let p_y = get_parent(y)
    
    if (p_x == p_y) {
      return false
    }
    
    if (rank[p_x] > rank[p_y]) {
      parent[p_y] = p_x
    } else if (rank[p_y] > rank[p_x]) {
      parent[p_x] = p_y
    } else {
      parent[p_y] = p_x
      setRank((prevRank) => {
        const newRank = [...prevRank]
        newRank[p_x] += 1
        return newRank
      })
    }
    
    setParent([...parent])
    return true
  }

  // Process the next edge in the simulation
  const next_Merge = () => {
    if (currentStep >= edges.length || !isSimulating) {
      setIsSimulating(false)
      return false
    }
    
    let n1 = edges[currentStep].node1
    let n2 = edges[currentStep].node2

    setHighlightedEdge({ node1: n1, node2: n2 })

    let p1 = get_id(n1[0], n1[1], dimensions.col)
    let p2 = get_id(n2[0], n2[1], dimensions.col)
    const newGrid = [...grid]
    let merged = union_by_rank(p1, p2)
    
    if (merged === true) {
      let wallInfo = {
        cell1: { row: n1[0], col: n1[1], side: '' },
        cell2: { row: n2[0], col: n2[1], side: '' }
      }

      if (n1[0] === n2[0]) { // Same row - horizontal neighbors
        if (n1[1] > n2[1]) { // n1 is to the right of n2
          wallInfo.cell1.side = 'left'
          wallInfo.cell2.side = 'right'
        } else {
          wallInfo.cell1.side = 'right'
          wallInfo.cell2.side = 'left'
        }
      } else { // Same column - vertical neighbors
        if (n1[0] > n2[0]) { // n1 is below n2
          wallInfo.cell1.side = 'top'
          wallInfo.cell2.side = 'bottom'
        } else {
          wallInfo.cell1.side = 'bottom'
          wallInfo.cell2.side = 'top'
        }
      }

      setBreakingWall(wallInfo)
      setIsBreaking(true)
      setwallBroke(wallInfo)
      setTimeout(() => {
        if (n1[0] == n2[0]) {
          if (n1[1] > n2[1]) {
            newGrid[n1[0]][n1[1]].wall.left = 0
            newGrid[n2[0]][n2[1]].wall.right = 0
          } else {
            newGrid[n1[0]][n1[1]].wall.right = 0
            newGrid[n2[0]][n2[1]].wall.left = 0
          }
        } else {
          if (n1[0] > n2[0]) {
            newGrid[n1[0]][n1[1]].wall.top = 0
            newGrid[n2[0]][n2[1]].wall.bottom = 0
          } else {
            newGrid[n1[0]][n1[1]].wall.bottom = 0
            newGrid[n2[0]][n2[1]].wall.top = 0
          }
        }
        
        setGrid([...newGrid])
        setCurrentStep(currentStep + 1)
        setProgress(Math.round((currentStep + 1) / edges.length * 100))
      }, simulationSpeed / 2)
      
      return merged
    } else {
      setCurrentStep(currentStep + 1)
      setProgress(Math.round((currentStep + 1) / edges.length * 100))
      return merged
    }
  }

  // Action handlers
  const startSimulation = () => {
    if (!isSimulating) {
      setIsSimulating(true)
    }
  }

  const pauseSimulation = () => {
    setIsSimulating(false)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    generateMaze()
  }

  const handleDimensionChange = (e) => {
    const { name, value } = e.target
    setDimension(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }))
  }

  
  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  // Get color for a cell based on its connected component
  const getCellColor = (row, col) => {
    const cellId = get_id(row, col, dimensions.col)
    const rootParent = get_parent(cellId)
    return componentColors[rootParent] || '#ffffff'
  }

  // Simulation effect
  useEffect(() => {
    if (isSimulating && currentStep < edges.length) {
      const timer = setTimeout(() => {
        next_Merge()
      }, simulationSpeed)
  
      return () => clearTimeout(timer)
    } else if (currentStep >= edges.length) {
      setIsSimulating(false)
    }
  }, [isSimulating, currentStep, simulationSpeed])

  // Initialize maze on first render
  useEffect(() => {
    generateMaze()
  }, [])

  // Get background style for the entire app
  const getBackgroundStyle = () => {
    const bgStyles = {
      'sunset': 'bg-gradient-to-br from-orange-100 to-rose-100',
      'ocean': 'bg-gradient-to-br from-blue-100 to-cyan-100',
      'forest': 'bg-gradient-to-br from-green-100 to-emerald-100',
      'neon': 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
      'pastel': 'bg-gradient-to-br from-yellow-100 to-pink-100'
    }
    return bgStyles[theme] || bgStyles.sunset
  }

  // Calculate grid item size based on dimensions
  const getCellSize = () => {
    // Base size, adjust down for larger mazes
    const baseSize = Math.min(16, Math.max(8, 20 - Math.max(dimensions.row, dimensions.col) / 2))
    return `w-${baseSize} h-${baseSize}`
  }

  return (
    <div className={`flex flex-col items-center p-4 min-h-screen ${getBackgroundStyle()}`}>
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 bg-white bg-opacity-50 rounded-lg p-3 inline-block">
            Interactive Maze Generator
          </h1>
          {/* <p className="text-gray-700 bg-white bg-opacity-30 rounded-lg p-2 inline-block">
            Watch Kruskal's Algorithm create perfect mazes in real-time
          </p> */}
        </div>

        {/* Controls Area */}
        <div className="bg-white rounded-lg shadow-xl p-4 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            {/* Primary Controls */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={generateMaze} 
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={isSimulating}
              >
                <Grid size={16} />
                Generate New Maze
              </button>
              
              {!isSimulating ? (
                <button 
                  onClick={startSimulation} 
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={isSimulating || edges.length === 0 || currentStep >= edges.length}
                >
                  <Play size={16} />
                  Start
                </button>
              ) : (
                <button 
                  onClick={pauseSimulation} 
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Pause size={16} />
                  Pause
                </button>
              )}
              
              <button 
                onClick={resetSimulation} 
                className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Reset
              </button>
              
              <button 
                onClick={toggleSettings} 
                className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>
            </div>

            {/* Export Controls */}
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <button 
                onClick={downloadPDF}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Download size={16} />
                PDF
              </button>
              
              <button 
                onClick={exportMazeToFile}
                className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <FileDown size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Settings Panel (shown/hidden) */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Maze Dimensions</label>
                  <div className="flex gap-2">
                    <div>
                      <label className="text-sm text-gray-600">Rows:</label>
                      <input 
                        type="number" 
                        name="row" 
                        min="2" 
                        max="30"
                        value={dimensions.row}
                        onChange={handleDimensionChange}
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Columns:</label>
                      <input 
                        type="number" 
                        name="col" 
                        min="2" 
                        max="30"
                        value={dimensions.col}
                        onChange={handleDimensionChange}
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-gray-800"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Animation Speed</label>
                  <input
                    type="range" 
                    min="1" 
                    max="10"
                    value={11 - (simulationSpeed / 100)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setSimulationSpeed((11 - value) * 100);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Slower</span>
                    <span>Speed: {11 - (simulationSpeed / 100)}x</span>
                    <span>Faster</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Color Theme</label>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full text-gray-800"
                  >
                    <option value="sunset">Sunset</option>
                    <option value="ocean">Ocean</option>
                    <option value="forest">Forest</option>
                    <option value="neon">Neon</option>
                    <option value="pastel">Pastel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress: {currentStep} / {edges.length} edges processed</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Maze Display */}
        <div ref={mazeRef} className="flex justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-2 overflow-hidden">
            <div className="playground">
              {grid.map((row, rowIndex) => {
                console.log("edcwelknw ",rowIndex, wallBreak)
                return(
                    <div key={rowIndex} className="flex">
                    { row.map((element, colIndex) => {
                        const isHighlighted = highlightedEdge &&
                        ((highlightedEdge.node1[0] === element.r && highlightedEdge.node1[1] === element.c) ||
                        (highlightedEdge.node2[0] === element.r && highlightedEdge.node2[1] === element.c));
                        
                        const cellColor = getCellColor(element.r, element.c);
                        
                        return (
                        <div 
                            key={colIndex}
                            className={`w-12 h-12 flex items-center justify-center transition-all duration-500`}
                            style={{
                            borderTop: element.wall.top ? '2px solid black' : '2px solid transparent',
                            borderBottom: element.wall.bottom ? '2px solid black' : '2px solid transparent',
                            borderLeft: element.wall.left ? '2px solid black' : '2px solid transparent',
                            borderRight: element.wall.right ? '2px solid black' : '2px solid transparent',
                            backgroundColor: cellColor,
                            boxShadow: isHighlighted ? 'inset 0 0 0 2px rgba(0,0,0,0.5)' : 'none',
                            }}
                        />
                        )
                    })}
                    </div>
                )})}
            </div>
            
            {/* Start and End markers */}
            {grid.length > 0 && (
              <>
                <div className="absolute top-2 left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                  <ArrowRight size={20} />
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                  ✓
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Instructions/Info */}
        <div className="mt-6 bg-white bg-opacity-70 rounded-lg p-4 text-gray-700">
          <h3 className="font-bold text-lg mb-2">How It Works</h3>
          <p>
            This maze generator uses Kruskal's algorithm, a minimum spanning tree algorithm, to create perfect mazes.
            Each cell starts as its own component with walls between them.
            The algorithm randomly removes walls to connect cells, ensuring there's exactly one path between any two cells.
          </p>
        </div>
      </div>
    </div>
  )
}