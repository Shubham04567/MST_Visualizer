import React, { useRef, useState } from "react";
import ControlPanel from "./parts/ControlPanel";
import EdgeDisplay from "./parts/EdgeDisplay";
import StatusPanel from "./parts/StausPanel";
import useGraphNodes from "./GraphNode";


function Graph() {
  const svgRef = useRef(null);
  const edgeSvgRef = useRef(null);

  const { nodes, drawNode, resetNodes} = useGraphNodes(svgRef);


  const [kval, setkval] = useState(0);
  const [isdoneclicked, setDoneClicked] = useState(false);


  const handleDoneClick = () => {
    if (!kval || kval <= 0) {
      alert("Please enter a valid value for K.");
      return; 
    }
    setDoneClicked(true);
    // postDrawing();
  };

  const handleResetClick = () => {
    setDoneClicked(false);
    resetNodes();
    // resetEdges();
  };
 
  return (
    <div className="custom_container">
      <div className="graph-container">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>

      <div className="info-container">
        <div className="simulate" style={{height: "100%"}}>
            <div className="edges_show">
              {/* <svg ref={edge_svgRef} width="100%" height="100%"></svg> */}
              {/* <EdgeDisplay/> */}
            </div>
            <div className="status">
              <StatusPanel />
            </div>
        </div>
        <div className="control">
            <ControlPanel kval={kval} setkval={setkval} isdoneclicked={isdoneclicked} handleclick_done={handleDoneClick} handleResetClick={handleResetClick} drawNode={drawNode}/> 
          </div>
      </div>
    </div>
  );
}

export default Graph;
