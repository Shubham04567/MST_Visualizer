import { useState } from 'react'
import * as d3 from "d3";
import { unionByRank, findByRank } from "./GraphAlgorithms";
import { drawEdge, removeEdge } from "./EdgeAnimation"

export default function Simulation(toBeAdded, setToBeAdded, svgRef, edges, parent, rank) {
    const [position, setPosition] = useState(0);
    const [latestEdge, setLatestEdge] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(-1);
    const [isAlgorithmComplete, setIsAlgorithmComplete] = useState(false);

    // Simulate clustering algorithm
    const simulateAlgorithm = (singleStep = false) => {
        if (position >= edges.length || edges.length === 0) {
            if (!isAlgorithmComplete && toBeAdded <= 0) {
                alert("Graph is completed");
                setIsAlgorithmComplete(true);
            } else if (edges.length === 0) {
                alert("Please click 'Done' first to generate edges");
            }
            return;
        }

        if (toBeAdded <= 0) {
            alert("Graph is completed");
            setIsAlgorithmComplete(true);
            return;
        }
        
        const svgElement = d3.select(svgRef.current);
        if (!svgElement.node()) return;

        let localPosition = position;
        let localToBeAdded = toBeAdded;

        for (let i = position; i < edges.length; i++) {
            if (localToBeAdded <= 0) {
                alert("Graph is completed");
                setIsAlgorithmComplete(true);
                break;
            }
        
            const edge = edges[i];
            let parentId1 = findByRank(parent.current, edge.idx1);
            let parentId2 = findByRank(parent.current, edge.idx2);

            if (parentId1 !== parentId2) {
                unionByRank(parent.current, rank.current, edge.idx1, edge.idx2);
                localToBeAdded--;
                drawEdge(svgElement, edge);
                setLatestEdge(edge);
                setCurrentStatus("EDGE ADDED");
            } 
            else {
                removeEdge(svgElement, edge);
                setLatestEdge(edge);
                setCurrentStatus("CYCLE DETECTED");
            }
            
            localPosition = i + 1;
            if (singleStep) break;
        }

        setToBeAdded(localToBeAdded);
        setPosition(localPosition);
    };

    return {
        simulateAlgorithm,
        position,
        latestEdge,
        currentStatus,
        isAlgorithmComplete
    }
}
