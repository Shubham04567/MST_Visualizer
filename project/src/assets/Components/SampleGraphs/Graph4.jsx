import React from 'react'
import SampleGraphCard from './SampleGraphCard';

function Graph4() {
  const nodes = [
    { id: 1, x: 143, y: 440 },
    { id: 2, x: 290, y: 604 },
    { id: 3, x: 460, y: 435 },
    { id: 4, x: 284, y: 266 },
    { id: 5, x: 708, y: 324 },
    { id: 6, x: 905, y: 453 },
    { id: 7, x: 626, y: 577 }
  ];
  
  const edges = [
    { source: 1, target: 2, distance: 4 },
    { source: 2, target: 3, distance: 1 },
    { source: 3, target: 4, distance: 2 },
    { source: 4, target: 1, distance: 2 },
    { source: 1, target: 3, distance: 5 },
    { source: 4, target: 5, distance: 7 },
    { source: 5, target: 6, distance: 5 },
    { source: 6, target: 7, distance: 7 },
    { source: 5, target: 7, distance: 1 },
    { source: 5, target: 3, distance: 4 },
    { source: 3, target: 7, distance: 3 },
    { source: 2, target: 7, distance: 4 }
  ];

  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph4