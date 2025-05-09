import React from 'react'
import SampleGraphCard from './SampleGraphCard';

function Graph1() {
  const nodes = [
    { id: 1, x: 50, y: 400 },
    { id: 2, x: 300, y: 200 },
    { id: 3, x: 700, y: 200 },
    { id: 4, x: 700, y: 600 },
    { id: 5, x: 300, y: 600 },
    { id: 6, x: 900, y: 400 },
  ];
  
  const edges = [
    { source: 1, target: 5, distance: 5 },
    { source: 1, target: 2, distance: 4 },
    { source: 2, target: 3, distance: 1 },
    { source: 3, target: 6, distance: 5 },
    { source: 6, target: 4, distance: 6 },
    { source: 4, target: 5, distance: 8 },
    { source: 2, target: 5, distance: 4 },
    { source: 3, target: 4, distance: 7 },
    { source: 2, target: 4, distance: 7 },
    { source: 1, target: 3, distance: 3 },
    { source: 1, target: 4, distance: 4 },
    { source: 2, target: 6, distance: 5 }
  ];

  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph1