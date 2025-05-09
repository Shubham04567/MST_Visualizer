import React, { useEffect, useRef, useState } from 'react'
import "./layout.css"

function SampleGraphCard(props) {

  const [disabled , setDisabled] = useState("");

  const svgRef = useRef(null);
  const [nodes, setNodes] = useState(props.nodes);
  const [edges, setEdges] = useState(props.edges);

  useEffect(() => {
    if (animateGraph) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content
  
    // Define color palette
    const nodeColor = "#4dabf7";
    const nodeStrokeColor = "#f8f9fa";
    const edgeColor = "#ff6b6b";
    const edgeTextColor = "#ffd43b";
    const hoverColor = "#69db7c";
    const textColor = "#e9ecef";
  
    // Define glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
  
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");
  
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
  
    // Draw edges
    svg.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source).x)
      .attr("y1", d => nodes.find(n => n.id === d.source).y)
      .attr("x2", d => nodes.find(n => n.id === d.target).x)
      .attr("y2", d => nodes.find(n => n.id === d.target).y)
      .attr("stroke", edgeColor)
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .on("mouseover", function () {
        d3.select(this)
          .attr("stroke", hoverColor)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", edgeColor)
          .attr("stroke-width", 2);
      });
  
    // Edge distance labels
    svg.selectAll("text.edge_labels")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "edge_labels")
      .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
      .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)
      .attr("fill", edgeTextColor)
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", -8)
      .text(d => d.distance)
      .style("cursor", "pointer")
      .style("filter", "url(#glow)")
      .on("mouseover", function () {
        d3.select(this)
          .attr("fill", hoverColor)
          .attr("font-size", "18px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", edgeTextColor)
          .attr("font-size", "16px");
      })
      .on("click", (event, d) => {
        const newDistance = prompt(`Enter new weight for edge (${d.source} - ${d.target}):`, d.distance);
        if (newDistance !== null && !isNaN(newDistance)) {
          setEdges(prevEdges =>
            prevEdges.map(edge =>
              edge.source === d.source && edge.target === d.target
                ? { ...edge, distance: parseInt(newDistance, 10) }
                : edge
            )
          );
        }
      });
  
    // Draw nodes
    svg.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 12)
      .attr("fill", nodeColor)
      .attr("stroke", nodeStrokeColor)
      .attr("stroke-width", 2)
      .style("filter", "url(#glow)")
      .on("mouseover", function () {
        d3.select(this)
          .attr("fill", hoverColor)
          .attr("r", 14);
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", nodeColor)
          .attr("r", 12);
      });
  
    // Node labels
    svg.selectAll("text.node-labels")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "node-labels")
      .attr("x", d => d.x)
      .attr("y", d => d.y + 1)
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", textColor)
      .text(d => `${d.id}`);
  }, [edges, nodes]);
  

  const [animateGraph, setAnimateGraph] = useState(false);
  const svgRef2 = useRef(null)

  useEffect(() => {
    if (!animateGraph) return;
  
    const svgClone = d3.select(svgRef2.current);
    svgClone.selectAll("*").remove(); // Clear previous content

    const centerX = 180;
    const centerY = 200;
  
    const initialScale = 0.5;
    const finalScale = 0.3; // Shrinking effect
  

    // Define color palette
    const nodeColor = "#4dabf7";
    const edgeColor = "#ff6b6b";


    // Clone edges
    const clonedEdges = svgClone.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source).x-500)
      .attr("y1", d => nodes.find(n => n.id === d.source).y-500)
      .attr("x2", d => nodes.find(n => n.id === d.target).x-500)
      .attr("y2", d => nodes.find(n => n.id === d.target).y-500)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${initialScale})`)
    

    // Clone nodes
    const clonedNodes = svgClone.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", d => d.x-500)
      .attr("cy", d => d.y-500)
      .attr("r", 15)
      .attr("fill", nodeColor)
      .attr("stroke-width", 2)
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${initialScale})`);
  
    const edgeweight = svgClone.selectAll("text.edge_labels")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "edge_labels")
      .attr("x", d => ((nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)-500)
      .attr("y", d => ((nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)-500)
      .attr("fill", "green")
      .attr("font-size", "20px")
      .attr("dy", -5)
      .text(d => d.distance)

    // Animate movement and shrinking effect
    clonedEdges.transition()
      .duration(1000)
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${finalScale})`);
  
    edgeweight.transition()
    .duration(1000)
    .attr("transform", `translate(${centerX}, ${centerY}) scale(${finalScale})`)
    .attr("font-size" , "40px");

    clonedNodes.transition()
      .duration(1000)
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${finalScale})`);

    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();
    svg.selectAll(".edge_labels").remove();
    parent.current = nodes.map((_, i) => i);
    rank.current = new Array(nodes.length).fill(0);

    setEdges((prevEdges) =>
      [...prevEdges].sort((a, b) => a.distance - b.distance) // Sorting by distance in ascending order
    );

  }, [animateGraph]);

  
  const [kval , setKVal] = useState(1);
  const [tobeAdded , setTobeAdded] = useState(nodes.length - kval);
  const [position, setPosition] = useState(0);
  const parent = useRef([]);
  const rank = useRef([]);
  const [Node_a,setnode_a] = useState(-1);
  const [Node_b,setnode_b] = useState(-1);
  const [edge_lenght,setnode_lenght] = useState(-1);
  const [curr_status,setcurr_status] = useState(-1);

  useEffect(()=>{
    setTobeAdded(nodes.length - kval);
  } , [kval])

  const handleKClusterChange = (event) => {
    setKVal(parseInt(event.target.value, 10));
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
    const x1 = nodes.find(n => n.id === pt1).x
    const y1 = nodes.find(n => n.id === pt1).y
    const x2 = nodes.find(n => n.id === pt2).x
    const y2 = nodes.find(n => n.id === pt2).y

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
    const edgeColor = "#ff6b6b";
    const brokenLines = svgElement.selectAll(".broken-line")
        .data(segments)
        .enter().append("line")
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke", edgeColor)
        .attr("stroke-opacity", 0.8)
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

  // Generate a random HSL color with fixed saturation and lightness.
  const getRandomHSLColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 50%)`;
  };

  const assign_color = () => {
      const compColors = {};
    
      nodes.forEach((node) => {
        const compId = findByRank(node.id);
        if (!compColors.hasOwnProperty(compId)){
          // Generate distinct random colors for nodes and edges
          const nodeColor = getRandomHSLColor();
          const edgeColor = getRandomHSLColor();
          compColors[compId] = { node: nodeColor, edge: edgeColor };
        }
        d3.select(svgRef.current)
          .selectAll("circle")
          .filter(d => d.id === node.id)
          .attr("fill", compColors[compId].node);
      });

      console.log(compColors);
    
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
      const compId = findByRank(node.id);
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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(speed);
  
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  // Call simulateAlgo function with the current speed.
  const handleStartSimulation = () => {

    simulateAlgo(false, speed);
  };

  const simulateAlgo = async (type) => {
    if (tobeAdded <= 0){
      console.log('reached')
      assign_color();
      assignComponentBackgrounds();
      return;
    }
    const svgElement = d3.select(svgRef.current);
    if (!svgElement.node()) return;

    let localTobeAdded = tobeAdded;
    const edgeColor = "#ff6b6b";
    for (let i = position; i < edges.length; i++) {
        console.log("i: " , i);
        if (localTobeAdded <= 0) {
          console.log("Graph is completed");
          assign_color();
          assignComponentBackgrounds();
          return;
        }
        console.log("tobeadded: ",localTobeAdded);
        let parent1 = findByRank(edges[i].source);
        let parent2 = findByRank(edges[i].target);

        if (parent1 !== parent2) {
            unionByRank(edges[i].source, edges[i].target);
            d => nodes.find(n => n.id === d.source).x
            nodes.find(n => n.id === edges[i].source).x
            let newLine = svgElement
                .insert("line", "circle")
                .attr("data-idx1" , edges[i].source)
                .attr("x1", nodes.find(n => n.id === edges[i].source).x)
                .attr("y1", nodes.find(n => n.id === edges[i].source).y)
                .attr("x2", nodes.find(n => n.id === edges[i].target).x)
                .attr("y2", nodes.find(n => n.id === edges[i].target).y)
                .attr("stroke", edgeColor)
                .attr("stroke-width", 2);
            localTobeAdded--;
            setnode_a(edges[i].source);
            setnode_b(edges[i].target);
            setnode_lenght(edges[i].distance);
            setcurr_status("ADDED");
        } 
        else {
          const existingLine = svgElement.selectAll("line")
              .filter(function () {
                  return (
                      +this.getAttribute("x1") === nodes.find(n => n.id === edges[i].source).x &&
                      +this.getAttribute("y1") === nodes.find(n => n.id === edges[i].source).y &&
                      +this.getAttribute("x2") === nodes.find(n => n.id === edges[i].target).x &&
                      +this.getAttribute("y2") === nodes.find(n => n.id === edges[i].target).y
                  );
              });
              
              setnode_a(edges[i].source);
              setnode_b(edges[i].target);
              setnode_lenght(edges[i].distance);
              setcurr_status("SKIPPED");
            // Apply the breaking animation to the existing line
            line_remove(svgElement, existingLine, edges[i].source, edges[i].target);
        }

        if (type === true) break; 
        await sleep(2500 - speedRef.current);
        
      }
      console.log(localTobeAdded)
      setTobeAdded(localTobeAdded);
      setPosition(prev => prev + 1);
      if (localTobeAdded <= 0) {
        console.log("Graph is completed");
        assign_color();
        assignComponentBackgrounds();
        return;
      }
    };

  return (
    <div className='custom_container'>
      <div className="graph-container">
        <svg ref={svgRef} width="100%" height="100%" ></svg>
      </div>
      <div className="info-container">
        <div className="simulate" style={{height: "100%"}}>
            <div className="edges_show" style={{}}>
              <svg ref={svgRef2} width="100%" height="100%"></svg>
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
              <input disabled={animateGraph} type="number" id="small-input" value={kval} onChange={handleKClusterChange} className=" h-7 p-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 text-xs focus:ring-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="btn">
              {
                !animateGraph && 
              <button type="button" onClick={() => setAnimateGraph(prev => !prev)}  className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next</button>            
              }
              {
                animateGraph && 
                <button type="button" disabled={disabled === "simulate" ?  true : false} onClick = {()=>{
                  setDisabled("run");
                  simulateAlgo(true);
                }}
                className={
                  `transition-transform duration-150 ease-in-out text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 
                  ${disabled === "simulate"
                    ? "bg-gradient-to-br from-green-400 to-blue-600 cursor-not-allowed"
                    : "bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl hover:scale-105 active:scale-95"}`
                }
                >Run</button>
              }
              {
                animateGraph && 
                <button type="button" onClick={()=>window.location.reload()} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>
              }
              {
                animateGraph && 
                <button type="button" disabled={disabled === "simulate" || disabled == "run"  ?  true : false} onClick = {()=>{
                  setDisabled("simulate");
                  handleStartSimulation();
                }} 
                className={
                  `transition-transform duration-150 ease-in-out text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 
                  ${disabled === "simulate" || disabled === "run"
                    ? "bg-gradient-to-br from-green-400 to-blue-600 cursor-not-allowed"
                    : "bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl hover:scale-105 active:scale-95"}`
                } 
                >Simulate</button>
              }
              {
                <label>
                  Speed: {speed} ms
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={handleSpeedChange}
                  />
                </label>
              }
            </div>          
          </div>
      </div>
    </div>
  )
}

export default SampleGraphCard

