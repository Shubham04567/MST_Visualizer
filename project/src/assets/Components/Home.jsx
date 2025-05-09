import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 flex justify-center items-center flex-col">
      {/* Header */}
      <div className="w-full py-10 flex flex-col items-center justify-center">
        <h1 className="mb-2 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200 md:text-6xl lg:text-7xl text-center px-4">
          Applications of Kruskal's Algorithm
        </h1>
        <p className="mt-4 text-xl text-blue-100 max-w-3xl text-center px-6">
          Explore K-Clusters , maze generation using Kruskal's algorithm
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-16 px-4">
        <Link to="/Sample_graph">
          <button className="w-full h-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xl">Sample Graphs</span>
          </button>
        </Link>

        <Link to="/custom_graph">
          <button className="w-full h-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            <span className="text-xl">Custom Graphs</span>
          </button>
        </Link>

        <Link to="/maze">
          <button className="w-full h-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xl">Maze Generation</span>
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="w-full py-4 text-center text-blue-200 text-sm">
        <p>Explore the power of Kruskal's algorithm in various applications</p>
      </div>
    </div>
  );
}

export default Home;