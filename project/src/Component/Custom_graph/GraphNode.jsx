import { useState, useRef } from "react";
import * as d3 from "d3";
import gsap from "gsap";


function useGraphNodes(svgRef) {
  const [nodes, setNodes] = useState([]);
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
      
      setNodes((prevNodes) => [...prevNodes, { x, y, index: currentIndex }]);
      indexRef.current += 1;
    });
  };

  const resetNodes = () => {
    setNodes([]);
    indexRef.current = 0;
  };

  return {
    nodes,
    drawNode,
    resetNodes
  };
}

export default useGraphNodes;
