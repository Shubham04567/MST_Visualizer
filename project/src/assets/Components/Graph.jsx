import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import gsap from "gsap";

function Graph() {
  const [kval , setKVal] = useState(0);

  const kcluster = () => {
    const inputid = document.getElementById("kcluster");
    console.log(inputid.value);
    setKVal(parseInt(inputid.value, 10)); // Ensure it's an integer
  };

  const parent = [];
  const rank = [];

  const findbyRank = (idx1) => {
    if (parent[idx1] === idx1) return idx1;
    return (parent[idx1] = findbyRank(parent[idx1]));
  };

  const UnionbyRank = (idx1, idx2) => {
    let parent_1 = findbyRank(idx1);
    let parent_2 = findbyRank(idx2);
    if (parent_1 !== parent_2) {
      if (rank[parent_1] > rank[parent_2]) {
        parent[parent_2] = parent_1;
      } else if (rank[parent_1] < rank[parent_2]) {
        parent[parent_1] = parent_2;
      } else {
        rank[parent_1] += 1;
        parent[parent_2] = parent_1;
      }
    }
  };

  const svg = d3.select("#svg1");
  const node = [];
  const edges = [];
  let index = 0;

  const draw_node = () => {
    svg.on("click", function (event) {
      const [x, y] = d3.pointer(event, this);

      svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 5).attr("fill", "blue");

      svg
        .append("text")
        .attr("x", x + 20)
        .attr("y", y + 5)
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text(index);

      node.push({ x, y, index });
      index++; // Increment the index
    });
  };

  const post_drawing = () => {
    for (let i = 0; i < node.length; i++) {
      for (let j = i + 1; j < node.length; j++) {
        let x1 = node[i].x;
        let x2 = node[j].x;
        let y1 = node[i].y;
        let y2 = node[j].y;
        let dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        edges.push({
          dist: dist,
          point1: [x1, y1],
          point2: [x2, y2],
          idx1: node[i].index,
          idx2: node[j].index,
        });
      }
    }
    edges.sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < node.length; i++) {
      parent.push(i);
      rank.push(0);
    }
    tobeadded = node.length - kval;
  };

  const line_remove = (lineSelection, pt1, pt2) => {
    const x1 = pt1[0],
      y1 = pt1[1],
      x2 = pt2[0],
      y2 = pt2[1];
    const numSegments = 8;
    const segmentLengthX = (x2 - x1) / numSegments;
    const segmentLengthY = (y2 - y1) / numSegments;

    lineSelection.remove();

    const segments = [];
    for (let i = 0; i < numSegments; i++) {
      segments.push({
        x1: x1 + i * segmentLengthX,
        y1: y1 + i * segmentLengthY,
        x2: x1 + (i + 1) * segmentLengthX,
        y2: y1 + (i + 1) * segmentLengthY,
      });
    }

    const brokenLines = svg
      .selectAll(".broken-line")
      .data(segments)
      .enter()
      .append("line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("class", "broken-line");

    brokenLines.each(function (d, i) {
      gsap.to(this, {
        duration: 0.5,
        delay: i * 0.1,
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => d3.select(this).remove(),
      });
    });
  };

  let position = 0;
  let tobeadded;

  const simulatealgo = () => {
    if (tobeadded <= 0) return;
    for (let i = position; i < edges.length; i++) {
      let parent_1 = findbyRank(edges[i].idx1);
      let parent_2 = findbyRank(edges[i].idx2);
      if (parent_1 !== parent_2) {
        UnionbyRank(edges[i].idx1, edges[i].idx2);
        tobeadded -= 1;
        svg.append("line")
          .attr("x1", edges[i].point1[0])
          .attr("y1", edges[i].point1[1])
          .attr("x2", edges[i].point2[0])
          .attr("y2", edges[i].point2[1])
          .attr("stroke", "red")
          .attr("stroke-width", 2);
      } else {
        const existingLine = svg.selectAll("line").filter(function () {
          return this.getAttribute("x1") == edges[i].point1[0] &&
            this.getAttribute("y1") == edges[i].point1[1] &&
            this.getAttribute("x2") == edges[i].point2[0] &&
            this.getAttribute("y2") == edges[i].point2[1];
        });

        line_remove(existingLine, edges[i].point1, edges[i].point2);
      }

      position++;
      break;
    }
  };

  useEffect(() => {
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
  }, []);

  const stop_drawing = () => {
    svg.on("click", null);
    post_drawing();
    document.getElementById("addnode").remove();
    document.getElementById("done").remove();
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("restart").style.display = "inline-block";
  };

  return (
    <>
      <svg id="svg1" width="90vw" height="82vh" style={{ border: "1px solid black" }}></svg>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="kcluster">Enter K for K-Clustering:</label>
        <input type="text" id="kcluster" />
        <button onClick={kcluster}>Submit</button>
      </div>

      <div style={{ display: "flex", justifyContent: "end" }}>
        <button id="addnode" onClick={draw_node}>Add Node</button>
        <button id="done" onClick={stop_drawing}>Done</button>
        <button id="start" onClick={simulatealgo}>Start</button>
        <button id="restart" onClick={() => window.location.reload()}>Restart</button>
      </div>
    </>
  );
}

export default Graph;
