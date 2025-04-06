import { useState, useRef } from 'react'

export default function GraphEdge(nodes) {
    const [edges, setEdges] = useState([]);
    
    const parent = useRef([]);
    const rank = useRef([]);

    //for drawing the edges
    const postDrawing = () => {
        console.log("this node given in graph: \n", nodes);
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
        console.log("added edges: ", newEdges);
        setEdges(newEdges);
      };

      const resetEdges = () => {
        setEdges([]);
      };
    
    return {
        edges,
        parent,
        rank,
        postDrawing,
        resetEdges,
    }
}
