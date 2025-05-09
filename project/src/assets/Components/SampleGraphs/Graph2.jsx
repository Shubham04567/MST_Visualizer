import React, { useEffect, useRef, useState } from 'react'
import "./layout.css"
import SampleGraphCard from './SampleGraphCard';

function Graph2() {
  const nodes = [
    { id: 1, x: 50, y: 150 },
    { id: 2, x: 200, y: 225 },
    { id: 3, x: 50, y: 300 },
    { id: 4, x: 50, y: 650 },
    { id: 5, x: 200, y: 450 },
    { id: 6, x: 600, y: 450 },
    { id: 7, x: 600, y: 225 },
    { id: 8, x: 900, y: 150 },
    { id: 9, x: 605, y: 640 },
    { id: 10, x: 900, y: 400 },
    { id: 11, x: 900, y: 600 },
  ];
  
  const edges = [
    { source: 1, target: 8, distance: 53 },
    { source: 1, target: 3, distance: 12 },
    { source: 2, target: 1, distance: 13 },
    { source: 2, target: 7, distance: 22 },
    { source: 7, target: 8, distance: 23 },
    { source: 6, target: 8, distance: 29 },
    { source: 7, target: 6, distance: 16 },
    { source: 3, target: 5, distance: 15 },
    { source: 3, target: 4, distance: 27 },
    { source: 5, target: 4, distance: 21 },
    { source: 2, target: 9, distance: 41 },
    { source: 4, target: 9, distance: 34 },
    { source: 2, target: 6, distance: 30 },
    { source: 6, target: 10, distance: 12 },
    { source: 6, target: 11, distance: 17 },
    { source: 11, target: 10, distance: 15 },
    { source: 6, target: 9, distance: 13 },
    { source: 9, target: 11, distance: 19 },
    { source: 5, target: 9, distance: 30 },

  ];


  return (
    <> 
      <SampleGraphCard nodes={nodes} edges = {edges}/>
    </>
  )
}

export default Graph2

