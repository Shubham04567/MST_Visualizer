import React from 'react'

export default function StausPanel({latestEdge,curr_status}) {
  return (
    <div className="flex flex-col items-start pl-8 text-black">
        <p>Node1: <b>{!latestEdge ? "N/A" : latestEdge.idx1}</b></p>
        <p>Node2: <b>{!latestEdge ? "N/A" : latestEdge.idx2}</b></p>
        <p>EdgesLength: <b>{!latestEdge ? "N/A" : latestEdge.dist.toFixed(2)}</b></p>
        <p>Status : <b>{curr_status==-1 ? "N/A" : curr_status}</b></p>
    </div>
  )
}
