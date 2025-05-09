import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";

const injectCustomStyles = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      .introjs-overlay {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(6px);
      }
  
      .introjs-helperLayer {
        box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.8);
        border-radius: 12px !important;
        transition: all 0.2s ease-in-out;
      }

      /* Ensure tooltip text is visible */
    .introjs-tooltip, .introjs-tooltiptext {
      color: black !important;
      background-color: white !important;
    }

  
      /* Blur everything except highlighted element */
      body.introjs-showElement *:not(.introjs-showElement):not(.introjs-helperLayer):not(.introjs-tooltip) {
        filter: blur(4px);
        pointer-events: none;
      }
  
      /* Restore interactivity to tooltips and highlighted element */
      .introjs-showElement, .introjs-helperLayer, .introjs-tooltip {
        filter: none !important;
        pointer-events: auto !important;
        z-index: 10000 !important;
      }
    `;
    document.head.appendChild(style);
  };

const Tutorial = forwardRef((props, ref) => {
    useEffect(() => {
        injectCustomStyles();
        // Check if all elements exist
  const elements = [
    "#step-graph-svg",
    "#step-edge-visualization",
    "#step-status-section",
    "#step-k-input",
    "#step-add-node",
    "#step-done",
    "#step-reset",
    "#step-simulate"
  ];
  
  elements.forEach(id => {
    const el = document.querySelector(id);
    console.log(`Element ${id} exists:`, !!el);
  });
    }, []);


  useImperativeHandle(ref, () => ({
    start: () => {
      const intro = introJs();
      intro.setOptions({
        steps: [
          {
            element: "#step-graph-svg",
            intro: "This is screen where simulation of algorithm will happen",
          },
          {
            element: "#step-edge-visualization",
            intro: `
                <p>Click here to start the simulation.</p>
                <ul>
                <li>It will highlight each step.</li>
                <li>You can pause or reset anytime.</li>
                </ul>
            `,
          },
          {
            element: "#step-status-section",
            intro: "This section shows the current status of the simulation.",
          },
          {
            element: "#step-k-input",
            intro: "You can input a value for K-clustering here.",
          },
          {
            element: "#step-add-node",
            intro: "Click here to add a node to the graph.",
          },
          {
            element: "#step-done",
            intro: "Once all nodes are added, click Done.",
          },
          {
            element: "#step-reset",
            intro: "This will reset the entire graph.",
          },
          {
            element: "#step-simulate",
            intro: "Start simulation once everything is ready.",
          },
        ],
        showProgress: true,
        showBullets: true,
        disableInteraction: false,
        highlightClass: "custom-highlight",
      });
      intro.start();
      
    },
  }));

  return null; // No UI needed
});

export default Tutorial;
