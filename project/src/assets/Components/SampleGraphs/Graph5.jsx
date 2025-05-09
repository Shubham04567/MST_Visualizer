import React from 'react'
import SampleGraphCard from './SampleGraphCard';

function Graph5() {
  const nodes = [
    { id: 1, x: 138, y: 153 },
    { id: 2, x: 119, y: 230 },
    { id: 3, x: 312, y: 150 },
    { id: 4, x: 234, y: 236 },
    { id: 5, x: 152, y: 662 },
    { id: 6, x: 724, y: 182 },
    { id: 7, x: 842, y: 122 },
    { id: 8, x: 855, y: 250 },
    { id: 9, x: 709, y: 300 },
    { id: 10, x: 631, y: 120 },
    { id: 11, x: 607, y: 244 },
    { id: 12, x: 617, y: 541 },
    { id: 13, x: 726, y: 519 },
    { id: 14, x: 738, y: 628 },
    { id: 15, x: 588, y: 672 },
    { id: 16, x: 702, y: 734 },
    { id: 17, x: 838, y: 577 },
    { id: 18, x: 870, y: 712 },
    { id: 19, x: 174, y: 300 }
  ];
  
  const edges = [
    { source: 1, target: 2, distance: 3 },
    { source: 1, target: 3, distance: 6 },
    { source: 1, target: 4, distance: 4 },
    { source: 1, target: 2, distance: 3 },
    { source: 4, target: 19, distance: 2 },
    { source: 10, target: 7, distance: 8 },
    { source: 10, target: 6, distance: 4 },
    { source: 6, target: 7, distance: 5 },
    { source: 11, target: 9, distance: 3 },
    { source: 9, target: 8, distance: 4 },
    { source: 9, target: 7, distance: 12 },
    { source: 12, target: 13, distance: 3 },
    { source: 13, target: 14, distance: 5 },
    { source: 14, target: 17, distance: 4 },
    { source: 14, target: 18, distance: 7 },
    { source: 12, target: 15, distance: 6 },
    { source: 16, target: 12, distance: 10 },
    { source: 16, target: 17, distance: 11 },
    { source: 6, target: 3, distance: 20 },
    { source: 3, target: 5, distance: 41 },
    { source: 3, target: 13, distance: 35 },
  ];

  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph5