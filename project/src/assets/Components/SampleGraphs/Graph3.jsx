import React from 'react'
import SampleGraphCard from './SampleGraphCard';

function Graph3() {
  const nodes = [
    { id: 1, x: 102, y: 562 },
    { id: 2, x: 195, y: 379 },
    { id: 3, x: 252, y: 452 },
    { id: 4, x: 218, y: 516 },
    { id: 5, x: 506, y: 227 },
    { id: 6, x: 683, y: 142 },
    { id: 7, x: 694, y: 209 },
    { id: 8, x: 837, y: 220 },
    { id: 9, x: 554, y: 486 },
    { id: 10, x: 448, y: 762 }
  ];
  
  const edges = [
    { source: 1, target: 2, distance: 6 },
    { source: 2, target: 3, distance: 2 },
    { source: 3, target: 4, distance: 2 },
    { source: 1, target: 4, distance: 3 },
    { source: 2, target: 4, distance: 4 },
    { source: 2, target: 5, distance: 9 },
    { source: 5, target: 6, distance: 4 },
    { source: 5, target: 3, distance: 9 },
    { source: 6, target: 7, distance: 1 },
    { source: 6, target: 8, distance: 4 },
    { source: 7, target: 5, distance: 5 },
    { source: 3, target: 9, distance: 8 },
    { source: 4, target: 9, distance: 9 },
    { source: 1, target: 10, distance: 9 },
    { source: 9, target: 10, distance: 8 },
    { source: 4, target: 10, distance: 9 },
    { source: 9, target: 5, distance: 7 },
    { source: 7, target: 9, distance: 9 },
    { source: 9, target: 8, distance: 10 },
    { source: 10, target: 8, distance: 18 },
    { source: 7, target: 8, distance: 3 }


  ];

  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph3