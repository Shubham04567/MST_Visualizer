import React from 'react'

function GraphCard(props) {
  return (
    <div className='max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
        <img className="rounded-t-lg" src="./../../../../hacker.jpg" alt="" />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{props.name}</h5>
    </div>
  )
}

export default GraphCard