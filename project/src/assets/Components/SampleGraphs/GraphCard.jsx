import React from 'react'

function GraphCard(props) {
  return (
    <div 
      className="w-full h-75 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center"
    >
        <img className="rounded-t-lg w-full h-17/20 object-cover" src={props.src} alt="" />
        <h5 className="text-lg font-medium text-gray-900 dark:text-white text-center p-2">{props.name}</h5>
    </div>
  )
}

export default GraphCard
