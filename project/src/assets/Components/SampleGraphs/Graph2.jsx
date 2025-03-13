import React, { useEffect, useRef, useState } from 'react'
import "./layout.css"

function Graph2() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([
    { id: 1, x: 50, y: 150 },
    { id: 2, x: 200, y: 225 },
    { id: 3, x: 50, y: 300 },
    { id: 4, x: 50, y: 650 },
    { id: 5, x: 200, y: 450 },
    { id: 6, x: 600, y: 450 },
    { id: 7, x: 600, y: 225 },
    { id: 8, x: 900, y: 150 },
    { id: 9, x: 605, y: 640 },
    { id: 10, x: 900, y: 400 },
    { id: 11, x: 900, y: 600 },
  ]);
  
  const [edges, setEdges] = useState([
    { source: 1, target: 8, distance: 53 },
    { source: 1, target: 3, distance: 12 },
    { source: 2, target: 1, distance: 13 },
    { source: 2, target: 7, distance: 22 },
    { source: 7, target: 8, distance: 23 },
    { source: 6, target: 8, distance: 29 },
    { source: 7, target: 6, distance: 16 },
    { source: 3, target: 5, distance: 15 },
    { source: 3, target: 4, distance: 27 },
    { source: 5, target: 4, distance: 21 },
    { source: 2, target: 9, distance: 41 },
    { source: 4, target: 9, distance: 34 },
    { source: 2, target: 6, distance: 30 },
    { source: 6, target: 10, distance: 12 },
    { source: 6, target: 11, distance: 17 },
    { source: 11, target: 10, distance: 15 },
    { source: 6, target: 9, distance: 13 },
    { source: 9, target: 11, distance: 19 },
    { source: 5, target: 9, distance: 30 },

  ]);


  useEffect(() => {
    if (animateGraph) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous SVG content

    // Draw edges (lines)
    svg.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source).x)
      .attr("y1", d => nodes.find(n => n.id === d.source).y)
      .attr("x2", d => nodes.find(n => n.id === d.target).x)
      .attr("y2", d => nodes.find(n => n.id === d.target).y)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    // Add distances (text on edges)
    svg.selectAll("text")
      .data(edges)
      .enter()
      .append("text")
      .attr('class' , 'edge_labels')
      .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
      .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)
      .attr("fill", "green")
      .attr("font-size", "20px")
      .attr("dy", -5) // Offset for better visibility
      .text(d => d.distance)
      .style("cursor", "pointer") // Make it look clickable
      .on("click", (event, d) => {
        const newDistance = prompt(`Enter new weight for edge (${d.source} - ${d.target}):`, d.distance);
        if (newDistance !== null && !isNaN(newDistance)) {
          setEdges((prevEdges) =>
            prevEdges.map((edge) =>
              edge.source === d.source && edge.target === d.target
                ? { ...edge, distance: parseInt(newDistance, 10) }
                : edge
            )
          );
        }
      });

    // Draw nodes (circles)
    svg.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 10)
      .attr("fill", "blue");

    // Add node labels
    svg.selectAll("node-label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", d => d.x + 11)
      .attr("y", d => d.y + 5)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d => `${d.id}`);

  }, [edges]);

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
      .attr("stroke-width", 4)
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${initialScale})`);
  
    // Clone nodes
    const clonedNodes = svgClone.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", d => d.x-500)
      .attr("cy", d => d.y-500)
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${initialScale})`);
  
    const edgeweight = svgClone.selectAll("text")
      .data(edges)
      .enter()
      .append("text")
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

    for (let i = position; i < edges.length; i++) {
        let parent1 = findByRank(edges[i].source);
        let parent2 = findByRank(edges[i].target);

        if (parent1 !== parent2) {
            unionByRank(edges[i].source, edges[i].target);
            d => nodes.find(n => n.id === d.source).x
            nodes.find(n => n.id === edges[i].source).x
            let newLine = svgElement
                .insert("line", "circle")
                .attr("x1", nodes.find(n => n.id === edges[i].source).x)
                .attr("y1", nodes.find(n => n.id === edges[i].source).y)
                .attr("x2", nodes.find(n => n.id === edges[i].target).x)
                .attr("y2", nodes.find(n => n.id === edges[i].target).y)
                .attr("stroke", "red")
                .attr("stroke-width", 2);

            setTobeAdded(prev => prev-1);
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
        setPosition(prev => prev + 1);
        break;
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
              <button type="button" onClick={() => setAnimateGraph(prev => !prev)}  className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Simulate</button>            
              }
              {
                animateGraph && 
                <button type="button" onClick = {simulateAlgo}  className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95  text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start</button>
              }
              {
                animateGraph && 
                <button type="button" onClick={()=>window.location.reload()} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>
              }
            </div>          
          </div>
      </div>
    </div>
  )
}

export default Graph2

