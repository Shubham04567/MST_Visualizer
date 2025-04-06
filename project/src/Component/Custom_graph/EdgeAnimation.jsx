import * as d3 from "d3";
import gsap from "gsap";


// Draws an edge with animation

export function drawEdge(svgElement, edge) {
  const newLine = svgElement
    .insert("line", "circle")
    .attr("data-idx1", edge.idx1)
    .attr("data-idx2", edge.idx2)
    .attr("x1", edge.point1.x)
    .attr("y1", edge.point1.y)
    .attr("x2", edge.point1.x) 
    .attr("y2", edge.point1.y)
    .attr("stroke", "red")
    .attr("stroke-width", 2);

  gsap.to(newLine.node(), {
    attr: { x2: edge.point2.x, y2: edge.point2.y },
    duration: 0.8,
    ease: "power2.out"
  });
}


// Removes an edge with breaking animation effect

export function removeEdge(svgElement, edge) {
  const existingLine = svgElement.selectAll("line")
    .filter(function () {
      const x1Match = +this.getAttribute("x1") === edge.point1.x;
      const y1Match = +this.getAttribute("y1") === edge.point1.y;
      const x2Match = +this.getAttribute("x2") === edge.point2.x;
      const y2Match = +this.getAttribute("y2") === edge.point2.y;
      return x1Match && y1Match && x2Match && y2Match;
    });

  lineBreakAnimation(svgElement, existingLine, edge.point1, edge.point2);
}

/**
 * Animates a line breaking into segments
 */
export function lineBreakAnimation(svgElement, lineSelection, pt1, pt2) {
  const x1 = pt1.x, y1 = pt1.y, x2 = pt2.x, y2 = pt2.y;
  const numSegments = 8; // Number of breaking segments
  const segmentLengthX = (x2 - x1) / numSegments;
  const segmentLengthY = (y2 - y1) / numSegments;

  // Hide the original line
  lineSelection.remove();

  // Create broken line segments
  const segments = [];
  for (let i = 0; i < numSegments; i++) {
    segments.push({
      x1: x1 + i * segmentLengthX,
      y1: y1 + i * segmentLengthY,
      x2: x1 + (i + 1) * segmentLengthX,
      y2: y1 + (i + 1) * segmentLengthY
    });
  }

  const brokenLines = svgElement.selectAll(".broken-line")
    .data(segments)
    .enter().append("line")
    .attr("x1", d => d.x1)
    .attr("y1", d => d.y1)
    .attr("x2", d => d.x2)
    .attr("y2", d => d.y2)
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("class", "broken-line");

  // Animate the breaking effect with GSAP
  brokenLines.each(function (d, i) {
    gsap.to(this, {
      duration: 0.5, 
      delay: i * 0.1, 
      x: (Math.random() - 0.5) * 50, 
      y: (Math.random() - 0.5) * 50,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => d3.select(this).remove()
    });
  });
}
