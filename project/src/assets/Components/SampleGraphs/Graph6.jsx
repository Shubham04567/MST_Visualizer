import React from 'react'
import SampleGraphCard from './SampleGraphCard';

function Graph6() {
  const nodes = [
    { id: 1, x: 182, y: 238 },
    { id: 2, x: 436, y: 231 },
    { id: 3, x: 176, y: 526 },
    { id: 4, x: 431, y: 526 },
    { id: 5, x: 663, y: 324 },
    { id: 6, x: 342, y: 339 },
    { id: 7, x: 374, y: 666 },
    { id: 8, x: 682, y: 666 },
  ];
  
  const edges = [
    { source: 1, target: 2, distance: 10 },
    { source: 1, target: 3, distance: 15 },
    { source: 3, target: 4, distance: 10 },
    { source: 4, target: 2, distance: 15 },
    { source: 6, target: 5, distance: 13 },
    { source: 6, target: 7, distance: 18 },
    { source: 7, target: 8, distance: 14 },
    { source: 5, target: 8, distance: 17 },
    { source: 1, target: 6, distance: 10 },
    { source: 2, target: 5, distance: 10 },
    { source: 3, target: 7, distance: 10 },
    { source: 4, target: 8, distance: 16 },
    { source: 6, target: 2, distance: 5 },
    { source: 5, target: 4, distance: 13 },
    { source: 1, target: 2, distance: 10 },
    { source: 1, target: 7, distance: 20 },
    { source: 7, target: 4, distance: 8 },
    { source: 8, target: 2, distance: 22 },


    
  ];

  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph6