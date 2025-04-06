import React from 'react'

export default function ControlPanel({kval, setkval, isdoneclicked, simulateAlgo, drawNode, handleclick_done, handleResetClick}) {

    const handleKClusterChange = (event) => {
        setkval(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter K for K-Clustering:</label>
            <div className="input flex m-1.5">
                <input type="number" id="small-input" value={kval} onChange={handleKClusterChange} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 h-7 p-1 text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 text-xs focus:ring-0 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div className="btn">
                <button type="button" onClick={isdoneclicked ? ()=>simulateAlgo(true) : drawNode} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{isdoneclicked ? "Start" : "Add Node"}</button>            
                <button type="button" onClick={handleclick_done} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" style={isdoneclicked ? {display: "none"} :{} }>Done</button>  
                <button type="button" onClick={handleResetClick} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>  
                <button type="button" onClick={() => simulateAlgo(false)} className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-0 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Simulate</button>  
            </div> 
        </div>
    )
}
