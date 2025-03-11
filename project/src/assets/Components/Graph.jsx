import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import gsap from "gsap";
import "./graph.css";

function Graph() {

  //control for btn
  const [isdoneclicked,setdone] = useState(false);

  const [latestEdge, setLatestEdge] = useState(null);

  const handleclick_done = ()=>{
    setdone(true);
    postDrawing();
  }

  const handleResetClick = () => {
    setdone(false); // Reset state
    resetGraph(); // Call the function
  };


  const svgRef = useRef(null);
  const edge_svgRef = useRef(null);
  const [kval, setKval] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tobeAdded, setTobeAdded] = useState(0);
  const [position, setPosition] = useState(0);
  const parent = useRef([]);
  const rank = useRef([]);
  let index = 0;

  //for info for edge_show

  const [Node_a,setnode_a] = useState(-1);
  const [Node_b,setnode_b] = useState(-1);
  const [edge_lenght,setnode_lenght] = useState(-1);
  const [curr_status,setcurr_status] = useState(-1);

  

  const handleKClusterChange = (event) => {
    setKval(parseInt(event.target.value, 10));
  };

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

      gsap.to(newNode.node(), { r: 10, duration: 0.5, ease: "elastic.out(1, 0.5)" });

      svg.append("text")
        .attr("x", x + 11)
        .attr("y", y + 5)
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text(index);

      setNodes((prevNodes) => [...prevNodes, { x, y, index }]);
      index++;
    });
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

  const postDrawing = () => {
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
            duration: 0.5, // Fast breaking effect
            delay: i * 0.1, // Stagger effect
            x: (Math.random() - 0.5) * 50, // Move randomly outward
            y: (Math.random() - 0.5) * 50,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => d3.select(this).remove()
        });
    });
};

const simulateAlgo = () => {
    if (tobeAdded <= 0) return;
    const svgElement = d3.select(svgRef.current);
    if (!svgElement.node()) return;

    let localPosition = position;
    let localTobeAdded = tobeAdded;

    for (let i = position; i < edges.length; i++) {
        let parent1 = findByRank(edges[i].idx1);
        let parent2 = findByRank(edges[i].idx2);

        if (parent1 !== parent2) {
            console.log("pos: ",position)
            unionByRank(edges[i].idx1, edges[i].idx2);
            localTobeAdded--;

            let newLine = svgElement
                .insert("line", "circle")
                .attr("x1", edges[i].point1.x)
                .attr("y1", edges[i].point1.y)
                .attr("x2", edges[i].point1.x) // Start from the same point
                .attr("y2", edges[i].point1.y)
                .attr("stroke", "red")
                .attr("stroke-width", 2);

            gsap.to(newLine.node(), {
                attr: { x2: edges[i].point2.x, y2: edges[i].point2.y },
                duration: 0.8,
                ease: "power2.out"
            });

            setLatestEdge(edges[i]);
            setnode_a(edges[i].idx1-1);
            setnode_b(edges[i].idx2-1);
            setnode_lenght(edges[i].dist.toFixed(2));
            setcurr_status("ADDED");
        } 
        else {
            // console.log("ppppppppppppppp")
            // Select the line that needs to be removed
            const existingLine = svgElement.selectAll("line")
                .filter(function () {
                    return (
                        +this.getAttribute("x1") === edges[i].point1.x &&
                        +this.getAttribute("y1") === edges[i].point1.y &&
                        +this.getAttribute("x2") === edges[i].point2.x &&
                        +this.getAttribute("y2") === edges[i].point2.y
                    );
                });

            // Apply the breaking animation to the existing line
            line_remove(svgElement, existingLine, edges[i].point1, edges[i].point2);
        }
        localPosition = i + 1;
        break;
    }

    setTobeAdded(localTobeAdded);
    setPosition(localPosition);
};


  // Reset function
  const resetGraph = () => {
    gsap.to("circle, line, text", { opacity: 0, duration: 0.5, onComplete: () => {
      setNodes([]);
      setEdges([]);
      setTobeAdded(0);
      setPosition(0);
      parent.current = [];
      rank.current = [];
      d3.select(svgRef.current).selectAll("*").remove();
    }});
  };

  useEffect(() => {
    if (!latestEdge) return;

    const mainSvg = svgRef.current.getBoundingClientRect();  
    
    const edgeSvg = edge_svgRef.current.getBoundingClientRect(); 

    // Compute scale factors
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

    // Draw first node
    edgeSvgD3.append("circle")
        .attr("cx", point1.x)
        .attr("cy", point1.y)
        .attr("r", 8) // Adjust size for smaller space
        .attr("fill", "blue");

    // Draw first node index
    edgeSvgD3.append("text")
        .attr("x", point1.x + 10)
        .attr("y", point1.y + 4)
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text(latestEdge.idx1-1);

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
        .text(latestEdge.idx2-1);

    // Draw the edge with correct inclination
    edgeSvgD3.append("line")
        .attr("x1", point1.x)
        .attr("y1", point1.y)
        .attr("x2", point2.x)
        .attr("y2", point2.y)
        .attr("stroke", "red")
        .attr("stroke-width", 2);

}, [latestEdge]);


  return (
    <div className="container">
      <div className="graph-container">
        <svg ref={svgRef} width="100%" height="100%" ></svg>
      </div>

      <div className="info-container">
        <div className="simulate" style={{height: "100%"}}>
            <div className="edges_show">
              <svg ref={edge_svgRef} width="100%" height="100%"></svg>
            </div>
            <div className="status">
              <p>Node1: <b>{Node_a==-1 ? "N/A" : Node_a}</b></p>
              <p>Node2: <b>{Node_b==-1 ? "N/A" : Node_b}</b></p>
              <p>EdgesLength: <b>{edge_lenght==-1 ? "N/A" : edge_lenght}</b></p>
              <p>Status : <b>{curr_status==-1 ? "N/A" : curr_status}</b></p>
            </div>
        </div>
          <div className="control">
            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter K for K-Clustering:</label>
            <div className="input flex m-1.5">
              <input type="number" id="small-input" value={kval} onChange={handleKClusterChange} className=" h-7 p-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 text-xs focus:ring-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              {/* <button type="button" className="h-7 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-r-lg text-xs px-3">Submit</button> */}
            </div>
            <div className="btn">
              <button type="button" className="addbtn" onClick={isdoneclicked ? simulateAlgo : drawNode} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{isdoneclicked ? "Start" : "Add Node"}</button>            
              <button type="button" className="donebtn" onClick={isdoneclicked ? handleResetClick : handleclick_done} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{isdoneclicked ? "Reset" : "Done"}</button>  
            </div>          
            {/* <button type="button" className="strtbtn" onClick={simulateAlgo} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start</button>             */}
            {/* <button type="button" className="resetbtn" onClick={resetGraph} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>             */}
          </div>
      </div>
    </div>
  );
}

export default Graph;
