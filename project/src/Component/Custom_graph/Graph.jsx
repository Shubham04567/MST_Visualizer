import React, { useRef, useState } from "react";
import ControlPanel from "./parts/ControlPanel";
import EdgeDisplay from "./parts/EdgeDisplay";
import StatusPanel from "./parts/StausPanel";
import useGraphNodes from "./GraphNode";
import GraphEdge from "./GraphEdge";
import Simulation from "./Simulation";

function Graph() {
  const svgRef = useRef(null);
  const edgeSvgRef = useRef(null);

  const { nodes, drawNode, resetNodes } = useGraphNodes(svgRef);

  const { edges, parent, rank, postDrawing, resetEdges } = GraphEdge(nodes);
  console.log("Graph rendered with nodes:", nodes);
  const [kval, setkval] = useState(0);
  const [isdoneclicked, setDoneClicked] = useState(false);
  const [toBeAdded, setToBeAdded] = useState(0);

  const { simulateAlgorithm, position, latestEdge, currentStatus, isAlgorithmComplete } = Simulation(toBeAdded, setToBeAdded, svgRef, edges, parent, rank);

  const handleDoneClick = () => {
    if (!kval || kval <= 0) {
      alert("Please enter a valid value for K.");
      return; 
    }
    console.log("done clicked: ", nodes);
    setToBeAdded(nodes.length - kval);
    setDoneClicked(true);
    postDrawing();
  };

  const handleResetClick = () => {
    setDoneClicked(false);
    resetNodes();
    resetEdges();
  };
 
  return (
    <div className="custom_container">
      <div className="graph-container">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="info-container">
        <div className="simulate" style={{height: "100%"}}>
            <div className="edges_show">
              <svg ref={edgeSvgRef} width="100%" height="100%"></svg>
              <EdgeDisplay/>
            </div>
            <div className="status">
              <StatusPanel latestEdge={latestEdge} curr_status={currentStatus} />
            </div>
        </div>
        <div className="control">
            <ControlPanel 
              kval={kval} 
              setkval={setkval} 
              isdoneclicked={isdoneclicked} 
              simulateAlgo={simulateAlgorithm} 
              drawNode={drawNode} 
              handleclick_done={handleDoneClick} 
              handleResetClick={handleResetClick} 
            /> 
          </div>
      </div>
    </div>
  );
}

export default Graph;
