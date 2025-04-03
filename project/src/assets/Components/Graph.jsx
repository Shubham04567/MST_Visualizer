import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import gsap from "gsap";
import "./graph.css";

function Graph() {

  const svgRef = useRef(null);
  const edge_svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [isdoneclicked,setdone] = useState(false);
  const [edges, setEdges] = useState([]);
  const [tobeAdded, setTobeAdded] = useState(0);
  const rank = useRef([]);
  const [position, setPosition] = useState(0);
  const [kval, setKval] = useState(0);
  // const [numNodes, setNumNodes] = useState(0);

  //for info for edge_show
 
  const [latestEdge, setLatestEdge] = useState(null);
  const [curr_status,setcurr_status] = useState(-1);

  const handleKClusterChange = (event) => {
    setKval(parseInt(event.target.value, 10));
  };

  const handleResetClick = () => {
      setdone(false); // Reset state
      resetGraph();
  };

  const handleclick_done = ()=>{
      if (!kval || kval <= 0) {
        alert("Please enter a valid value for K.");
        return; 
      }
      setdone(true);
      postDrawing();
      d3.select(svgRef.current).on("click", null);
    }
  
  const indexRef = useRef(0);
  // Function to add nodes with animation
  const drawNode = () => {
    const svg = d3.select(svgRef.current);
    svg.on("click", function (event) {
      const [x, y] = d3.pointer(event, this);

      let newNode = svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0) // Start with 0 radius
        .attr("fill", "blue");

      gsap.to(newNode.node(), { r: 13, duration: 0.5, ease: "elastic.out(1, 0.5)" });

      // Use index from the ref
      let currentIndex = indexRef.current;
      svg.append("text")
        .attr("x", x-5 )
        .attr("y", y+5 )
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text(currentIndex);
      
      console.log("clicked ", currentIndex);
      setNodes((prevNodes) => [...prevNodes, { x, y, index: currentIndex }]);
      indexRef.current += 1;
    });
  };

  const postDrawing = () => {
    console.log("this node given in graph: \n" , nodes);
    let newEdges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dist = Math.sqrt(
          Math.pow(nodes[j].x - nodes[i].x, 2) + Math.pow(nodes[j].y - nodes[i].y, 2)
        );
        newEdges.push({ dist, point1: nodes[i], point2: nodes[j], idx1: nodes[i].index, idx2: nodes[j].index });
      }
    }
    newEdges.sort((a, b) => a.dist - b.dist);

    parent.current = nodes.map((_, i) => i);
    rank.current = new Array(nodes.length).fill(0);

    setEdges(newEdges);
    setTobeAdded(nodes.length - kval);
  };

  const findByRank = (idx) => {
    if (parent.current[idx] === idx) return idx;
    return (parent.current[idx] = findByRank(parent.current[idx]));
  };

  const unionByRank = (idx1, idx2) => {
    let parent1 = findByRank(idx1);
    let parent2 = findByRank(idx2);
    if (parent1 !== parent2) {
      if (rank.current[parent1] > rank.current[parent2]) {
        parent.current[parent2] = parent1;
      } else if (rank.current[parent1] < rank.current[parent2]) {
        parent.current[parent1] = parent2;
      } else {
        rank.current[parent1] += 1;
        parent.current[parent2] = parent1;
      }
    }
  };

  const line_remove = (svgElement, lineSelection, pt1, pt2) => {
    const x1 = pt1.x, y1 = pt1.y, x2 = pt2.x, y2 = pt2.y;
    const numSegments = 8; // Number of breaking segments
    const segmentLengthX = (x2 - x1) / numSegments;
    const segmentLengthY = (y2 - y1) / numSegments;

    // Hide the original line
    lineSelection.remove();

    // Create broken line segments
    const segments = [];
    for (let i = 0; i < numSegments; i++) {
        segments.push({
            x1: x1 + i * segmentLengthX,
            y1: y1 + i * segmentLengthY,
            x2: x1 + (i + 1) * segmentLengthX,
            y2: y1 + (i + 1) * segmentLengthY
        });
    }

    const brokenLines = svgElement.selectAll(".broken-line")
        .data(segments)
        .enter().append("line")
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("class", "broken-line");

    // Animate the breaking effect with GSAP
    brokenLines.each(function (d, i) {
        gsap.to(this, {
            duration: 0.5, 
            delay: i * 0.1, // Stagger effect
            x: (Math.random() - 0.5) * 50, 
            y: (Math.random() - 0.5) * 50,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => d3.select(this).remove()
        });
    });
};

  const display_cmp = () => {
    assign_color();
    assignComponentBackgrounds();
  }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const [speed, setSpeed] = useState(1000);
const speedRef = useRef(speed);

const handleSpeedChange = (e) => {
  const newSpeed = Number(e.target.value);
  setSpeed(newSpeed);
  speedRef.current = newSpeed;
};

const simulateAlgo = async (type, speed) => {
    console.log("this will be implemented later");
    if (tobeAdded <= 0) {
        alert("Graph is completed");
        display_cmp();
        return;
    }
    const svgElement = d3.select(svgRef.current);
    if (!svgElement.node()) return;

    let localPosition = position;
    let localTobeAdded = tobeAdded;

    for (let i = position; i < edges.length; i++) {
        if (localTobeAdded <= 0) {
            alert("Graph is completed");
            display_cmp();
            return;
        }
        let parent1 = findByRank(edges[i].idx1);
        let parent2 = findByRank(edges[i].idx2);

        if (parent1 !== parent2) {
            unionByRank(edges[i].idx1, edges[i].idx2);
            localTobeAdded--;

            let newLine = svgElement
                .insert("line", "circle")
                .attr("data-idx1", edges[i].idx1)
                .attr("data-idx2", edges[i].idx2)
                .attr("x1", edges[i].point1.x)
                .attr("y1", edges[i].point1.y)
                .attr("x2", edges[i].point1.x)
                .attr("y2", edges[i].point1.y)
                .attr("stroke", "red")
                .attr("stroke-width", 2);

            gsap.to(newLine.node(), {
                attr: { x2: edges[i].point2.x, y2: edges[i].point2.y },
                duration: 0.8,
                ease: "power2.out"
            });
            setLatestEdge(edges[i]);
            setcurr_status("EDGE ADDED");
        } else {
            const existingLine = svgElement.selectAll("line")
                .filter(function () {
                    return (
                        +this.getAttribute("x1") === edges[i].point1.x &&
                        +this.getAttribute("y1") === edges[i].point1.y &&
                        +this.getAttribute("x2") === edges[i].point2.x &&
                        +this.getAttribute("y2") === edges[i].point2.y
                    );
                });
            line_remove(svgElement, existingLine, edges[i].point1, edges[i].point2);
            setLatestEdge(edges[i]);
            setcurr_status("CYCLE DETECTED");
        }
        localPosition = i + 1;
        if (type === true) break; 

        await sleep(speedRef.current);
    }

    setTobeAdded(localTobeAdded);
    setPosition(localPosition);
};


  // Generate a random HSL color with fixed saturation and lightness.
  const getRandomHSLColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 50%)`;
  };


  const assign_color = () => {
    const compColors = {};
  
    nodes.forEach((node) => {
      const compId = findByRank(node.index);
      if (!compColors.hasOwnProperty(compId)) {
        // Generate distinct random colors for nodes and edges
        const nodeColor = getRandomHSLColor();
        const edgeColor = getRandomHSLColor();
        compColors[compId] = { node: nodeColor, edge: edgeColor };
      }
      d3.select(svgRef.current)
        .selectAll("circle")
        .filter((d, i) => i === node.index)
        .attr("fill", compColors[compId].node);
    });
  
    d3.select(svgRef.current)
      .selectAll("line")
      .filter(function () {
        return d3.select(this).attr("data-idx1") !== null;
      })
      .each(function () {
        const idx1 = +this.getAttribute("data-idx1");
        const compId = findByRank(idx1);
        d3.select(this).attr("stroke", compColors[compId].edge);
      });
  };
  
  
  const assignComponentBackgrounds = () => {
    // Group nodes by component representative.
    const componentNodes = {};
    nodes.forEach((node) => {
      const compId = findByRank(node.index);
      if (!componentNodes[compId]) {
        componentNodes[compId] = [];
      }
      componentNodes[compId].push(node);
    });
  
    d3.select(svgRef.current)
      .selectAll(".component-bg")
      .remove();
  
    // Helper: generate a random HSL color for backgrounds.
    const getRandomHSLColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 60%, 80%)`; // lighter for background
    };
  
    Object.keys(componentNodes).forEach((compId, index) => {
      const compNodes = componentNodes[compId];
      const padding = 20; // Padding around the nodes.
      
      const minX = d3.min(compNodes, d => d.x) - padding;
      const maxX = d3.max(compNodes, d => d.x) + padding;
      const minY = d3.min(compNodes, d => d.y) - padding;
      const maxY = d3.max(compNodes, d => d.y) + padding;
      
      const bgColor = getRandomHSLColor();
      
      // rectangle with an initial fill opacity of 0.
      const rect = d3.select(svgRef.current)
        .insert("rect", ":first-child")
        .attr("class", "component-bg")
        .attr("x", minX)
        .attr("y", minY)
        .attr("width", maxX - minX)
        .attr("height", maxY - minY)
        .attr("fill", bgColor)
        .attr("fill-opacity", 0);
      
      // Animate the rectangle to the target opacity (e.g., 0.2) with a delay.
      gsap.to(rect.node(), {
        fillOpacity: 0.2,
        duration: 0.5,
        delay: index * 0.5 // each rectangle appears one by one.
      });
    });
  };
  

  // Call simulateAlgo function with the current speed.
  const handleStartSimulation = () => {
    simulateAlgo(false, speed);
  };
  
  
  

  useEffect(() => {
      if (!latestEdge) return;
  
      const mainSvg = svgRef.current.getBoundingClientRect();  
      
      const edgeSvg = edge_svgRef.current.getBoundingClientRect(); 
  
      //scale factors
      const scaleX = edgeSvg.width / mainSvg.width;
      const scaleY = edgeSvg.height / mainSvg.height;
  
      const transformCoords = (point) => ({
          x: (point.x - mainSvg.left) * scaleX,
          y: (point.y - mainSvg.top) * scaleY
      });
  
      const point1 = transformCoords(latestEdge.point1);
      const point2 = transformCoords(latestEdge.point2);
  
      const edgeSvgD3 = d3.select(edge_svgRef.current);
      edgeSvgD3.selectAll("*").remove(); // Clear previous edges

      edgeSvgD3.append("line")
          .attr("x1", point1.x)
          .attr("y1", point1.y)
          .attr("x2", point2.x)
          .attr("y2", point2.y)
          .attr("stroke", "red")
          .attr("stroke-width", 2);
  
  
      // Draw first node
      edgeSvgD3.append("circle")
          .attr("cx", point1.x)
          .attr("cy", point1.y)
          .attr("r", 8) 
          .attr("fill", "blue");
  
      // Draw first node index
      edgeSvgD3.append("text")
          .attr("x", point1.x + 10)
          .attr("y", point1.y + 4)
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(latestEdge.idx1);
  
      // Draw second node
      edgeSvgD3.append("circle")
          .attr("cx", point2.x)
          .attr("cy", point2.y)
          .attr("r", 8)
          .attr("fill", "blue");
  
      // Draw second node index
      edgeSvgD3.append("text")
          .attr("x", point2.x + 10)
          .attr("y", point2.y + 4)
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(latestEdge.idx2);
  
      
  }, [latestEdge]);

  const resetGraph = () => {
    // some animation to removal of all component drawn prev
    gsap.to("circle, line, text", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // Removing all element from svg
        d3.select(svgRef.current).selectAll("*").remove();
        d3.select(edge_svgRef.current).selectAll("*").remove();
  
        // Reset state variables
        setNodes([]);
        setEdges([]);
        setTobeAdded(0);
        setPosition(0);
        setLatestEdge(null);
        setcurr_status(-1);
        setdone(false);
        setKval(0);
  
        // all ref
        indexRef.current = 0;
        parent.current = [];
        rank.current = [];
      }
    });
  };
  
  
  
  return (
    <div className="custom_container">
      <div className="graph-container">
        <svg ref={svgRef} width="100%" height="100%" ></svg>
      </div>

      <div className="info-container">
        <div className="simulate" style={{height: "100%"}}>
            <div className="edges_show">
              <svg ref={edge_svgRef} width="100%" height="100%"></svg>
            </div>
            <div className="status">
              <p>Node1: <b>{!latestEdge ? "N/A" : latestEdge.idx1}</b></p>
              <p>Node2: <b>{!latestEdge ? "N/A" : latestEdge.idx2}</b></p>
              <p>EdgesLength: <b>{!latestEdge ? "N/A" : latestEdge.dist.toFixed(2)}</b></p>
              <p>Status : <b>{curr_status==-1 ? "N/A" : curr_status}</b></p>
            </div>
        </div>
          <div className="control">
            <label for="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter K for K-Clustering:</label>
            <div className="input flex m-1.5">
              <input type="number" id="small-input" value={kval} onChange={handleKClusterChange} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 h-7 p-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 text-xs focus:ring-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="btn">
              <button type="button"  onClick={isdoneclicked ? ()=>simulateAlgo(true) : drawNode} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{isdoneclicked ? "Start" : "Add Node"}</button>            
              <button type="button"  onClick={handleclick_done} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" style={isdoneclicked ? {display: "none"} :{} }>Done</button>  
              <button type="button"  onClick={handleResetClick } className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>  
              <button type="button"  onClick={handleStartSimulation } className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Simulate</button>  

               <label>
                Speed: {speed} ms
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={speed}
                  onChange={handleSpeedChange}
                />
              </label>

            </div>          
          </div>
      </div>
    </div>
  );
}

export default Graph;
